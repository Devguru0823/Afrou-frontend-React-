import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {BASE_URL} from "../../constants/ImageUrls";
import MemberPictures from './MemberPictures';
import {SIZE_300} from "../../constants/imageSizes";

class GroupItem extends Component {
  state = {
    warningText: {
      accept: '',
      delete: '',
      leave: ''
    }
  };

  handleButtonClick = (link, linkType, option) => {
    if (!this.state.warningText[option] && option !== 'accept') {
      const newOption = this.state.warningText;
      newOption[option] = 'Sure?';
      this.setState({warningText : newOption});
      this.buttonTimeout = setTimeout(() => {
        const newOption = this.state.warningText;
        newOption[option] = '';
        this.setState({warningText: newOption});
      }, 4000)
    } else {
      clearTimeout(this.buttonTimeout);
      this.props.onRequestButton(link, linkType);
    }
  };

  render() {
    const {
      group_title,
      group_image,
      group_members,
      buttons,
      group_id,
      group_members_details,
      request_buttons
    } = this.props.groupDetails;
    const {groupType} = this.props;

    return (
      <li>
        <div className={groupType === 'search' ? "friendphoto" : "leftimage"}>
          <Link to={`/afrogroup/${group_id}`}>
            <img src={`${BASE_URL}${group_image}${SIZE_300}`} alt="group"/>
          </Link>
        </div>
        <div className={groupType === 'search' ? "friendnanetxt friendnanetxt-mobile" : "midgrouptext"}>
          {
            groupType === 'search'
              ? <Link to={`/afrogroup/${group_id}`}>{group_title}</Link>
              : <div className="grupname"><Link to={`/afrogroup/${group_id}`}>{group_title}</Link></div>
          }
          <div className="noofusers"><span>{group_members.length}</span>members</div>
          {
            groupType === 'other' || groupType === 'invitations' ?
              <MemberPictures details={group_members_details}/> : null
          }
        </div>
        {
          groupType !== 'search' ?
            buttons.map(button => {
              const {button_type, button_link, button_request_type} = button;
              if (button_type === 'delete') {
                return (
                  <div
                    className="rightdelactn"
                    title="Delete"
                    onClick={() => this.handleButtonClick(button_link, button_request_type, 'delete')}
                    key={button_link}
                    style={{cursor: 'pointer'}}
                  >
                    {this.state.warningText.delete ? this.state.warningText.delete : <i className="fa fa-trash"/>}
                  </div>
                );
              }
              if (button_type === 'accept') {
                return (
                  <div
                    className="rightdelactn join"
                    title="Join"
                    onClick={() => this.handleButtonClick(button_link, button_request_type, 'accept')}
                    key={button_link}
                    style={{cursor: 'pointer'}}
                  >
                    {this.state.warningText.accept ? this.state.warningText.accept : <i className="fa fa-check"/>}
                  </div>
                );
              }
              if (button_type === 'leave') {
                return (
                  <div
                    className="rightdelactn"
                    title="Leave"
                    onClick={() => this.handleButtonClick(button_link, button_request_type, 'leave')}
                    key={button_link}
                    style={{cursor: 'pointer'}}
                  >
                    {this.state.warningText.leave ? this.state.warningText.leave : <i className="fa fa-times"/>}
                  </div>
                );
              }
              return null
            }) :
            <div className="friendsbtnns friendsbtnns-mobile">
              {
                request_buttons ? request_buttons.map(button => {
                  if (button.button_type === 'danger') {
                    return <button key={button.button_text} className="buttonnormal"
                                   onClick={() => this.props.onRequestButton(button.button_link, 'danger', group_id)}>
                      {button.button_text}
                    </button>
                  }
                  if (button.button_type === 'warning') {
                    return <button key={button.button_text} className="buttonunfollow"
                                   onClick={() => this.props.onRequestButton(button.button_link, 'warning', group_id)}>
                      {button.button_text}
                    </button>
                  }
                  if (button.button_type === 'success') {
                    return <button key={button.button_text} className="buttonfollow"
                                   onClick={() => this.props.onRequestButton(button.button_link, 'success', group_id)}>
                      {button.button_text}
                    </button>
                  }
                  return null;
                }) : null
              }
            </div>
        }
      </li>
    );
  }
}

export default GroupItem;