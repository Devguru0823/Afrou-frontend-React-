import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import withErrorHandler from '../../utils/withErrorHandler';
import UserInfoNavBar from '../../components/UserInfoNavBar/UserInfoNavBar';
import {fetchProfileDetails, resetProfileDetail} from "../../redux/actions";
import axios from "../../utils/axiosConfig";

class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      profileDetails: {},
      isLoading: false,
    }
  }

  componentDidMount() {
    this._mounted = true;
    if (Number(this.props.match.params.id) === this.props.user.user_id) {
      return
    }
    this.props.fetchProfileDetails(this.props.token, this.state.id);
    if (this.state.id) {
      this.setState({isLoading: true});
      const config = {
        headers: {'Authorization': "bearer " + this.props.token}
      };

      axios.get('/profile', config)
        .then(response => {
          //console.log(response);
          if (this._mounted) {
            this.setState({isLoading: false});
            this.setState({profileDetails: response.data.data});
          }
        })
        .catch(() => {
          if (this._mounted) {
            this.setState({isLoading: false});
          }
          //console.log(err);
          //dispatch(setFeed({data: []}));
        });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
    this.props.resetProfileDetail();
  }

  render() {
    const {navCounters} = this.props;

    return (
      <section className="afroinneratear">
        <div className="container">
          <div className="height20"/>
          <div className='allsubmenus' id="user-nav">
            <UserInfoNavBar navCounters={navCounters}/>
          </div>
          <div className="height50"/>
          <div className="clearfix"/>

          {this.props.children}

        </div>
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    profileDetails: state.profile.profileDetails,
    token: state.auth.token,
    user: state.auth.user,
    isLoading: state.ui.isLoading,
    navCounters: state.count.navCounters
  }
};

const mapDispatchToProps = dispatch => {
  return {
    resetProfileDetail: () => dispatch(resetProfileDetail()),
    fetchProfileDetails: (token, id) => dispatch(fetchProfileDetails(token, id))
  }
};

export default withRouter(withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(ProfileDetail), axios));