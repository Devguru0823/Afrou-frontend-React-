import React from 'react';
import moment from 'moment';

const confirm = props => {
  return (
    <div style={styles.mainContainer}>
      <div className="row" style={styles.topContainer}>
        <div className="col-4">Gender</div>
        <div className="col-8">{props.allData.gender === 'M' ? 'Male' : 'Female'}</div>
        <div className="col-4">Date of Birth</div>
        <div className="col-8">{moment(props.allData.date_of_birth).format('DD-MM-YYYY')}</div>
        <div className="col-4">Profile Visibility</div>
        <div className="col-8">
          {
            props.allData.private
              ? 'Private'
              : 'Public'
          }
        </div>
        <div className="col-4">Religion</div>
        <div className="col-8">{props.allData.religion}</div>
        <div className="col-4">Career Interest</div>
        <div className="col-8">{props.allData.career_interest}</div>
        <div className="col-4">Country</div>
        <div className="col-8">{props.allData.nationality}</div>
        <div className="col-4">State</div>
        <div className="col-8">{props.allData.state}</div>
        <div className="col-4">Interests</div>
        <div className="col-8">
          {
            props.allData.sports_interests.filter((interest, index) => index < 2).map((interest, index) => {
              if (index === 1) {
                if (props.allData.sports_interests.length > 2) {
                  return `${interest} and ${props.allData.sports_interests.length - 2} other(s)`
                } else {
                  return `${interest}`
                }
              }
              return `${interest}, `
            })
          }
        </div>
      </div>
      <div className="row" style={styles.bottomContainer}>
        <div className="col-sm-6">
          <button
            type="button"
            className="form-control"
            style={{cursor: 'pointer'}}
            disabled={props.isLoading}
            onClick={props.prevStep}
          >
            Previous Page
          </button>
        </div>
        <div className="col-sm-6">
          <button
            type="button"
            onClick={props.onSubmit}
            className="form-control"
            style={{cursor: 'pointer', marginTop: '5px'}}
            disabled={props.isLoading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
};

const styles = {
  mainContainer: {
    margin: '10px',
  },
  topContainer: {
    marginBottom: '15px'
  },
  bottomContainer: {}
};

export default confirm;