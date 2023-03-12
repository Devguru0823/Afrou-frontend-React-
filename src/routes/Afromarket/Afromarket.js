import React, {Component} from 'react';
import {connect} from 'react-redux';

import withErrorHandler from '../../utils/withErrorHandler';
import axios from "../../utils/axiosConfig";
import UserDetail from '../../hoc/UserDetail/UserDetail';
import HorizontalLoader from '../../components/Loders/HorizontalLoder/HorizontalLoader';
import {fetchMarketFeed} from '../../redux/actions';
import PostItem from './PostItem';
import EditItem from './EditItem';
import ItemList from './ItemList';

class Afromarket extends Component {
  state = {
    showNewPostForm: false,
    showEditPostForm: false,
    selectedItem: null,
    categorySearch: '',
    searchTerm: '',
  };

  componentDidMount() {
    this.props.fetchMarketFeed(this.props.token);
  }

  handleCloseNewPostForm = () => {
    this.setState({showNewPostForm: false});
    this.props.fetchMarketFeed(this.props.token);
  };

  handleEdit = data => {
    this.setState({showEditPostForm: true, selectedItem: data});
  };

  handleCloseEditPostForm = () => {
    this.setState({showEditPostForm: false, selectedItem: null});
    this.props.fetchMarketFeed(this.props.token);
  };

  handleCategorySearchChange = event => {
    this.setState({categorySearch: event.target.value});
  };

  handleSearchChange = event => {
    this.setState({searchTerm: event.target.value});
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.fetchMarketFeed(this.props.token, this.state.searchTerm, this.state.categorySearch);
  };

  render() {
    let marketList = <HorizontalLoader/>;
    if (!this.props.isLoading && this.props.feed) {
      marketList = this.props.feed.map(feedData => {
        return (
          <ItemList
            data={feedData}
            key={feedData._id}
            userId={this.props.user.user_id}
            onEditClicked={() => this.handleEdit(feedData)}
            history={this.props.history}
          />
        );
      })
    }

    return (
      <UserDetail>
        <div className="midleconarea">
          <div className="awhitebg">
            <div className="marketlistarea">
              <h6>Afro Market</h6>
              {
                this.state.showNewPostForm ?
                  <PostItem
                    token={this.props.token}
                    onClose={this.handleCloseNewPostForm}
                    isLoading={this.props.isLoading}
                  /> :
                  null
              }
              {
                this.state.showEditPostForm ?
                  <EditItem
                    token={this.props.token}
                    onClose={this.handleCloseEditPostForm}
                    data={this.state.selectedItem || []}
                    isLoading={this.props.isLoading}
                  /> :
                  null
              }
              <div className="maketsearcharea">
                <div className="row">
                  <div className="col-md-9">
                    <form className="form-inline" onSubmit={this.handleSubmit}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Find item.."
                        onChange={this.handleSearchChange}
                        value={this.state.searchTerm}
                      />
                      <select
                        className="form-control"
                        onChange={this.handleCategorySearchChange}
                        value={this.state.categorySearch}
                      >
                        <option value="">--Select--</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Hostel">Hostel</option>
                      </select>
                      <button type="submit" className="btn btn-primary bttnsearch"><i className="fa fa-search"/>
                      </button>
                    </form>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() => this.setState({showNewPostForm: true})}
                    >
                      Post Item
                    </button>
                  </div>
                </div>
                <div className="clearfix"/>
                <div className="partmarketboxrow">
                  {marketList}
                </div>
              </div>
            </div>
          </div>
        </div>
      </UserDetail>
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    feed: state.market.feed,
    user: state.auth.user,
    isLoading: state.ui.isLoading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchMarketFeed: (token, searchTerm, category) => dispatch(fetchMarketFeed(token, searchTerm, category))
  }
};

export default withErrorHandler(connect(mapStateToProps, mapDispatchToProps)(Afromarket), axios);
