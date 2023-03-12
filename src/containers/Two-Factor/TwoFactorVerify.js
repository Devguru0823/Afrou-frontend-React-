import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axiosConfig';
import { CircularProgress, Backdrop } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Swal from '@sweetalert/with-react';
import { useLocation } from 'react-router-dom';
import { checkAuthState } from '../../redux/actions';
import withErrorHandler from '../../utils/withErrorHandler';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Verify2Fa(props) {

  const [isLoading, setIsLoading] = useState(false);

  const query = useQuery();
  const token = query.get('token');
  const mode = query.get('mode')

  useEffect(() => {
    setIsLoading(true);
    (async function () {

      if (props.match.params.user_id) {
        let response;
        try {
          response = await (await axios.post(`/users/unsubscribe`, { user_id: Number.parseInt(props.match.params.user_id) })).data;
        } catch (error) {
          setIsLoading(false);
          if (error.response) {
            console.log(error.response);
            toast(error.response.message, { position: 'top-center', type: 'error' });
            return;
          }
          toast('Something went wrong', { position: 'top-center', type: 'error' });
          return;
        }

        setIsLoading(false);setIsLoading(false);

        if (!response) {
          toast('Something went wrong', { position: 'top-center', type: 'error' });
          props.history.push('/');
          return;
        }

        Swal({
          icon: 'success',
          title: 'Success',
          text: 'You have successfully unsubscribed receiving emails'
        }).then(() => {
          props.history.push('/')
        })
        return;
      }

      const login_device_detail = JSON.parse(localStorage.getItem('login_device_detail'));
      let response;
      try {
        response = await (await axios.post(`/users/2fa/${mode}/verify/?token=${token}`, { login_device_detail })).data;
      } catch (error) {
        setIsLoading(false);
        if (error.response) {
          console.log(error.response);
          toast(error.response.message, { position: 'top-center', type: 'error' });
          return;
        }
        toast('Something went wrong', { position: 'top-center', type: 'error' });
        return;
      }

      setIsLoading(false);

      if (!response) {
        toast('Something went wrong', { position: 'top-center', type: 'error' });
        props.history.push('/');
        return;
      }

      if (response.status) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        Swal({
          icon: 'success',
          title: 'Success',
          text: 'Token valid, Login successful'
        }).then(() => {
          props.checkAuthState();
          props.history.push('/afroswagger');
        })
      }
    }())
  }, []);

  const handleCloseBackdrop = () => {
    if (isLoading) {
      return;
    }
    setIsLoading(false);
  }

  const classes = useStyles();

  return (
    <>
      <Backdrop className={classes.backdrop} open={isLoading} onClick={handleCloseBackdrop}>
        <CircularProgress color="inherit" />
        {
          props.match.params.user_id ? <p>Loading...</p> : <p>Verifying Token...</p>
        }
      </Backdrop>
    </>
  )
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}



const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    checkAuthState: () => dispatch(checkAuthState()),
  };
};

export default withErrorHandler(
  connect(mapStateToProps, mapDispatchToProps)(Verify2Fa),
  axios
);