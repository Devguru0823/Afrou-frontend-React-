import React, {Component} from 'react';
import memoize from "memoize-one";

import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300} from "../../constants/imageSizes";

class InviteList extends Component {
  state = {
    searchTerm: '',
    friendsList: null
  };

  componentDidMount() {
    document.body.classList.add("newpopup");
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
    const friends = this.filter(this.props.friends, this.state.searchTerm);
    const {onClose} = this.props;

    return (
      <div id="invitefriend" style={{display: 'block'}}>
        <span id="closeinvitepop" className="closepopp"><span onClick={() => onClose()}><i
          className="fa fa-close"/></span></span>
        <div className="topboxtxt">Invitation List</div>
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
          <ul className="allfriends">
            {
              friends.length === 0 ?
                <li>
                  Sorry, no friends to show ☹️
                </li> :
                friends.map(friend => {
                  const {first_name, last_name, profile_image_url, button, user_id} = friend;
                  const {button_type, button_text, button_link} = button;
                  return (
                    <li key={user_id}>
                      <div className="imgfriend"><img src={`${BASE_URL}${profile_image_url}${SIZE_300}`} alt/></div>
                      <div className="nemefriend">{`${first_name} ${last_name}`}</div>
                      <div className="buttninvite">
                        {
                          button_type === 'invite' ?
                            <button className="btn btn-invite" name
                                    onClick={() => this.props.onRequestButtonClicked(button_link)}>
                              {button_text}
                            </button> :
                            <button className="btn btn-alredy" name disabled>{button_text}</button>
                        }
                      </div>
                    </li>
                  )
                })
            }
          </ul>
        </div>
      </div>
    )
  }
}

export default InviteList;
