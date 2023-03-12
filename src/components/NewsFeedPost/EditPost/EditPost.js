import React, {Component} from 'react';
import Input from '../../../components/Input/Input';
import {Picker} from "emoji-mart";

class EditPost extends Component {
  state = {
    controls: {
      post_text: {
        elementType: 'textarea',
        elementConfig: {
          placeholder: 'Write something...',
          rows: 3
        },
        className: 'mytextarea',
        value: this.props.data.post_text,
        validation: {
          required: true
        },
        valid: true,
        touched: false,
        outerDivClassName: 'col-md-12'
      },
    },
    formIsValid: false,
    emojiVisible: false
  };

  componentDidMount() {
    document.body.classList.add('actpopup');
  }

  componentWillUnmount() {
    document.body.classList.remove('actpopup');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.updatePost(this.state.controls.post_text.value);
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
      updatedFormElement.value = event.target.files ? event.target.files[0] : event.target.value;
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

  showEmojiMenu = event => {
    event.preventDefault();

    this.setState({ emojiVisible: true }, () => {
      document.addEventListener('click', this.closeEmojiMenu);
    });
  };

  closeEmojiMenu = (e) => {
    if (this.state.emojiVisible && this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({emojiVisible: false}, () => {
        document.removeEventListener('click', this.closeEmojiMenu);
      });
    }
  };

  setWrapperRef = node => {
    this.wrapperRef = node;
  };

  addEmoji = (e) => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach(el => codesArray.push('0x' + el));
    let emojiPic = String.fromCodePoint(...codesArray);
    let newValue = this.state.controls.post_text.value + ' ' + emojiPic;
    this.setState(prevState => ({
      controls: {
        ...prevState.controls,
        post_text: {
          ...prevState.controls.post_text,
          value: newValue
        }
      },
      formIsValid: true
    }))
  };

  render() {
    const {visible, onClose} = this.props;

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
              <div className={formElement.config.outerDivClassName} key={formElement.id} id="myptarea">
                <div className="iconsymbol">
                  <i
                    className="fa fa-smile-o"
                    onClick={this.showEmojiMenu}
                  />
                </div>
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
            <button type="submit" disabled={!this.state.formIsValid} className="btn btn-primary">Edit Post
            </button>
          </div>
        </div>
      </form>
    );

    return (
      <div id="createmarket" style={{display: visible ? 'block' : 'none'}}>
        <span id="closegrpop" className="closepopp"><a onClick={() => onClose()}>
          <i className="fa fa-close"/></a>
        </span>
        <div className="topboxtxt">Edit Post</div>
        <div className="creategrfrmarea">
          {form}
        </div>
        <div ref={this.setWrapperRef}>
          {
            this.state.emojiVisible ?
              <Picker emoji="" showPreview={false} onSelect={this.addEmoji}/>
              : null
          }
        </div>
      </div>
    );
  }
}

export default EditPost;