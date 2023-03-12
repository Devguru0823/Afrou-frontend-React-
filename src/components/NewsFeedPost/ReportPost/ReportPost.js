import React, {Component} from 'react';

import Input from '../../../components/Input/Input';
import axios from "../../../utils/axiosConfig";
import {toast} from "react-toastify";
import {toastOptions} from "../../../constants/toastOptions";

class EditPost extends Component {
  state = {
    controls: {
      post_text: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Reason for reporting...',
          rows: 1
        },
        className: 'mytextarea',
        value: '',
        validation: {
          required: true
        },
        valid: true,
        touched: false,
        outerDivClassName: 'col-md-12'
      },
    },
    formIsValid: false,
    emojiVisible: false,
    isLoading: false
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({isLoading: true});
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token
      }
    };
    const data = {
      report_reason: this.state.controls.post_text.value,
    };
    axios.post(`/posts/${this.props.postId}/report`, data, config)
      .then(response => {
        toast.success(response.data.data, toastOptions);
        this.setState({isLoading: false});
        this.props.onClose();
      })
      .catch(() => {
        toast.error('Something went wrong!', toastOptions);
        this.setState({isLoading: false});
      });
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if (rules.isFile) {
      isValid = value !== '' && isValid
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid
    }

    return isValid;
  };

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.controls
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedFormElement.value = event.target.files ? event.target.files[0] : event.target.value;
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({controls: updatedOrderForm, formIsValid: formIsValid});
  };

  render() {
    const {onClose} = this.props;

    const formElementsArray = [];
    for (let key in this.state.controls) {
      formElementsArray.push({
        id: key,
        config: this.state.controls[key],
      });
    }

    let form = (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          {
            formElementsArray.map(formElement => (
              <div className={`${formElement.config.outerDivClassName} report-area`} key={formElement.id} id="myptarea">
                <Input
                  elementType={formElement.config.elementType}
                  elementConfig={formElement.config.elementConfig}
                  value={formElement.config.value}
                  invalid={!formElement.config.valid}
                  shouldValidate={formElement.config.validation}
                  touched={formElement.config.touched}
                  label={formElement.config.label}
                  className={formElement.config.className}
                  onlyClassName={formElement.config.onlyClassName}
                  multiple={formElement.config.multiple}
                  changed={(event) => this.inputChangedHandler(event, formElement.id, formElement.config.multiple)}/>
              </div>
            ))
          }
          <div className="form-group col-md-12">
            <button
              type="submit"
              disabled={!this.state.formIsValid || this.state.isLoading}
              className="btn btn-primary"
            >
              Report Post
            </button>
          </div>
        </div>
      </form>
    );

    return (
      <div id="createmarket" style={{display: 'block'}}>
        <span id="closegrpop" className="closepopp"><a onClick={() => onClose()}>
          <i className="fa fa-close"/></a>
        </span>
        <div className="topboxtxt">Report Post</div>
        <div className="creategrfrmarea">
          {form}
        </div>
      </div>
    );
  }
}

export default EditPost;
