import React, { Fragment } from 'react';
import Select from 'react-select';
//import Flatpickr from 'react-flatpickr';
import DatePicker from 'react-date-picker';
import { MentionsInput, Mention } from 'react-mentions';

import './Input.css';
import defaultStyles from './DefaultHashStyles';

class Input extends React.Component {
  state = {
    datepickerVisible: true,
    startDate: new Date()
  };

  handleDatepickerToggle = value => {
    this.setState({ datepickerVisible: value });
  }

  handleDatepickerChange = (value) => {
    this.props.changed(value == null || value === undefined ? { target: { value: '' } } : { target: { value } });
  };

  render() {
    const { props } = this;
    let inputElement = null;
    let inputClasses = ['form-control'];
    let outerInputClasses = ['form-group'];

    if (props.className) {
      inputClasses.push(props.className);
    }

    if (props.onlyClassName) {
      inputClasses = [props.onlyClassName];
    }

    if (props.outerClassName) {
      outerInputClasses.push(props.outerClassName);
    }

    if (props.onlyOuterClassName) {
      outerInputClasses = [props.onlyOuterClassName];
    }

    if (props.invalid && props.shouldValidate && props.touched) {
      inputClasses.push('Invalid');
    }

    switch (props.elementType) {
      case ('input'):
        if (props.elementConfig.type === 'file') {
          inputElement = <input
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            onChange={props.changed} />;
        } else {
          inputElement = <input
            className={inputClasses.join(' ')}
            {...props.elementConfig}
            value={props.value}
            onChange={props.changed} />;
        }
        break;
      case ('textarea'):
        inputElement = <textarea
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed} />;
        break;
      case ('hashtag'):
        inputElement = (
          <MentionsInput
            style={defaultStyles}
            value={props.value}
            onChange={props.changed}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            placeholder={props.elementConfig.placeholder}
          >
            <Mention
              markup="#__display__ "
              trigger="#"
              data={(query, cb) => props.elementConfig.asyncData(query, cb)}
              displayTransform={(id, display) => {
                return `#${display}`
              }}
              style={{ backgroundColor: '#cee4e5' }}
            />
          </MentionsInput>
        );
        break;
      case ('datepicker'):
        inputElement = 
          <Fragment>
            {
              this.state.datepickerVisible
                ? (
                  <DatePicker
                    value={this.props.value}
                    onChange={(date) => this.handleDatepickerChange(date)}
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                    className='form-control'
                    clearIcon= {false}
                  />
                )
                : null
            }
          </Fragment>
        break;
      case ('select'):
        inputElement = (<select
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}
          multiple={props.multiple}>
          {props.elementConfig.options.map(option => (
            <option key={option.displayValue}
              value={option.value}
              defaultValue={option.isSelected}>
              {option.displayValue}
            </option>
          ))}
        </select>);
        break;
      case ('reactSelect'):
        inputElement = (
          <Select
            styles={props.elementConfig.styles}
            options={props.elementConfig.options}
            {...props.elementConfig}
            className={inputClasses.join(' ')}
            value={props.value}
            onChange={values => props.changed({ target: { value: values } })}
          />
        );
        break;
      case ('radio'):
        inputElement = props.elementConfig.map((element, index) => (
          <React.Fragment key={index}>
            <input
              className={inputClasses.join(' ')}
              {...element}
              checked={props.value === element.value}
              value={element.value}
              onChange={props.changed}
            />
            {props.label[index]}
          </React.Fragment>
        ));
        break;
      case ('switch'):
        inputElement = (
          <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <p style={{ marginRight: '10px', marginBottom: '10px' }}>Private</p>
            <label className="switch">
              <input
                {...props.elementConfig}
                value={props.value}
                checked={!props.value}
                //checked={props.value === props.checkedCondition}
                onChange={props.changed}
              />
              <span className="slider round" />
            </label>
            <p style={{ marginLeft: '10px', marginBottom: '10px' }}>Public</p>
          </div>
        );
        break;
      default:
        inputElement = <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed} />
    }
    return (
      <div className={outerInputClasses.join(' ')}>
        {
          props.label && !Array.isArray(props.label) ? props.label : null
        }
        {inputElement}
      </div>
    );
  }
}

export default Input;
