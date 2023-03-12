import React, {Component} from 'react';
import {connect} from 'react-redux';

import App from '../../routes';
import ScrollToTop from '../../utils/ScrollToTop';

class MainApp extends Component {
  render() {
    const {match, user} = this.props;

    return (
      <ScrollToTop>
        <App match={match} user={user}/>
      </ScrollToTop>
    );
  }
}

const mapStateToProps = state => ({user: state.auth.user});

export default connect(mapStateToProps)(MainApp);