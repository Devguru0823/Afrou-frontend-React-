import React, {Component} from 'react';

import Input from '../../../components/Input/Input';
import {countries} from '../../../constants/countries';
import axiosMain from "axios";

class SettingsForm extends Component {
  state = {
    orderForm: {
      religion: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select one--'},
            {value: 'None', displayValue: 'None'},
            {value: 'Christianity', displayValue: 'Christianity'},
            {value: 'Muslim', displayValue: 'Muslim'},
            {value: 'Hindu', displayValue: 'Hindu'},
            {value: 'Judaism', displayValue: 'Judaism'},
            {value: 'Buddha', displayValue: 'Buddha'},
            {value: 'Traditionalist', displayValue: 'Traditionalist'},
            {value: 'African Tradition', displayValue: 'African Tradition'},
            {value: 'Other', displayValue: 'Other'},
          ]
        },
        label: <label>Religion</label>,
        value: '',
        validation: {
          required: true
        },
        valid: false
      },
      career_interest: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select one--'},
            {value: 'Administrative', displayValue: 'Administrative'},
            {value: 'Finance', displayValue: 'Finance'},
            {value: 'Aircraft profession', displayValue: 'Aircraft Profession'},
            {value: 'Hospitality', displayValue: 'Hospitality'},
            {value: 'Building and Construction', displayValue: 'Building and Construction'},
            {value: 'Health and Nutritional Science', displayValue: 'Health and Nutritional Science'},
            {value: 'Agriculturist', displayValue: 'Agriculturist'},
            {value: 'Animalogist', displayValue: 'Animalogist'},
            {value: 'Legal Profession', displayValue: 'Legal Profession'},
            {value: 'Beauty Therapist', displayValue: 'Beauty Therapist'},
            {value: 'Entertainment', displayValue: 'Entertainment'},
            {value: 'IT', displayValue: 'IT'},
            {value: 'Petroleum', displayValue: 'Petroleum'},
            {value: 'Engineer', displayValue: 'Engineer'},
            {value: ' Nature/Environmental Artist', displayValue: ' Nature/Environmental Artist'},
            {value: 'Electrical', displayValue: 'Electrical'},
            {value: 'Mechanical', displayValue: 'Mechanical'},
            {value: 'Teacher/lecturer', displayValue: 'Teacher/lecturer'},
            {value: 'Entrepreneur', displayValue: 'Entrepreneur'},
            {value: 'Sport', displayValue: 'Sport'},
            {value: 'Politics', displayValue: 'Politics'},
            {value: 'Forensic', displayValue: 'Forensic'},
            {value: 'Historian', displayValue: 'Historian'},
            {value: 'Jewellery merchant', displayValue: 'Jewellery merchant'},
            {value: 'Cookery', displayValue: 'Cookery'},
            {value: 'Logistic', displayValue: 'Logistic'},
            {value: 'Marine', displayValue: 'Marine'},
            {value: 'Religion', displayValue: 'Religion'},
            {value: 'Security Officer', displayValue: 'Security Officer'},
            {value: 'Writer', displayValue: 'Writer'},
            {value: 'Estates', displayValue: 'Estates'},
            {value: 'Railway profession', displayValue: 'Railway profession'},
            {value: 'Student', displayValue: 'Student'},
          ]
        },
        value: '',
        label: <label>Career</label>,
        validation: {
          required: true
        },
        valid: false
      },
      nationality: {
        elementType: 'select',
        elementConfig: {
          options: countries.map(country => ({
            value: country.name,
            displayValue: country.name
          }))
        },
        value: 'Afghanistan',
        label: <label>Country</label>,
        validation: {
          required: true
        },
        valid: true
      },
      state: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'State name'
        },
        value: '',
        label: <label>State</label>,
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
      if (Object.keys(props.settingsData).length !== 0) {
        for (let key in state.orderForm) {
          state.orderForm[key].value = props.settingsData[key] || '';
          state.orderForm[key].valid = true;
        }
        return {dataLoaded: true, formIsValid: true}
      }
    }
    return null
  }

  componentDidMount() {
    if (Object.keys(this.props.settingsData).length === 0) {
      axiosMain.get(`https://ipapi.co/json/`)
        .then(response => {
          this.setState(state => {
            return {
              ...state,
              orderForm: {
                ...state.orderForm,
                nationality: {
                  ...state.orderForm.nationality,
                  value: response.data.country_name
                }
              }
            }
          })
        })
        .catch(err => {
          console.log(err);
        });
    }
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
              <div className={formElement.id === 'sports_interests' ? 'col-sm-12' : 'col-sm-6'} key={formElement.id}>
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
          <div className="col-sm-6">
            <button
              type="button"
              className="form-control"
              style={{cursor: 'pointer'}}
              disabled={this.props.isLoading}
              onClick={this.props.prevStep}
            >
              Previous Page
            </button>
          </div>
          <div className="col-sm-6">
            <button
              type="submit"
              className="form-control"
              style={{cursor: 'pointer', marginTop: '5px'}}
              disabled={this.props.isLoading || !this.state.formIsValid}
            >
              Save and Next
            </button>
          </div>
        </div>
      </form>
    );

    return form;
  }
}

export default SettingsForm;