import React, {Component} from 'react';
import Input from '../../components/Input/Input';

const initialState = {
  controls: {
    group_title: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Title.........'
      },
      value: '',
      label: <label>Group Title</label>,
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      outerDivClassName: 'col-md-12',
    },
    group_description: {
      elementType: 'textarea',
      elementConfig: {
        placeholder: 'Write description...',
        rows: 1
      },
      label: <label>Description</label>,
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false,
      outerDivClassName: 'col-md-12'
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
      value: '',
      validation: {
        required: true
      },
      valid: false,
      outerDivClassName: 'col-md-4'
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
      touched: true,
      outerDivClassName: 'col-sm-4'
    },
  },
  formIsValid: false
};

class PostItem extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState(initialState);
    const formData = {};
    for (let formElementIdentifier in this.state.controls) {
      formData[formElementIdentifier] = this.state.controls[formElementIdentifier].value;
    }
    this.props.createGroup(formData);
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
    const {visible, onClose} = this.props;
    visible ? document.body.classList.add("actpopup") : document.body.classList.remove("actpopup");

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
            <button type="submit" disabled={!this.state.formIsValid || this.props.isLoading} className="btn btn-primary">
              {this.props.isLoading ? 'Loading...' : 'Create Group'}
            </button>
          </div>
        </div>
      </form>
    );

    return (
      <div id="createmarket" style={{display: visible ? 'block' : 'none'}}>
        <span id="closegrpop" className="closepopp"><a onClick={() => onClose()}><i
          className="fa fa-close"/></a></span>
        <div className="topboxtxt">Create Group</div>
        <div className="creategrfrmarea">
          {form}
        </div>
      </div>
    );
  }
}

export default PostItem;