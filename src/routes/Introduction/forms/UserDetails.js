import React, {Component} from 'react';

import Input from '../../../components/Input/Input';
import moment from "moment";

class SettingsForm extends Component {
  state = {
    orderForm: {
      gender: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select one--'},
            {value: 'M', displayValue: 'Male'},
            {value: 'F', displayValue: 'Female'}
          ]
        },
        value: '',
        label: <label>Gender</label>,
        validation: {
          required: true
        },
        valid: false
      },
      date_of_birth: {
        elementType: 'datepicker',
        label: <label>Date of birth</label>,
        value: new Date(),
        validation: {
          required: true
        },
        valid: false,
        touched: false,
      },
      private: {
        elementType: 'switch',
        elementConfig: {
          type: 'checkbox'
        },
        value: false,
        validation: {},
        label: <label>Visibility</label>,
        valid: true,
        touched: true
      },
    },
    formIsValid: false,
    dataLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.dataLoaded) {
      if (Object.keys(props.settingsData).length !== 0) {
        for (let key in state.orderForm) {
          if (state.orderForm[key].elementType === 'datepicker') {
            state.orderForm[key].value = props.settingsData[key]
              ? moment(props.settingsData[key], "YYYY-MM-DDTHH:mm:ss.Z").toDate()
              : new Date();
            state.orderForm[key].valid = true;
          } else {
            state.orderForm[key].value = props.settingsData[key] || '';
            state.orderForm[key].valid = true;
          }
        }
        return {dataLoaded: true, formIsValid: true}
      }
    }
    return null
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] =
        this.state.orderForm[formElementIdentifier] ? this.state.orderForm[formElementIdentifier].value : '';
    }
    this.props.onSubmit(formData);
  };

  checkValidity = (value, rules) => {
    let isValid = true;

    if (rules.required) {
      const stringValue = value.toString();
      isValid = stringValue.trim() !== '' && isValid;
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
              <div className="col-sm-6" key={formElement.id}>
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
            style={{margin: '0px 15px', cursor: 'pointer'}}
            disabled={this.props.isLoading || !this.state.formIsValid}
          >
            Save and Next
          </button>
        </div>
      </form>
    );

    return form;
  }
}

export default SettingsForm;
