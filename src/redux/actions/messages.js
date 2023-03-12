import {
  SET_MESSAGES_LIST,
  SET_MESSAGES_DATA,
  RESET_MESSAGES_DATA
} from './actionTypes';
import axios from '../../utils/axiosConfig';
import {
  uiStartLoading,
  uiStopLoading
} from './ui';
import { socket } from './socket';

if (socket.connected) {
  socket.on('invite', ({ roomId }) => {
    console.log('invite data', roomId);
    socket.emit('joinroom', { roomId });
  });
}


export const fetchMessagesList = token => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/messages`, config)
      .then(response => {
        dispatch(setFeed(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(setFeed({ data: [] }));
        dispatch(uiStopLoading());
      });
  };
};

export const fetchMessageDetail = (token, id) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  return dispatch => {
    dispatch(uiStartLoading());
    axios.get(`/messages/conversation/${id}`, config)
      .then(response => {
        console.log(response.data);
        dispatch(setMessageDetail(response.data));
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  };
};

export const postMessageDetail = (token, id, messageData) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  if (messageData.edit) {
    return dispatch => {
      axios.put(`/messages/${messageData.message_id}`, { message_text: messageData.message_text }, config)
        .then(() => {
          // dispatch(resetMessageDetail());
        })
        .catch(err => {
          console.log(err);
          dispatch(uiStopLoading());
        });
    };
  }

  if (messageData.reply) {
    console.log(messageData.to_id);
    console.log(messageData.message_id);
    messageData.message_reply_id = true;
    return dispatch => {
      dispatch(uiStartLoading());
      console.log(messageData);
      axios.post(`/messages/conversation/${messageData.to_id}/${messageData.message_id}`,
        {
          message_text: messageData.message_text,
          messageImage: messageData.message_image
        }, config)
        .then((response) => {
          console.log(response);
          dispatch(uiStopLoading());
        })
        .catch(err => {
          console.log(err);
          dispatch(uiStopLoading());
        });
    };
  }

  return dispatch => {
    dispatch(uiStartLoading());
    axios.post(`/messages/conversation/${id}`, messageData, config)
      .then(() => {
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiStopLoading());
      });
  };
};

// Function to like message in chat
export const likeMessageDetail = (token, messageData) => {
  console.log(token, messageData);
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };

  return dispatch => {
    axios.post(`likes/message`, messageData, config)
      .then(response => {
        console.log(response.data);
        // dispatch(resetMessageDetail());
      })
      .catch(err => {
        console.log(err.message);
      });
  };
};

// Function to delete message in chat
export const deleteMessageDetail = (token, messageId) => {
  const config = {
    headers: { 'Authorization': "bearer " + token }
  };
  return dispatch => {

    axios.delete(`/messages/${messageId}`, config)
      .then(response => {
        console.log(response.data);
        dispatch(resetMessageDetail());
      })
      .catch(err => {
        console.log(err);
      });
  };
};

const setFeed = data => {
  return {
    type: SET_MESSAGES_LIST,
    feed: data.data
  }
};

const setMessageDetail = data => {
  return {
    type: SET_MESSAGES_DATA,
    detail: data.data
  }
};

export const resetMessageDetail = () => {
  return {
    type: RESET_MESSAGES_DATA
  }
};
