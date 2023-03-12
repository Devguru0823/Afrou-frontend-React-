import React, {Component} from 'react';

import Input from '../../../components/Input/Input';

class SettingsForm extends Component {
  state = {
    orderForm: {
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
        validation: {
          minLength: 1
        },
        valid: false,
        onlyClassName: 'reactSelect'
      },
    },
    formIsValid: false,
    dataLoaded: false
  };

  static getDerivedStateFromProps(props, state) {
    if (!state.dataLoaded) {
      if (Object.keys(props.settingsData).length !== 0) {
        for (let key in state.orderForm) {
          if (state.orderForm[key].elementType === 'reactSelect') {
            state.orderForm[key].value = props.settingsData[key].map(data => ({value: data, label: data})) || [];
            state.orderForm[key].valid = true;
          } else {
            state.orderForm[key].value = props.settingsData[key] || "";
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
