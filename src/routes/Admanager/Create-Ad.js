// import React, { Component } from 'react';
// import axios from 'axios';
// import { makeStyles } from '@material-ui/core/styles';
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';
// import Backdrop from '@material-ui/core/Backdrop';
// import Fade from '@material-ui/core/Fade';

// class CreateAd extends Component {

//   state = {
//     ads: [],
//     open: false
//   }

//   async componentDidMount() {
//     // const my_ads = await (await axios.get('http://localhost:8080/api/ads/get-ads')).data
//     // console.log(my_ads)
//     // if (my_ads.status) {
//     //   this.setState({ ads: my_ads.ads })
//     // }
//   }

//   handleOpen = () => {
//     this.setState({ open: true });
//   };

//   handleClose = () => {
//     this.setState({ open: false });
//   };


//   render() {
//     const classes = {
//       modal: {
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//       },
//       paper: {
//         backgroundColor: '#fff',
//         border: '2px solid #000',
//         boxShadow: '5px 10px #eeeeee',
//         padding: '20px',
//       },
//     };
//     return (
//       <div className="main-panel">
//         {/* Navbar */}
//         <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
//           <div className="container-fluid">
//             <div className="navbar-wrapper">
//               <a className="navbar-brand" href="javascript:;">Create Ad</a>
//             </div>
//             <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
//               <span className="sr-only">Toggle navigation</span>
//               <span className="navbar-toggler-icon icon-bar"></span>
//               <span className="navbar-toggler-icon icon-bar"></span>
//               <span className="navbar-toggler-icon icon-bar"></span>
//             </button>
//             <div className="collapse navbar-collapse justify-content-end">
//               <ul className="navbar-nav">
//                 <li className="nav-item dropdown">
//                   <a className="nav-link" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                     <i className="material-icons">notifications</i>
//                     <span className="notification">5</span>
//                     <p className="d-lg-none d-md-block">
//                       Some Actions
//                 </p>
//                   </a>
//                   <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
//                     <a className="dropdown-item" href="#">Mike John responded to your email</a>
//                     <a className="dropdown-item" href="#">You have 5 new tasks</a>
//                     <a className="dropdown-item" href="#">You're now friend with Andrew</a>
//                     <a className="dropdown-item" href="#">Another Notification</a>
//                     <a className="dropdown-item" href="#">Another One</a>
//                   </div>
//                 </li>
//                 <li className="nav-item dropdown">
//                   <a className="nav-link" href="javascript:;" id="navbarDropdownProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                     <i className="material-icons">person</i>
//                     <p className="d-lg-none d-md-block">
//                       Account
//                 </p>
//                   </a>
//                   <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownProfile">
//                     <a className="dropdown-item" href="#">Profile</a>
//                     <a className="dropdown-item" href="#">Settings</a>
//                     <div className="dropdown-divider"></div>
//                     <a className="dropdown-item" href="#">Log out</a>
//                   </div>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </nav>
//         {/* End Navbar */}
//         <div className="content">
//           <div className="">
//             <div className="">
//               <div className="">
//                 <Button variant="contained" color="primary" onClick={this.handleOpen}>
//                   Create Ad
//                 </Button>
//                 <Modal
//                   aria-labelledby="transition-modal-title"
//                   aria-describedby="transition-modal-description"
//                   className={classes.modal}
//                   open={this.state.open}
//                   onClose={this.handleClose}
//                   closeAfterTransition
//                   BackdropComponent={Backdrop}
//                   BackdropProps={{
//                     timeout: 500,
//                   }}
//                 >
//                   <Fade in={this.state.open}>
//                     <div className={classes.paper}>
//                       <h2 id="transition-modal-title">Transition modal</h2>
//                       <p id="transition-modal-description">react-transition-group animates me.</p>
//                     </div>
//                   </Fade>
//                 </Modal>
//               </div>
//             </div>
//           </div>
//         </div>
//         <footer className="footer">
//           <div className="container-fluid">
//             <nav className="float-left">
//               <ul>
//                 <li>
//                   <a href="https://www.creative-tim.com">
//                     Creative Tim
//               </a>
//                 </li>
//                 <li>
//                   <a href="https://creative-tim.com/presentation">
//                     About Us
//               </a>
//                 </li>
//                 <li>
//                   <a href="http://blog.creative-tim.com">
//                     Blog
//               </a>
//                 </li>
//                 <li>
//                   <a href="https://www.creative-tim.com/license">
//                     Licenses
//               </a>
//                 </li>
//               </ul>
//             </nav>
//             <div className="copyright float-right">
//               &copy;
//           <script>
//                 document.write(new Date().getFullYear())
//           </script>, made with <i className="material-icons">favorite</i> by
//           <a href="https://www.creative-tim.com" target="_blank">Creative Tim</a> for a better web.
//         </div>
//           </div>
//         </footer>
//       </div>
//     )
//   }
// }


// export default CreateAd;



import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Stepper from './Stepper/Stepper'

const themeLight = createMuiTheme({
  palette: {
    background: {
      default: "#e4f0e2"
    }
  }
});

const themeDark = createMuiTheme({
  palette: {
    background: {
      default: "#222222"
    },
    text: {
      primary: "#ffffff"
    }
  }
});

export default function TransitionsModal() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="main-panel">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute fixed-top ">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <a className="navbar-brand" href="javascript:;">Create Ad</a>
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
          <div className="row">
            <div className="col-lg-12">
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Create Ad
              </Button>
              <MuiThemeProvider theme={themeLight}>
                <Dialog
                  fullScreen={fullScreen}
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">{"Create Your Ad"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      <Stepper />
                    </DialogContentText>
                  </DialogContent>
                  {/* <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                      Disagree
                  </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                      Agree
                  </Button>
                  </DialogActions> */}
                </Dialog>
              </MuiThemeProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}