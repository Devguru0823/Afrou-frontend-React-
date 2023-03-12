import React, { Component } from 'react';
import axios from 'axios';


class Dashboard extends Component {

  state = {
    ads: []
  }

  async componentDidMount() {
    const my_ads = await (await axios.get('http://localhost:8080/api/ads/get-ads')).data
    console.log(my_ads)
    if (my_ads.status) {
      this.setState({ ads: my_ads.ads })
    }
  }

  render() {
    return (
      <div className="main-panel">
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
          <div className="container-fluid">
            <div className="navbar-wrapper">
              <a className="navbar-brand" href="javascript:;">Dashboard</a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
              <span className="sr-only">Toggle navigation</span>
              <span className="navbar-toggler-icon icon-bar"></span>
              <span className="navbar-toggler-icon icon-bar"></span>
              <span className="navbar-toggler-icon icon-bar"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end">
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <a className="nav-link" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="material-icons">notifications</i>
                    <span className="notification">5</span>
                    <p className="d-lg-none d-md-block">
                      Some Actions
                </p>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                    <a className="dropdown-item" href="#">Mike John responded to your email</a>
                    <a className="dropdown-item" href="#">You have 5 new tasks</a>
                    <a className="dropdown-item" href="#">You're now friend with Andrew</a>
                    <a className="dropdown-item" href="#">Another Notification</a>
                    <a className="dropdown-item" href="#">Another One</a>
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link" href="javascript:;" id="navbarDropdownProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="material-icons">person</i>
                    <p className="d-lg-none d-md-block">
                      Account
                </p>
                  </a>
                  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownProfile">
                    <a className="dropdown-item" href="#">Profile</a>
                    <a className="dropdown-item" href="#">Settings</a>
                    <div className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#">Log out</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* End Navbar */}
        <div className="content">
          <div className="container-fluid">
            <h3>All Ads</h3>
            <div className="row">
              {
                this.state.ads.length === 0 ?
                (
                  <div className="col-md-12 text-center mt-5">
                    <p>No ads to show</p>
                  </div>
                ) :
                this.state.ads.map((ad) => {
                  return (
                    <div key={ad.ad_id} className="col-md-6">
                      <div className="card card-chart p-3">
                        {/* <div className="card-header card-header-success">
                    <div className="ct-chart" id="dailySalesChart"></div>
                  </div> */}
                        <div className="card-heade">
                          <h3 className="card-title">{ad.campaign.campaign_name}</h3>
                          <p className="card-category">{ad.adcontent.description}</p>
                        </div>
                        <div className="card-body pl-0 pr-0">
                          <img src={ad.adcontent.imagePath} alt="ad pic" style={{ width: '100%', height: '300px', objectFit: 'cover' }}/>
                        </div>
                        <div className="card-footer">
                          <div className="stats">
                            <i className="material-icons">access_time</i>Created on {ad.createdDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container-fluid">
            <nav className="float-left">
              <ul>
                <li>
                  <a href="https://www.creative-tim.com">
                    Creative Tim
              </a>
                </li>
                <li>
                  <a href="https://creative-tim.com/presentation">
                    About Us
              </a>
                </li>
                <li>
                  <a href="http://blog.creative-tim.com">
                    Blog
              </a>
                </li>
                <li>
                  <a href="https://www.creative-tim.com/license">
                    Licenses
              </a>
                </li>
              </ul>
            </nav>
            <div className="copyright float-right">
              &copy;
          <script>
                document.write(new Date().getFullYear())
          </script>, made with <i className="material-icons">favorite</i> by
          <a href="https://www.creative-tim.com" target="_blank">Creative Tim</a> for a better web.
        </div>
          </div>
        </footer>
      </div>
    )
  }
}


export default Dashboard;