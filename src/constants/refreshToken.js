import axios from '../utils/axiosConfig';
import { toast } from 'react-toastify';

async function refreshAccess() {
  // refresh token
  const refresh_token = localStorage.getItem('refresh_token');
  const login_device_detail = JSON.parse(localStorage.getItem('login_device_detail'));
  axios.post('/users/refresh', { refresh_token, login_device_detail })
    .then((response) => {
      if(!response) {
        toast('Something went wrong', { position: 'top-center', type: 'error' });
        return;
      }

      const { status, access_token, refresh_token } = response.data;
      if(status) {
        localStorage.setItem('token', access_token);
        if(refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }
        return;
      }

      toast('Something went wrong', { position: 'top-center', type: 'error' });
      return;
    }).catch((err) => {
      console.log(err.message);
      toast('Something went wrong', { position: 'top-center', type: 'error' });
      return;
    })
}

export default refreshAccess;