import React from 'react';

import FriendItem from '../UserMenu/FriendItem';

const userMenu = props => {
  return (
    <div className="insiderarea">
      <div className='allfriendsactnot'>
        <h4>{props.type}</h4>
        <button onClick={() => props.closeButtonClicked()} className="right-sidebar-close">Close</button>
        <ul>
          {
            props.friendsList.map((friend, index) => (
              <FriendItem friendDetail={friend} key={index}/>
            ))
          }
        </ul>
      </div>
    </div>
  )
};

export default userMenu;
