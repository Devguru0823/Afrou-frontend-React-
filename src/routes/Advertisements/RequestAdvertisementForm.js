import React, {Component} from 'react';

import Input from '../../components/Input/Input';

class AdvertiseForm extends Component {
  state = {
    orderForm: {
      your_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Your name',
          disabled: true
        },
        value: '',
        label: <label>Your Name <span className="red">*</span></label>,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      email: {
        elementType: 'input',
        elementConfig: {
          type: 'email',
          placeholder: 'Email',
          disabled: true
        },
        value: '',
        label: <label>Your Email <span className="red">*</span></label>,
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touched: false
      },
      name_of_organization: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Enter name'
        },
        value: '',
        label: <label>Name of the shop/organization <span className="red">*</span></label>,
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
      duration: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Duration'
        },
        label: <label>Time duration to show it
          <small className="green"> (in month)</small>
          <span className="red">*</span></label>,
        value: '',
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        touched: false
      },
      details: {
        elementType: 'textarea',
        elementConfig: {},
        label: <label>Write in details for that advertisement <span className="red">*</span></label>,
        value: '',
        validation: {
          required: true
        },
        valid: false,
        touched: false
      },
    },
    formIsValid: false,
    dataLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.dataLoaded) {
      if (props.profileDetails.first_name !== undefined) {
        state.orderForm.your_name.value = `${props.profileDetails.first_name} ${props.profileDetails.last_name}`;
        state.orderForm.email.value = props.profileDetails.email;
        return {dataLoaded: true}
      }
    }
    return null
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    formData.name_of_organisation = this.state.orderForm['name_of_organization'].value;
    formData.ad_duration = Number(this.state.orderForm['duration'].value);
    formData.ad_request_description = this.state.orderForm['details'].value;
    this.props.onSubmit(formData);
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
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
      ...this.state.orderForm
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
      updatedFormElement.value = event.target.value;
    }
    updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    updatedFormElement.touched = true;
    updatedOrderForm[inputIdentifier] = updatedFormElement;
    let formIsValid = true;
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
  };

  render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key],
      });
    }

    let form = (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          {
            formElementsArray.map(formElement => (
              <div className={formElement.id === 'details' ? 'col-sm-12' : 'col-sm-6'} key={formElement.id}>
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
          <button
            type="submit"
            className="form-control"
            style={{margin: "0px 20px", cursor: 'pointer'}}
          >
            Request
          </button>
        </div>
      </form>
    );

    return form;
  }
}

export default AdvertiseForm;
