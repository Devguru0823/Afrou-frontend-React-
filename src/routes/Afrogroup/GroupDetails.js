import React from 'react';

import {BASE_URL} from "../../constants/ImageUrls";
import {SIZE_300, SIZE_600} from "../../constants/imageSizes";
import Loader from '../../components/Loders/CircleLoder/CircleLoader';

const groupDetails = props => {
  const {groupDetails} = props;
  let coverImageUrl = groupDetails ? `url(${BASE_URL}${groupDetails.group_cover_image}${SIZE_600})` : '';
  if (props.isLoading) {
    coverImageUrl = 'url(/images/dot-loader.gif)'
  }

  let inputCoverElement = {};
  let inputGroupElement = {};
  let inputGroupButton = {};
  const onClickCover = event => {
    if (event.target === inputGroupButton || event.target === inputCoverElement) {
      return
    }
    props.onOpenViewBox(`${BASE_URL}${groupDetails.group_cover_image}${SIZE_600}`)
  };

  return (
    <div className="awhitebg">
      <div className="marketlistarea">
        <div
          className="groupdetailstop"
          style={{backgroundImage: coverImageUrl, cursor: 'pointer'}}
          onClick={(e) => onClickCover(e)}
        >
          <div className="bttnupload">
            <input
              style={{display: 'none'}}
              type="file"
              ref={input => inputCoverElement = input}
              onChange={(event) => props.onUploadCover(event.target.files[0], 'cover')}
            />
            {
              groupDetails && groupDetails.admin ?
                <button
                  type="button"
                  className="btn btn-dark"
                  ref={input => inputGroupButton = input}
                  onClick={() => inputCoverElement.click()}
                >
                  <i className="fa fa-file-image-o"/>Upload Cover Image
                </button> : null
            }
          </div>
        </div>
        <div className="clearfix"/>
        <div className="nameimgarea">
          <div className="groupprofileimg">
            <div className="groupimg">
              {
                props.isLoading
                  ? (
                    <Loader style={{fontSize: '7.3px'}}/>
                  )
                  : (
                    <img
                      onClick={() => props.onOpenViewBox(`${BASE_URL}${groupDetails.group_image}${SIZE_300}`)}
                      src={
                        groupDetails && groupDetails.group_image ?
                          `${BASE_URL}${groupDetails.group_image}${SIZE_300}` :
                          '/images/group_default.jpg'
                      }
                      alt="group" className="img-responsive"
                      style={{cursor: 'pointer'}}
                    />
                  )
              }
            </div>
            <button
              style={{display: 'none'}}
              ref={input => inputGroupElement = input}
              onClick={() => props.onUpload('group')}
            />
            {
              groupDetails && groupDetails.admin ?
                <div className="editgrupimage">
                  <div onClick={() => inputGroupElement.click()}>Change Image <i className="fa fa-file-image-o"/></div>
                </div> : null
            }
            <div className="groupname">{groupDetails ? groupDetails.group_title : '....'}</div>
            {
              groupDetails && groupDetails.admin ?
                <div className="editgroupname">
                  <div onClick={props.onEditNameClicked}>Settings <i className="fa fa-cog"/></div>
                </div> : null
            }
          </div>
        </div>
        <div className="clearfix"/>
        <div className="aboutconarea">
          <h4>About</h4>
          <p>{groupDetails ? groupDetails.group_description : '....'}</p>
        </div>
        <div className="aboutconarea">
          <h4>Topic</h4>
          <p>{groupDetails ? groupDetails.group_category : '....'}</p>
        </div>
        <div className="clearfix"/>
        <div className="alldatarelgroup">
          <ul>
            <li>
              <span>{groupDetails && groupDetails.group_members ? groupDetails.group_members.length : '...'}</span> Members
            </li>
            <li><span>{groupDetails ? groupDetails.post_count : '....'}</span> Posts</li>
            <li>
              {
                groupDetails && groupDetails.membership_status === 'member'
                  ? (
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                      {
                        !groupDetails.admin
                          ? (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => props.onAcceptInvitationClicked(groupDetails.group_id, 'leave')}
                              style={{marginBottom: '10px'}}
                            >
                              <i className="fa fa-sign-out"/>Leave Group
                            </button>
                          ) :
                          null
                      }
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={props.onAddMemberClicked}
                      >
                        <i className="fa fa-plus"/>Invite Friends
                      </button>
                    </div>
                  )
                  : groupDetails && groupDetails.membership_status === 'invited'
                  ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => props.onAcceptInvitationClicked(groupDetails.group_id, 'accept')}
                    >
                      <i className="fa fa-plus"/>Accept Invitation
                    </button>
                  )
                  : groupDetails && !groupDetails.private
                    ? (
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => props.onAcceptInvitationClicked(groupDetails.group_id, 'join')}
                      >
                        <i className="fa fa-plus"/>Join Group
                      </button>
                    )
                    : null
              }
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default groupDetails;