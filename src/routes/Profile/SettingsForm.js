import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import moment from "moment";

import Input from '../../components/Input/Input';
import {countries} from "../../constants/countries";

const controls = {
  first_name: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'First name'
    },
    value: '',
    label: <label>Write First Name <span className="red">*</span></label>,
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  last_name: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Last name'
    },
    value: '',
    label: <label>Write Last Name <span className="red">*</span></label>,
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  //Add User name field
  user_name: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Username'
    },
    value: '',
    label: <label>Write Username</label>,
    validation: {
      required: true,
    },
    valid: false,
    touched: false
  },
  //---//
  email: {
    elementType: 'input',
    elementConfig: {
      type: 'email',
      placeholder: 'Email',
      disabled: false
    },
    value: '',
    label: <label>Email id</label>,
    validation: {
      required: true,
      isEmail: true
    },
    valid: false,
    touched: false
  },
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
    validation: {},
    valid: true
  },
  contact_number: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'Phone no.',
      disabled: false,
      'data-tip': 'tooltip',
      'data-for': 'contact-number'
    },
    label: <label>Phone Number</label>,
    value: '',
    validation: {
      required: true,
      isNumeric: true
    },
    valid: false,
    touched: false
  },
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
        {value: 'Other', displayValue: 'Other'}
      ]
    },
    label: <label>Religion</label>,
    value: '',
    validation: {},
    valid: true
  },
  about: {
    elementType: 'textarea',
    elementConfig: {
      type: 'text',
      placeholder: 'Bio',
      disabled: false,
      'data-tip': 'tooltip',
      'data-for': 'bio'
    },
    label: <label>Bio</label>,
    value: '',
    validation: {
      required: true,
    },
    valid: false,
    touched: false
  },
  sports_interests: {
    elementType: 'reactSelect',
    elementConfig: {
      options: [
        {value: 'Afro-global Politics', label: 'Afro-global Politics'},
        {value: 'Afro-global Youngsters', label: 'Afro-global Youngsters'},
        {value: 'Afro-global Entrepreneurial', label: 'Afro-global Entrepreneurial'},
        {value: 'Afro Cultures ad Histories', label: 'Afro Cultures ad Histories'},
        {value: 'Afro beat/Music/Dance', label: 'Afro beat/Music/Dance'},
        {value: 'Afro-global news', label: 'Afro-global news'},
        {value: 'Afro-UniGist', label: 'Afro-UniGist'},
        {value: 'Afro-global career and opportunities', label: 'Afro-global career and opportunities'},
        {value: 'Afro-global League of Gentle men', label: 'Afro-global League of Gentle men'},
        {value: 'Afro-global Queens/Beauties', label: 'Afro-global Queens/Beauties'},
        {value: 'Afro-global Talents and innovations', label: 'Afro-global Talents and innovations'},
        {value: 'Afro-Arts/Craft', label: 'Afro-Arts/Craft'},
        {value: 'Afro Moonlight stories', label: 'Afro Moonlight stories'},
        {value: 'Afro-global Entertainment', label: 'Afro-global Entertainment'},
        {value: 'Afro-global celeb', label: 'Afro-global celeb'},
      ],
      menuIsOpen: true,
      styles: {
        menu: provided => ({...provided, position: 'inherit'})
      },
      isMulti: true
    },
    value: [],
    label: <label>Interests</label>,
    validation: {
      minLength: 1
    },
    valid: false,
    onlyClassName: 'reactSelect'
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
    validation: {},
    valid: true
  },
  nationality: {
    elementType: 'select',
    elementConfig: {
      options: countries.map(country => ({
        value: country.name,
        displayValue: country.name
      }))
    },
    value: '',
    label: <label>Country</label>,
    validation: {},
    valid: true
  },
  state: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'State name'
    },
    value: '',
    label: <label>State/Region</label>,
    validation: {
      required: true
    },
    valid: false,
    touched: false
  },
  date_of_birth: {
    elementType: 'datepicker',
    label: <label>Date of birth</label>,
    value: new Date("January 01 2000"),
    validation: {},
    valid: true,
    touched: false
  },
  password: {
    elementType: 'input',
    elementConfig: {
      type: 'text',
      placeholder: 'New password'
    },
    label: <label>Password</label>,
    value: '',
    validation: {
      minLength: 6
    },
    valid: true,
    touched: false
  },
  private: {
    elementType: 'switch',
    elementConfig: {
      type: 'checkbox'
    },
    value: true,
    validation: {},
    label: <label>Visibility</label>,
    valid: true,
    touched: true
  },
};

class SettingsForm extends Component {
  state = {
    orderForm: controls,
    formIsValid: false,
    dataLoaded: false
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((JSON.stringify(this.props.settingsData) !== JSON.stringify(prevProps.settingsData))) {
      const orderForm = {...this.state.orderForm};
      for (let key in orderForm) {
        if (orderForm[key].elementType === 'reactSelect') {
          orderForm[key].value =
            this.props.settingsData[key]
              ? this.props.settingsData[key].map(data => ({
                value: data,
                label: data
              }))
              : [];
          orderForm[key].valid = true;
        } else if (orderForm[key].elementType === 'datepicker') {
          orderForm[key].value = this.props.settingsData[key]
            ? moment(this.props.settingsData[key], "YYYY-MM-DDTHH:mm:ss.Z").toDate()
            : new Date();
          orderForm[key].valid = true;
        } else {
          orderForm[key].value = this.props.settingsData[key] || "";
          orderForm[key].valid = true;
        }
      }
      this.setState({orderForm: orderForm});
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.dataLoaded) {
      if (props.settingsData) {
        if (props.settingsData.registered_with === 'email') {
          state.orderForm.email.elementConfig.disabled = true;
        }
        if (props.settingsData.registered_with === 'contact_number') {
          state.orderForm.contact_number.elementConfig.disabled = true;
        }
        return {dataLoaded: true}
      }
    }
    return null
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      if (this.state.orderForm[formElementIdentifier].elementType === 'reactSelect') {
        formData[formElementIdentifier] =
          this.state.orderForm[formElementIdentifier]
            ? this.state.orderForm[formElementIdentifier].value.map(data => data.value)
            : '';
      } else {
        formData[formElementIdentifier] =
          this.state.orderForm[formElementIdentifier]
            ? this.state.orderForm[formElementIdentifier].value
            : '';
      }
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
                  onlyOuterClassName={formElement.config.onlyOuterClassName}
                  multiple={formElement.config.multiple}
                  changed={(event) => this.inputChangedHandler(event, formElement.id, formElement.config.multiple)}/>
              </div>
            ))
          }
          <button
            type="submit"
            className="form-control"
            style={{margin: "0px 20px", cursor: 'pointer'}}
            disabled={this.props.isLoading}
          >
            Update Details
          </button>
        </div>
        <ReactTooltip
          id='contact-number'
          event='focusin'
          eventOff='focusout'
          getContent={() =>
            <p>Please add mobile number with country code e.g. 919000090000</p>}
          effect='solid'
          place={'top'}
          border={true}
          type={'dark'}
          className={'tooltip-react'}
        />
      </form>
    );

    return form;
  }
}

export default SettingsForm;
