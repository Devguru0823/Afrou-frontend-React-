import React, {Component} from 'react';
import memoize from "memoize-one";
import {toast} from "react-toastify";
import {Link} from 'react-router-dom';

import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300} from "../../constants/imageSizes";
import axios from "../../utils/axiosConfig";
import {toastOptions} from "../../constants/toastOptions";
import Loader from '../../components/Loders/HorizontalLoder/HorizontalLoader';

class UserList extends Component {
  state = {
    searchTerm: '',
    users: [],
    isLoading: true,
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
    this.setState({isLoading: true});
    const config = {
      headers: {'Authorization': "bearer " + this.props.token}
    };
    axios.get(`/posts/${this.props.postId}/likes`, config)
      .then(response => {
        console.log(response);
        this.setState({users: response.data.data, isLoading: false});
      })
      .catch(err => {
        console.log(err);
        toast.error('error', toastOptions);
        this.setState({isLoading: false})
      });
  }

  componentWillUnmount() {
    document.body.classList.remove("newpopup");
  }

  filter = memoize(
    (list, searchTerm) => list.filter(
      friend => friend.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  onChange = event => {
    this.setState({searchTerm: event.target.value});
  };

  render() {
    const friends = this.filter(this.state.users, this.state.searchTerm);
    const {onClose} = this.props;

    return (
      <div id="invitefriend" style={{display: 'block'}}>
        <span id="closeinvitepop" className="closepopp"><span onClick={() => onClose()}><i
          className="fa fa-close"/></span></span>
        <div className="topboxtxt">People who reacts</div>
        <div className="writetoshare1">
          <div className="searchbar">
            <input
              className="search_input"
              type="text" placeholder="Start typing to search....."
              value={this.state.searchTerm}
              onChange={this.onChange}
              style={{width: '100%'}}
            />
          </div>
        </div>
        <div className="sharepostarea1">
          {
            !this.state.isLoading
              ? (
                <ul className="allfriends">
                  {
                    friends.length === 0 ?
                      <li>
                        Sorry, no friends to show ☹️
                      </li> :
                      friends.map(friend => {
                        const {first_name, last_name, profile_image_url, user_id} = friend;
                        return (
                          <li key={user_id}>
                            <Link to={`/profile/${user_id}`}>
                              <div className="imgfriend">
                                <img src={`${BASE_URL}${profile_image_url}${SIZE_300}`} alt="user"/>
                              </div>
                              <div className="nemefriend">{`${first_name} ${last_name}`}</div>
                            </Link>
                          </li>
                        )
                      })
                  }
                </ul>
              )
              : <Loader/>
          }
        </div>
      </div>
    )
  }
}

export default UserList;
