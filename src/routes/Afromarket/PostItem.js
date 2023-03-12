import React, {Component} from 'react';
import Input from '../../components/Input/Input';
import axios from "../../utils/axiosConfig";

class PostItem extends Component {
  state = {
    orderForm: {
      item_name: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Write item name.........'
        },
        value: '',
        label: <label>Item name</label>,
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-5',
      },
      type: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select--'},
            {value: 'Used', displayValue: 'Used'},
            {value: 'Unused', displayValue: 'Unused'}
          ]
        },
        value: '',
        label: <label>Type</label>,
        validation: {
          required: true
        },
        valid: true,
        outerDivClassName: 'col-md-2'
      },
      category: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select--'},
            {value: 'Accessories', displayValue: 'Accessories'},
            {value: 'Electronics', displayValue: 'Electronics'},
            {value: 'Books', displayValue: 'Books'},
            {value: 'Hostel', displayValue: 'Hostel'},
          ]
        },
        label: <label>Category</label>,
        value: '',
        validation: {
          required: true
        },
        valid: true,
        outerDivClassName: 'col-md-3'
      },
      price: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Price'
        },
        value: '',
        label: <label>Price</label>,
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-2'
      },
      currency: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select--'},
            {value: 'GIVES', displayValue: 'GIVES'},
            {value: 'Kz', displayValue: 'Kz'},
            {value: 'CFA', displayValue: 'CFA'},
            {value: 'P', displayValue: 'P'},
            {value: 'FBu', displayValue: 'FBu'},
            {value: 'CF', displayValue: 'CF'},
            {value: 'FC', displayValue: 'FC'},
            {value: 'Fdj', displayValue: 'Fdj'},
            {value: 'E £', displayValue: 'E £'},
            {value: 'Nfk', displayValue: 'Nfk'},
            {value: 'Br', displayValue: 'Br'},
            {value: 'D', displayValue: 'D'},
            {value: 'FG', displayValue: 'FG'},
            {value: 'KSh', displayValue: 'KSh'},
            {value: 'LD', displayValue: 'LD'},
            {value: 'With', displayValue: 'With'},
            {value: 'MK', displayValue: 'MK'},
            {value: 'ONE', displayValue: 'ONE'},
            {value: '₨', displayValue: '₨'},
            {value: 'DH', displayValue: 'DH'},
            {value: 'MT', displayValue: 'MT'},
            {value: 'FRw', displayValue: 'FRw'},
            {value: 'Db', displayValue: 'Db'},
            {value: 'SR', displayValue: 'SR'},
            {value: 'SLL', displayValue: 'SLL'},
            {value: 'Sh.So', displayValue: 'Sh.So'},
            {value: '£', displayValue: '£'},
            {value: 'SD', displayValue: 'SD'},
            {value: 'TSh', displayValue: 'TSh'},
            {value: 'DT', displayValue: 'DT'},
            {value: 'USh', displayValue: 'USh'},
            {value: 'ZK', displayValue: 'ZK'},
            {value: '$', displayValue: '$'},
            {value: '₦', displayValue: '₦'},
          ]
        },
        value: '',
        label: <label>Currency</label>,
        validation: {
          required: true
        },
        valid: true,
        outerDivClassName: 'col-md-2'
      },
      country: {
        elementType: 'select',
        elementConfig: {
          options: [
            {value: '', displayValue: '--Select one--'},
            {value: "Afghanistan", displayValue: "Afghanistan"},
            {value: "Åland Islands", displayValue: "Åland Islands"},
            {value: "Albania", displayValue: "Albania"},
            {value: "Algeria", displayValue: "Algeria"},
            {value: "American Samoa", displayValue: "American Samoa"},
            {value: "Andorra", displayValue: "Andorra"},
            {value: "Angola", displayValue: "Angola"},
            {value: "Anguilla", displayValue: "Anguilla"},
            {value: "Antarctica", displayValue: "Antarctica"},
            {value: "Antigua and Barbuda", displayValue: "Antigua and Barbuda"},
            {value: "Argentina", displayValue: "Argentina"},
            {value: "Armenia", displayValue: "Armenia"},
            {value: "Aruba", displayValue: "Aruba"},
            {value: "Australia", displayValue: "Australia"},
            {value: "Austria", displayValue: "Austria"},
            {value: "Azerbaijan", displayValue: "Azerbaijan"},
            {value: "Bahamas", displayValue: "Bahamas"},
            {value: "Bahrain", displayValue: "Bahrain"},
            {value: "Bangladesh", displayValue: "Bangladesh"},
            {value: "Barbados", displayValue: "Barbados"},
            {value: "Belarus", displayValue: "Belarus"},
            {value: "Belgium", displayValue: "Belgium"},
            {value: "Belize", displayValue: "Belize"},
            {value: "Benin", displayValue: "Benin"},
            {value: "Bermuda", displayValue: "Bermuda"},
            {value: "Bhutan", displayValue: "Bhutan"},
            {value: "Bolivia (Plurinational State of)", displayValue: "Bolivia (Plurinational State of)"},
            {value: "Bonaire, Sint Eustatius and Saba", displayValue: "Bonaire, Sint Eustatius and Saba"},
            {value: "Bosnia and Herzegovina", displayValue: "Bosnia and Herzegovina"},
            {value: "Botswana", displayValue: "Botswana"},
            {value: "Bouvet Island", displayValue: "Bouvet Island"},
            {value: "Brazil", displayValue: "Brazil"},
            {value: "British Indian Ocean Territory", displayValue: "British Indian Ocean Territory"},
            {value: "United States Minor Outlying Islands", displayValue: "United States Minor Outlying Islands"},
            {value: "Virgin Islands (British)", displayValue: "Virgin Islands (British)"},
            {value: "Virgin Islands (U.S.)", displayValue: "Virgin Islands (U.S.)"},
            {value: "Brunei Darussalam", displayValue: "Brunei Darussalam"},
            {value: "Bulgaria", displayValue: "Bulgaria"},
            {value: "Burkina Faso", displayValue: "Burkina Faso"},
            {value: "Burundi", displayValue: "Burundi"},
            {value: "Cambodia", displayValue: "Cambodia"},
            {value: "Cameroon", displayValue: "Cameroon"},
            {value: "Canada", displayValue: "Canada"},
            {value: "Cabo Verde", displayValue: "Cabo Verde"},
            {value: "Cayman Islands", displayValue: "Cayman Islands"},
            {value: "Central African Republic", displayValue: "Central African Republic"},
            {value: "Chad", displayValue: "Chad"},
            {value: "Chile", displayValue: "Chile"},
            {value: "China", displayValue: "China"},
            {value: "Christmas Island", displayValue: "Christmas Island"},
            {value: "Cocos (Keeling) Islands", displayValue: "Cocos (Keeling) Islands"},
            {value: "Colombia", displayValue: "Colombia"},
            {value: "Comoros", displayValue: "Comoros"},
            {value: "Congo", displayValue: "Congo"},
            {value: "Congo (Democratic Republic of the)", displayValue: "Congo (Democratic Republic of the)"},
            {value: "Cook Islands", displayValue: "Cook Islands"},
            {value: "Costa Rica", displayValue: "Costa Rica"},
            {value: "Croatia", displayValue: "Croatia"},
            {value: "Cuba", displayValue: "Cuba"},
            {value: "Curaçao", displayValue: "Curaçao"},
            {value: "Cyprus", displayValue: "Cyprus"},
            {value: "Czech Republic", displayValue: "Czech Republic"},
            {value: "Denmark", displayValue: "Denmark"},
            {value: "Djibouti", displayValue: "Djibouti"},
            {value: "Dominica", displayValue: "Dominica"},
            {value: "Dominican Republic", displayValue: "Dominican Republic"},
            {value: "Ecuador", displayValue: "Ecuador"},
            {value: "Egypt", displayValue: "Egypt"},
            {value: "El Salvador", displayValue: "El Salvador"},
            {value: "Equatorial Guinea", displayValue: "Equatorial Guinea"},
            {value: "Eritrea", displayValue: "Eritrea"},
            {value: "Estonia", displayValue: "Estonia"},
            {value: "Ethiopia", displayValue: "Ethiopia"},
            {value: "Falkland Islands (Malvinas)", displayValue: "Falkland Islands (Malvinas)"},
            {value: "Faroe Islands", displayValue: "Faroe Islands"},
            {value: "Fiji", displayValue: "Fiji"},
            {value: "Finland", displayValue: "Finland"},
            {value: "France", displayValue: "France"},
            {value: "French Guiana", displayValue: "French Guiana"},
            {value: "French Polynesia", displayValue: "French Polynesia"},
            {value: "French Southern Territories", displayValue: "French Southern Territories"},
            {value: "Gabon", displayValue: "Gabon"},
            {value: "Gambia", displayValue: "Gambia"},
            {value: "Georgia", displayValue: "Georgia"},
            {value: "Germany", displayValue: "Germany"},
            {value: "Ghana", displayValue: "Ghana"},
            {value: "Gibraltar", displayValue: "Gibraltar"},
            {value: "Greece", displayValue: "Greece"},
            {value: "Greenland", displayValue: "Greenland"},
            {value: "Grenada", displayValue: "Grenada"},
            {value: "Guadeloupe", displayValue: "Guadeloupe"},
            {value: "Guam", displayValue: "Guam"},
            {value: "Guatemala", displayValue: "Guatemala"},
            {value: "Guernsey", displayValue: "Guernsey"},
            {value: "Guinea", displayValue: "Guinea"},
            {value: "Guinea-Bissau", displayValue: "Guinea-Bissau"},
            {value: "Guyana", displayValue: "Guyana"},
            {value: "Haiti", displayValue: "Haiti"},
            {value: "Heard Island and McDonald Islands", displayValue: "Heard Island and McDonald Islands"},
            {value: "Holy See", displayValue: "Holy See"},
            {value: "Honduras", displayValue: "Honduras"},
            {value: "Hong Kong", displayValue: "Hong Kong"},
            {value: "Hungary", displayValue: "Hungary"},
            {value: "Iceland", displayValue: "Iceland"},
            {value: "India", displayValue: "India"},
            {value: "Indonesia", displayValue: "Indonesia"},
            {value: "Côte d'Ivoire", displayValue: "Côte d'Ivoire"},
            {value: "Iran (Islamic Republic of)", displayValue: "Iran (Islamic Republic of)"},
            {value: "Iraq", displayValue: "Iraq"},
            {value: "Ireland", displayValue: "Ireland"},
            {value: "Isle of Man", displayValue: "Isle of Man"},
            {value: "Israel", displayValue: "Israel"},
            {value: "Italy", displayValue: "Italy"},
            {value: "Jamaica", displayValue: "Jamaica"},
            {value: "Japan", displayValue: "Japan"},
            {value: "Jersey", displayValue: "Jersey"},
            {value: "Jordan", displayValue: "Jordan"},
            {value: "Kazakhstan", displayValue: "Kazakhstan"},
            {value: "Kenya", displayValue: "Kenya"},
            {value: "Kiribati", displayValue: "Kiribati"},
            {value: "Kuwait", displayValue: "Kuwait"},
            {value: "Kyrgyzstan", displayValue: "Kyrgyzstan"},
            {value: "Lao People's Democratic Republic", displayValue: "Lao People's Democratic Republic"},
            {value: "Latvia", displayValue: "Latvia"},
            {value: "Lebanon", displayValue: "Lebanon"},
            {value: "Lesotho", displayValue: "Lesotho"},
            {value: "Liberia", displayValue: "Liberia"},
            {value: "Libya", displayValue: "Libya"},
            {value: "Liechtenstein", displayValue: "Liechtenstein"},
            {value: "Lithuania", displayValue: "Lithuania"},
            {value: "Luxembourg", displayValue: "Luxembourg"},
            {value: "Macao", displayValue: "Macao"},
            {value: "Macedonia (the former Yugoslav Republic of)", displayValue: "Macedonia (the former Yugoslav Republic of)"},
            {value: "Madagascar", displayValue: "Madagascar"},
            {value: "Malawi", displayValue: "Malawi"},
            {value: "Malaysia", displayValue: "Malaysia"},
            {value: "Maldives", displayValue: "Maldives"},
            {value: "Mali", displayValue: "Mali"},
            {value: "Malta", displayValue: "Malta"},
            {value: "Marshall Islands", displayValue: "Marshall Islands"},
            {value: "Martinique", displayValue: "Martinique"},
            {value: "Mauritania", displayValue: "Mauritania"},
            {value: "Mauritius", displayValue: "Mauritius"},
            {value: "Mayotte", displayValue: "Mayotte"},
            {value: "Mexico", displayValue: "Mexico"},
            {value: "Micronesia (Federated States of)", displayValue: "Micronesia (Federated States of)"},
            {value: "Moldova (Republic of)", displayValue: "Moldova (Republic of)"},
            {value: "Monaco", displayValue: "Monaco"},
            {value: "Mongolia", displayValue: "Mongolia"},
            {value: "Montenegro", displayValue: "Montenegro"},
            {value: "Montserrat", displayValue: "Montserrat"},
            {value: "Morocco", displayValue: "Morocco"},
            {value: "Mozambique", displayValue: "Mozambique"},
            {value: "Myanmar", displayValue: "Myanmar"},
            {value: "Namibia", displayValue: "Namibia"},
            {value: "Nauru", displayValue: "Nauru"},
            {value: "Nepal", displayValue: "Nepal"},
            {value: "Netherlands", displayValue: "Netherlands"},
            {value: "New Caledonia", displayValue: "New Caledonia"},
            {value: "New Zealand", displayValue: "New Zealand"},
            {value: "Nicaragua", displayValue: "Nicaragua"},
            {value: "Niger", displayValue: "Niger"},
            {value: "Nigeria", displayValue: "Nigeria"},
            {value: "Niue", displayValue: "Niue"},
            {value: "Norfolk Island", displayValue: "Norfolk Island"},
            {value: "Korea (Democratic People's Republic of)", displayValue: "Korea (Democratic People's Republic of)"},
            {value: "Northern Mariana Islands", displayValue: "Northern Mariana Islands"},
            {value: "Norway", displayValue: "Norway"},
            {value: "Oman", displayValue: "Oman"},
            {value: "Pakistan", displayValue: "Pakistan"},
            {value: "Palau", displayValue: "Palau"},
            {value: "Palestine, State of", displayValue: "Palestine, State of"},
            {value: "Panama", displayValue: "Panama"},
            {value: "Papua New Guinea", displayValue: "Papua New Guinea"},
            {value: "Paraguay", displayValue: "Paraguay"},
            {value: "Peru", displayValue: "Peru"},
            {value: "Philippines", displayValue: "Philippines"},
            {value: "Pitcairn", displayValue: "Pitcairn"},
            {value: "Poland", displayValue: "Poland"},
            {value: "Portugal", displayValue: "Portugal"},
            {value: "Puerto Rico", displayValue: "Puerto Rico"},
            {value: "Qatar", displayValue: "Qatar"},
            {value: "Republic of Kosovo", displayValue: "Republic of Kosovo"},
            {value: "Réunion", displayValue: "Réunion"},
            {value: "Romania", displayValue: "Romania"},
            {value: "Russian Federation", displayValue: "Russian Federation"},
            {value: "Rwanda", displayValue: "Rwanda"},
            {value: "Saint Barthélemy", displayValue: "Saint Barthélemy"},
            {value: "Saint Helena, Ascension and Tristan da Cunha", displayValue: "Saint Helena, Ascension and Tristan da Cunha"},
            {value: "Saint Kitts and Nevis", displayValue: "Saint Kitts and Nevis"},
            {value: "Saint Lucia", displayValue: "Saint Lucia"},
            {value: "Saint Martin (French part)", displayValue: "Saint Martin (French part)"},
            {value: "Saint Pierre and Miquelon", displayValue: "Saint Pierre and Miquelon"},
            {value: "Saint Vincent and the Grenadines", displayValue: "Saint Vincent and the Grenadines"},
            {value: "Samoa", displayValue: "Samoa"},
            {value: "San Marino", displayValue: "San Marino"},
            {value: "Sao Tome and Principe", displayValue: "Sao Tome and Principe"},
            {value: "Saudi Arabia", displayValue: "Saudi Arabia"},
            {value: "Senegal", displayValue: "Senegal"},
            {value: "Serbia", displayValue: "Serbia"},
            {value: "Seychelles", displayValue: "Seychelles"},
            {value: "Sierra Leone", displayValue: "Sierra Leone"},
            {value: "Singapore", displayValue: "Singapore"},
            {value: "Sint Maarten (Dutch part)", displayValue: "Sint Maarten (Dutch part)"},
            {value: "Slovakia", displayValue: "Slovakia"},
            {value: "Slovenia", displayValue: "Slovenia"},
            {value: "Solomon Islands", displayValue: "Solomon Islands"},
            {value: "Somalia", displayValue: "Somalia"},
            {value: "South Africa", displayValue: "South Africa"},
            {value: "South Georgia and the South Sandwich Islands", displayValue: "South Georgia and the South Sandwich Islands"},
            {value: "Korea (Republic of)", displayValue: "Korea (Republic of)"},
            {value: "South Sudan", displayValue: "South Sudan"},
            {value: "Spain", displayValue: "Spain"},
            {value: "Sri Lanka", displayValue: "Sri Lanka"},
            {value: "Sudan", displayValue: "Sudan"},
            {value: "Suriname", displayValue: "Suriname"},
            {value: "Svalbard and Jan Mayen", displayValue: "Svalbard and Jan Mayen"},
            {value: "Swaziland", displayValue: "Swaziland"},
            {value: "Sweden", displayValue: "Sweden"},
            {value: "Switzerland", displayValue: "Switzerland"},
            {value: "Syrian Arab Republic", displayValue: "Syrian Arab Republic"},
            {value: "Taiwan", displayValue: "Taiwan"},
            {value: "Tajikistan", displayValue: "Tajikistan"},
            {value: "Tanzania, United Republic of", displayValue: "Tanzania, United Republic of"},
            {value: "Thailand", displayValue: "Thailand"},
            {value: "Timor-Leste", displayValue: "Timor-Leste"},
            {value: "Togo", displayValue: "Togo"},
            {value: "Tokelau", displayValue: "Tokelau"},
            {value: "Tonga", displayValue: "Tonga"},
            {value: "Trinidad and Tobago", displayValue: "Trinidad and Tobago"},
            {value: "Tunisia", displayValue: "Tunisia"},
            {value: "Turkey", displayValue: "Turkey"},
            {value: "Turkmenistan", displayValue: "Turkmenistan"},
            {value: "Turks and Caicos Islands", displayValue: "Turks and Caicos Islands"},
            {value: "Tuvalu", displayValue: "Tuvalu"},
            {value: "Uganda", displayValue: "Uganda"},
            {value: "Ukraine", displayValue: "Ukraine"},
            {value: "United Arab Emirates", displayValue: "United Arab Emirates"},
            {value: "United Kingdom of Great Britain and Northern Ireland", displayValue: "United Kingdom of Great Britain and Northern Ireland"},
            {value: "United States of America", displayValue: "United States of America"},
            {value: "Uruguay", displayValue: "Uruguay"},
            {value: "Uzbekistan", displayValue: "Uzbekistan"},
            {value: "Vanuatu", displayValue: "Vanuatu"},
            {value: "Venezuela (Bolivarian Republic of)", displayValue: "Venezuela (Bolivarian Republic of)"},
            {value: "Viet Nam", displayValue: "Viet Nam"},
            {value: "Wallis and Futuna", displayValue: "Wallis and Futuna"},
            {value: "Western Sahara", displayValue: "Western Sahara"},
            {value: "Yemen", displayValue: "Yemen"},
            {value: "Zambia", displayValue: "Zambia"},
            {value: "Zimbabwe", displayValue: "Zimbabwe"},
          ]
        },
        value: '',
        label: <label>Country</label>,
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-3'
      },
      city: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'City name'
        },
        value: '',
        label: <label>City</label>,
        validation: {
          required: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-3'
      },
      mobile_number: {
        elementType: 'input',
        elementConfig: {
          type: 'text',
          placeholder: 'Seller mobile no.'
        },
        label: <label>Seller mobile no.</label>,
        value: '',
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-4'
      },
      description: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Write description...',
          rows: 3
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
      main_image: {
        elementType: 'input',
        elementConfig: {
          type: 'file'
        },
        label: <label>Main Image</label>,
        value: '',
        validation: {
          isFile: true
        },
        valid: false,
        touched: false,
        outerDivClassName: 'col-md-6'
      },
      sub_image1: {
        elementType: 'input',
        elementConfig: {
          type: 'file'
        },
        label: <label>Gallery image 1</label>,
        value: '',
        validation: {
          isFile: true
        },
        valid: true,
        touched: false,
        outerDivClassName: 'col-md-6'
      },
      sub_image2: {
        elementType: 'input',
        elementConfig: {
          type: 'file'
        },
        label: <label>Gallery image 2</label>,
        value: '',
        validation: {
          isFile: true
        },
        valid: true,
        touched: false,
        outerDivClassName: 'col-md-6'
      },
      sub_image3: {
        elementType: 'input',
        elementConfig: {
          type: 'file'
        },
        label: <label>Gallery image 3</label>,
        value: '',
        validation: {
          isFile: true
        },
        valid: true,
        touched: false,
        outerDivClassName: 'col-md-6'
      },
    },
    formIsValid: false,
    isLoading: false
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = {};
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
    }
    const config = {
      headers: {
        'Authorization': "bearer " + this.props.token,
        'content-type': 'multipart/form-data'
      }
    };
    let fData = new FormData();
    for (let key in formData) {
      fData.append(key, formData[key]);
    }
    this.setState({isLoading: true});
    axios.post('/market', fData, config)
      .then(response => {
        console.log(response);
        this.setState({isLoading: false});
        this.props.onClose();
      })
      .catch(err => {
        this.setState({isLoading: false});
        console.log(err);
      })
    //this.props.onSubmit(formData);
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
      updatedFormElement.value = event.target.files ? event.target.files[0] : event.target.value;
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
    const {onClose} = this.props;

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
            <button type="submit" disabled={!this.state.formIsValid || this.state.isLoading}
                    className="btn btn-primary">
              {!this.state.isLoading ? 'Create market post' : 'Loading...'}
            </button>
          </div>
        </div>
      </form>
    );

    return (
      <div id="createmarket">
        <span id="closegrpop" className="closepopp"><a onClick={() => onClose()}><i
          className="fa fa-close"/></a></span>
        <div className="topboxtxt">Create Market</div>
        <div className="creategrfrmarea">
          {form}
        </div>
      </div>
    );
  }
}

export default PostItem;