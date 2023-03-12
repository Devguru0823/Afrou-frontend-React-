import React, {Component} from 'react';
import Input from '../../components/Input/Input';

class EditGroup extends Component {
  state = {
    controls: {
      group_title: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Group Title'
        },
        value: this.props.data.group_title,
        label: <label>Group Title</label>,
        validation: {
          required: true
        },
        valid: true,
        touched: true,
        outerDivClassName: 'col-12'
      },
      group_description: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Write something...',
          rows: 1
        },
        className: 'mytextarea',
        value: this.props.data.group_description,
        label: <label>Description</label>,
        validation: {
          required: true
        },
        valid: true,
        touched: true,
        outerDivClassName: 'col-12'
      },
      group_category: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: 'Select Subject/categories'},
            {value: 'Religious matter', displayValue: 'Religious matter'},
            {value: 'Sex issues', displayValue: 'Sex issues'},
            {value: 'Afro politics', displayValue: 'Afro politics'},
            {value: 'Small scale biz', displayValue: 'Small scale biz'},
            {value: 'Other', displayValue: 'Other'},
          ]
        },
        label: <label>Category</label>,
        value: this.props.data.group_category,
        validation: {
          required: true
        },
        valid: true,
        outerDivClassName: 'col-md-4'
      },
      private: {
        elementType: 'switch',
        elementConfig: {
          type: 'checkbox'
        },
        value: this.props.data.private,
        validation: {},
        label: <label>Visibility</label>,
        valid: true,
        touched: true,
        outerDivClassName: 'col-6'
      },
    },
    formIsValid: true,
    emojiVisible: false
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let formData = {};
    for (let key in this.state.controls) {
      formData[key] = this.state.controls[key].value;
    }
    this.props.updatePost(formData);
    this.props.onClose();
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

  inputChangedHandler = (event, inputIdentifier, isMultiple) => {
    const updatedOrderForm = {
      ...this.state.controls
    };
    const updatedFormElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    if (isMultiple) {
      const options = event.target.options;
      const value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
      updatedFormElement.value = value;
    } else {
      if (updatedFormElement.elementType === 'switch') {
        updatedFormElement.value = !event.target.checked;
      } else {
        updatedFormElement.value = event.target.value;
      }
    }
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
              <div className={formElement.config.outerDivClassName} key={formElement.id}>
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
            <button type="submit" disabled={!this.state.formIsValid} className="btn btn-primary">Update
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
        <div className="topboxtxt">Group Settings</div>
        <div className="creategrfrmarea">
          {form}
        </div>
      </div>
    );
  }
}

export default EditGroup;