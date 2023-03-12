import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class NotFound extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="error-template">
              <h1>
                Oops!</h1>
              <h2>
                Page Not Found</h2>
              <div className="error-details">
                Sorry, an error has occurred, Requested page not found!
              </div>
              <div className="error-actions">
                <Link to="/afroswagger" className="btn btn-warning btn-lg home-btn">
                  <i className="fa fa-home" aria-hidden="true"/>     Take Me Home
                </Link>
                <div onClick={() => this.props.history.go(-1)} className="btn btn-warning btn-lg">
                  <i className="fa fa-undo" aria-hidden="true"/>     Go to previous page
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;