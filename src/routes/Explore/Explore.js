import React from 'react';

import UserLayout from "../../hoc/UserDetail/UserDetail";
import HashTag from "./HashTag";
import Entertainment from "./Entertainment";

class Explore extends React.Component {
  state = {
    selectedType: 'entertainment'
  };

  handleTabChange = type => {
    this.setState({selectedType: type});
  };

  render() {
    const {selectedType} = this.state;

    return (
      <UserLayout>
        <div className="midleconarea">
          <div className="friendtexttx">
            <div
              className={`groupbttntxt gmangedbyy ${this.state.selectedType === 'entertainment' ? 'current' : null}`}
              onClick={() => this.handleTabChange('entertainment')}
            >
              Entertainment
            </div>
            <div
              className={`groupbttntxt gyoumjoinn ${this.state.selectedType === 'hashtags' ? 'current' : null}`}
              onClick={() => this.handleTabChange('hashtags')}
            >
              Hashtags
            </div>
          </div>
          {
            selectedType === 'hashtags'
              ? <HashTag/>
              : <Entertainment/>
          }
        </div>
      </UserLayout>
    );
  }
}

export default Explore;