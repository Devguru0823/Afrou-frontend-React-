// jshint esversion:8
import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import withErrorHandler from '../../../utils/withErrorHandler';
import axios from '../../../utils/axiosConfig';
import UserLayout from '../../../hoc/UserDetail/UserDetail';
import {
	fetchMessageDetail,
	postMessageDetail,
	deleteMessageDetail,
	likeMessageDetail,
	socket,
} from '../../../redux/actions';
import HorizontalLoader from '../../../components/Loders/HorizontalLoder/HorizontalLoader';
import { Picker } from 'emoji-mart';
import classes from './MessageDetail.module.css';
import { BASE_URL } from '../../../constants/ImageUrls';
import { toast } from 'react-toastify';
import ProfileImageView from '../../../components/ProfileInfoBox/ProfileImageView';
import ExifOrientationImg from 'react-exif-orientation-img';
import $ from 'jquery';
import swal from '@sweetalert/with-react';
import { v4 as uuidv4 } from 'uuid';

const loggedInUser = localStorage.getItem('user');
class MessageDetail extends Component {
	state = {
		messages: [],
		message: '',
		emojiVisible: false,
		files: null,
		isFileUploading: false,
		uploadedImageUrl: null,
		showViewer: false,
		viewerUrl: '',
		edit: false,
		messageId: '',
		reply: false,
		replyText: '',
		replyImg: '',
		to_id: '',
		wasClicked: false,
	};

	intervalId;
	page = 2;

	_ismounted = false;

	scrollListener(event) {
		console.log('Event: ', event);
	}

	async componentDidMount() {
		this._ismounted = true;
		// this.props.fetchDetail(this.props.token, this.props.match.params.messageId);
		// this.intervalId = setInterval(() =>
		//   this.props.fetchDetail(this.props.token, this.props.match.params.messageId), 1000
		// );

		$('#msg-detail').scrollTop($('#msg-detail')[0].scrollHeight);
		// $('#msg-detail').animate({
		//   scrollTop: $('#msg-detail')[0].scrollHeight}, "slow");

		if (this._ismounted) {
			const roomDetails = {
				from_id: loggedInUser,
				to_id: this.props.match.params.messageId,
			};

			if (socket.connected) {
				socket.emit('getroom', roomDetails, (err, data) => {
					if (err) {
						console.log(err);
						return;
					}
					console.log(data);
				});

				socket.on('getroom', (data) => {
					console.log(data);
				});

				socket.on('getmessages', (data) => {
					this.setState({ messages: data.data });
				});

				socket.emit('getmessages', {
					from_id: loggedInUser,
					to_id: this.props.match.params.messageId,
					page: 2,
				});

				socket.on('messageRead', () => {
					const messages = [...this.state.messages];

					for (let message of messages) {
						if (message.from === 'me' && message.message_status === 'unread') {
							message.message_status = 'read';
						}
					}
					this.setState({ messages });
				});

				socket.on('likeMessage', (data) => {
					console.log('New message liked: ', data);
					const messages = [...this.state.messages];
					const messageIndex = this.state.messages.findIndex(
						(x) => x.message_id === data.data.message_id
					);
					const message = { ...this.state.messages[messageIndex] };
					console.log(message);
					message.like_count = data.data.like_count;
					messages[messageIndex] = message;
					this.setState({ messages });
				});

				socket.on('replyMessage', (data) => {
					const prevMessages = [...this.state.messages];
					data.data.from = 'him';
					const newMessage = data.data;
					prevMessages.push(newMessage);
					this.setState({ messages: prevMessages });
				});

				socket.on('deleteMessage', (delData) => {
					const { status, data } = delData;
					if (status) {
						// remove message from messages array
						const messages = [...this.state.messages];
						const messageIndex = messages.findIndex(
							(x) => x.message_id === data.message_id
						);
						if (messageIndex !== -1) {
							messages.splice(messageIndex, 1);
							this.setState({ messages });
						}
					}
				});

				socket.on('updateMessage', (editData) => {
					const { status, data } = editData;
					console.log('edited data: ', data);
					if (status) {
						const messages = [...this.state.messages];
						const messageIndex = messages.findIndex(
							(x) => x.message_id === data.message_id
						);
						if (messageIndex !== -1) {
							console.log(messages[messageIndex]);
							data.from = 'friend';
							messages[messageIndex] = data;
							this.setState({ messages });
							return;
						}
					}
				});

				socket.on('message', (data) => {
					const messageState = [...this.state.messages];
					const message = data;
					message.from = 'him';
					messageState.push(message);
					console.log('message has been pushed');
					this.setState({ messages: messageState });

					// if (this.props.match.path === '/messages/conversation/:messageId') {
					// 	console.log('sending read message event...');
					// 	socket.emit(
					// 		'readMessage',
					// 		{ message_id: data.message_id },
					// 		(err, data) => {
					// 			if (err) {
					// 				console.log(err);
					// 				return;
					// 			}
					// 			if (data.status) {
					// 				const messageIndex = messageState.findIndex((x) => {
					// 					return x.message_id === message.message_id;
					// 				});
					// 				console.log('message index: ', messageIndex);
					// 				if (messageIndex !== -1) {
					// 					console.log('marking message as read');
					// 					messageState[messageIndex].message_status = 'read';
					// 					this.setState({ messages: messageState });
					// 				}
					// 			}
					// 		}
					// 	);
					// }

					// const notification_data = loggedInUser
					// 	? {
					// 			from_user_id: Number.parseInt(loggedInUser),
					// 			to_user_id: Number.parseInt(this.props.match.params.messageId),
					// 			type: 'new message'
					// 	  }
					// 	: {};
					// socket.emit('notification', notification_data, (err, resp) => {
					// 	if (err) {
					// 		console.log('notification error: ', err);
					// 		return;
					// 	}
					// 	console.log(resp);
					// });
				});
			}
		}
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log('did update');

		// this.props.fetchDetail(this.props.token, this.props.match.params.messageId);
		window.addEventListener('resize', this.scrollToBottom);
		if (this.el && this.state.showViewer === prevState.showViewer) {
			this.scrollToBottom();
			// $('#msg-detail').animate({
			//   scrollTop: $('#msg-detail')[0].scrollHeight}, "slow");
		}
	}

	componentWillUnmount() {
		this._ismounted = false;
		clearInterval(this.intervalId);
		window.removeEventListener('resize', this.scrollToBottom);
	}

	// update message state on input change
	onInputChange = (e) => {
		this.setState({ message: e.target.value });
	};

	onInputFocus = () => {
		// $('#msg-detail').animate({
		//   scrollTop: $('#msg-detail')[0].scrollHeight}, "slow");
		$('#msg-detail').scrollTop($('#msg-detail')[0].scrollHeight);
	};

	// Send message
	onSend = () => {
		let messageData;

		if (this.state.edit) {
			console.log('inside edit block');
			this.setState({
				message: '',
				uploadedImageUrl: null,
				edit: false,
				messageId: '',
			});
			return socket.emit(
				'updateMessage',
				{
					from_id: Number.parseInt(loggedInUser),
					to_id: Number.parseInt(this.props.match.params.messageId),
					message_id: Number.parseInt(this.state.messageId),
					message: this.state.message,
				},
				(err, resp) => {
					if (err) {
						console.log(err);
						return;
					}
					console.log(resp);
					const { status, data } = resp;
					if (status) {
						const messages = [...this.state.messages];
						const messageIndex = messages.findIndex(
							(x) => x.message_id === data.message_id
						);
						if (messageIndex !== -1) {
							console.log(messages[messageIndex]);
							console.log(data);
							data.from = 'me';
							messages[messageIndex] = data;
							this.setState({ messages });
							return;
						}
					}
				}
			);
		}

		if (this.state.reply) {
			console.log('in reply block');
			const emitData = {
				from_id: Number.parseInt(loggedInUser),
				to_id: Number.parseInt(this.props.match.params.messageId),
				message_id: Number.parseInt(this.state.messageId),
				message_text: this.state.message,
			};
			const prevMessages = [...this.state.messages];
			const message = {
				_id: uuidv4(),
				message_text: emitData.message_text,
				from_id: emitData.from_id,
				to_id: emitData.to_id,
				message_status: 'pending',
				created_date: new Date(),
				message_id: uuidv4(),
				message_reply_id: uuidv4(),
				message_reply_text: this.state.replyText,
				liked_by: [],
				from_user: {
					first_name: loggedInUser.first_name,
					last_name: loggedInUser.last_name,
					user_name: '',
					profile_image_url: loggedInUser.profile_image_url,
				},
				from: 'me',
				like_count: 0,
				liked: false,
				blocked_by_me: false,
			};
			prevMessages.push(message);
			this.setState({
				message: '',
				messages: prevMessages,
				uploadedImageUrl: null,
				reply: false,
				messageId: '',
			});
			return socket.emit('replyMessage', emitData, (err, resp) => {
				if (err) {
					console.log(err);
					return;
				}
				const allMessages = [...this.state.messages];
				const messageIndex = allMessages.findIndex(
					(x) => x.message_id === message.message_id
				);
				if (messageIndex !== -1) {
					allMessages[messageIndex] = resp.data;
					this.setState({ messages: allMessages });
				}
				return;
			});
		}

		messageData = {
			message: this.state.message || '',
			message_image: this.state.uploadedImageUrl || '',
			from_id: loggedInUser.toString() || '',
			to_id: this.props.match.params.messageId || '',
		};
		// this.props.postMessage(this.props.token, this.props.match.params.messageId, messageData);
		const messages = [...this.state.messages];
		const message = {
			_id: uuidv4(),
			message_text: messageData.message,
			from_id: messageData.from_id,
			to_id: messageData.to_id,
			message_status: 'pending',
			created_date: new Date(),
			message_id: uuidv4(),
			liked_by: [],
			from_user: {
				first_name: loggedInUser.first_name,
				last_name: loggedInUser.last_name,
				user_name: '',
				profile_image_url: loggedInUser.profile_image_url,
			},
			from: 'me',
			like_count: 0,
			liked: false,
			blocked_by_me: false,
		};
		messages.push(message);
		this.setState({ message: '', uploadedImageUrl: null, messages });
		return socket.emit('message', messageData, (err, data) => {
			if (err) {
				console.log('message send error: ', err);
			}
			console.log('message data: ', data);
			console.log('message sent: ', data.message);
			const allMessages = [...this.state.messages];
			const messageIndex = allMessages.findIndex(
				(x) => x.message_id === message.message_id
			);
			if (messageIndex !== -1) {
				allMessages[messageIndex] = data.message;
				this.setState({ messages: allMessages });
			}
		});
	};

	// Function to like message
	onLike = (messageId) => {
		const likeData = {
			from_id: Number.parseInt(loggedInUser),
			message_id: Number.parseInt(messageId),
			like_type: 'message',
			to_id: Number.parseInt(this.props.match.params.messageId),
		};
		return socket.emit('likeMessage', likeData, (err, resp) => {
			if (err) {
				console.log(err);
				return;
			}
			// update message like status
			console.log(resp.data);
			const messages = [...this.state.messages];
			const messageIndex = this.state.messages.findIndex(
				(x) => x.message_id === resp.data.message_id
			);
			const message = { ...this.state.messages[messageIndex] };
			console.log(message);
			message.like_count = resp.data.like_count;
			messages[messageIndex] = message;
			this.setState({ messages });
		});
	};

	// Function to edit message
	editMessageHandler = (messageId, messageText) => {
		this.setState({
			message: messageText,
			edit: true,
			messageId,
			reply: false,
			replyText: '',
		});
		document.getElementById('inputMessage').focus();
	};

	// function to reply message
	replyMessageHandler = (message_id, messageText, message_image) => {
		this.setState({
			reply: true,
			replyText: messageText,
			replyImg: message_image,
			to_id: this.props.match.params.messageId,
			messageId: message_id,
			message: '',
			edit: false,
		});
		document.getElementById('inputMessage').focus();
	};

	// function to cancel reply
	cancelReply = () => {
		this.setState({ reply: false, replyText: '' });
	};

	// function to delete message
	deleteMessageHandler = (message_id) => {
		const loggedInUser = JSON.parse(localStorage.getItem('user'));
		swal({
			icon: 'warning',
			title: 'Warning',
			text: 'Are you sure you want to delete message?',
			button: { text: 'Yes' },
		}).then((result) => {
			if (result) {
				return socket.emit(
					'deleteMessage',
					{
						from_id: Number.parseInt(loggedInUser),
						message_id,
						to_id: Number.parseInt(this.props.match.params.messageId),
					},
					(err, resp) => {
						if (err) {
							console.log(err);
							return;
						}
						// remove message from messages array
						const messages = [...this.state.messages];
						const messageIndex = messages.findIndex(
							(x) => x.message_id === resp.data.message_id
						);
						if (messageIndex !== -1) {
							messages.splice(messageIndex, 1);
							this.setState({ messages });
						}
					}
				);
			}
		});
	};

	onSendByKeyPress = (e) => {
		let messageData;
		if (e.key === 'Enter') {
			e.preventDefault();
			if (this.state.edit) {
				console.log('inside edit block');
				this.setState({
					message: '',
					uploadedImageUrl: null,
					edit: false,
					messageId: '',
				});
				return socket.emit(
					'updateMessage',
					{
						from_id: Number.parseInt(loggedInUser),
						to_id: Number.parseInt(this.props.match.params.messageId),
						message_id: Number.parseInt(this.state.messageId),
						message: this.state.message,
					},
					(err, resp) => {
						if (err) {
							console.log(err);
							return;
						}
						console.log(resp);
						const { status, data } = resp;
						if (status) {
							const messages = [...this.state.messages];
							const messageIndex = messages.findIndex(
								(x) => x.message_id === data.message_id
							);
							if (messageIndex !== -1) {
								console.log(messages[messageIndex]);
								console.log(data);
								data.from = 'me';
								messages[messageIndex] = data;
								this.setState({ messages });
								return;
							}
						}
					}
				);
			}

			if (this.state.reply) {
				console.log('in reply block');
				const emitData = {
					from_id: Number.parseInt(loggedInUser),
					to_id: Number.parseInt(this.props.match.params.messageId),
					message_id: Number.parseInt(this.state.messageId),
					message_text: this.state.message,
				};
				const prevMessages = [...this.state.messages];
				const message = {
					_id: uuidv4(),
					message_text: emitData.message_text,
					from_id: emitData.from_id,
					to_id: emitData.to_id,
					message_status: 'pending',
					created_date: new Date(),
					message_id: uuidv4(),
					message_reply_id: uuidv4(),
					message_reply_text: this.state.replyText,
					liked_by: [],
					from_user: {
						first_name: loggedInUser.first_name,
						last_name: loggedInUser.last_name,
						user_name: '',
						profile_image_url: loggedInUser.profile_image_url,
					},
					from: 'me',
					like_count: 0,
					liked: false,
					blocked_by_me: false,
				};
				prevMessages.push(message);
				this.setState({
					message: '',
					messages: prevMessages,
					uploadedImageUrl: null,
					reply: false,
					messageId: '',
				});
				return socket.emit('replyMessage', emitData, (err, resp) => {
					if (err) {
						console.log(err);
						return;
					}
					const allMessages = [...this.state.messages];
					const messageIndex = allMessages.findIndex(
						(x) => x.message_id === message.message_id
					);
					if (messageIndex !== -1) {
						allMessages[messageIndex] = resp.data;
						this.setState({ messages: allMessages });
					}
					return;
				});
			}

			messageData = {
				message: this.state.message || '',
				message_image: this.state.uploadedImageUrl || '',
				from_id: loggedInUser.toString() || '',
				to_id: this.props.match.params.messageId || '',
			};
			// this.props.postMessage(this.props.token, this.props.match.params.messageId, messageData);
			const messages = [...this.state.messages];
			const message = {
				_id: uuidv4(),
				message_text: messageData.message,
				from_id: messageData.from_id,
				to_id: messageData.to_id,
				message_status: 'pending',
				created_date: new Date(),
				message_id: uuidv4(),
				liked_by: [],
				from_user: {
					first_name: loggedInUser.first_name,
					last_name: loggedInUser.last_name,
					user_name: '',
					profile_image_url: loggedInUser.profile_image_url,
				},
				from: 'me',
				like_count: 0,
				liked: false,
				blocked_by_me: false,
			};
			messages.push(message);
			this.setState({ message: '', uploadedImageUrl: null, messages });
			socket.emit('message', messageData, (err, data) => {
				if (err) {
					console.log('message send error: ', err);
				}
				console.log('message data: ', data);
				console.log('message sent: ', data.message);
				const allMessages = [...this.state.messages];
				const messageIndex = allMessages.findIndex(
					(x) => x.message_id === message.message_id
				);
				if (messageIndex !== -1) {
					allMessages[messageIndex] = data.message;
					this.setState({ messages: allMessages });
				}
			});
		}
	};

	scrollToBottom() {
		// this.el.scrollIntoView({behavior: 'smooth', block: "nearest"});
		$('#msg-detail').scrollTop($('#msg-detail')[0].scrollHeight);
		if (this._ismounted) {
			socket.emit('messageRead', {
				from_id: loggedInUser,
				to_id: this.props.match.params.messageId,
			});
			socket.emit('getnotificationcounter', { user_id: loggedInUser });
		}
	}

	// function to scroll to replied message
	scrollToMessage = (messageId) => {
		let particularMessage = $(`#id${messageId}`);
		const particularMessagePosition = particularMessage.position().top;
		$('#msg-detail').animate({
			scrollTop: particularMessagePosition,
		});
		// Animate element on scroll end
		$('#msg-detail').on('scroll', () => {
			clearTimeout($.data(this, 'scrollTimer'));
			particularMessage[0].style.animation = '';

			$.data(
				this,
				'scrollTimer',
				setTimeout(() => {
					// do something
					particularMessage[0].style.animation = 'shake 1s';
				}, 250)
			);
		});
	};

	// Add emoji to message
	addEmoji = (e) => {
		let sym = e.unified.split('-');
		let codesArray = [];
		sym.forEach((el) => codesArray.push('0x' + el));
		let emojiPic = String.fromCodePoint(...codesArray);
		let newValue = this.state.message + ' ' + emojiPic;
		this.setState({ message: newValue });
	};

	showEmojiMenu = (event) => {
		event.preventDefault();

		this.setState({ emojiVisible: true }, () => {
			document.addEventListener('click', this.closeEmojiMenu);
		});
	};

	closeEmojiMenu = (e) => {
		if (
			this.state.emojiVisible &&
			this.wrapperRef &&
			!this.wrapperRef.contains(e.target)
		) {
			this.setState({ emojiVisible: false }, () => {
				document.removeEventListener('click', this.closeEmojiMenu);
			});
		}
	};

	handleFileSelect = (event) => {
		const files = event.target.files;
		if (files.length === 0) {
			return;
		}
		const _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
		let blnValid = false;
		for (const file of files) {
			const sFileName = file.name;
			if (sFileName.length > 0) {
				for (let j = 0; j < _validFileExtensions.length; j++) {
					const sCurExtension = _validFileExtensions[j];
					if (
						sFileName
							.substr(
								sFileName.length - sCurExtension.length,
								sCurExtension.length
							)
							.toLowerCase() === sCurExtension.toLowerCase()
					) {
						blnValid = true;
						break;
					}
				}
			}
		}
		if (blnValid) {
			this.setState({ files: files, isFileUploading: true });
			const config = {
				headers: {
					Authorization: 'bearer ' + this.props.token,
					'content-type': 'multipart/form-data',
				},
			};
			const formData = new FormData();
			let file = files[0];
			formData.append(`file`, file);
			axios
				.post('/messages/upload', formData, config)
				.then((response) => {
					console.log(response);
					this.setState({
						files: null,
						isFileUploading: false,
						uploadedImageUrl: `${response.data.data.path}`,
					});
					this.inputFileUpload.value = '';
				})
				.catch(() => {
					this.setState({ files: null, isFileUploading: false });
				});
		} else {
			if (!blnValid) {
				toast.error(
					'Sorry, filename is invalid, allowed extensions are: ' +
						_validFileExtensions.join(', '),
					{
						position: toast.POSITION.TOP_CENTER,
					}
				);
			}
		}
	};

	handleImageDelete = () => {
		this.setState({ uploadedImageUrl: null });
	};

	setWrapperRef = (node) => {
		this.wrapperRef = node;
	};

	handleOpenViewBox = (url) => {
		this.setState({ showViewer: true, viewerUrl: url });
	};

	handleCloseViewBox = () => {
		this.setState({ showViewer: false, viewerUrl: '' });
	};

	render() {
		const { files, uploadedImageUrl, isFileUploading, message } = this.state;

		// Conditional rendering

		// Show viewer condition
		let showViewer = null;
		if (this.state.showViewer) {
			showViewer = (
				<ProfileImageView
					closeImageBox={this.handleCloseViewBox}
					imageUrl={this.state.viewerUrl}
				/>
			);
		}

		// Reply condition
		let reply = null;
		let messages = null;
		if (this.state.reply) {
			reply = (
				<div className="row">
					<div className="col-md-12" style={{ marginBottom: '10px' }}>
						<div
							className="quoteContainer p-2"
							style={{
								background: '#5F6062',
								color: '#fff',
								display: 'flex',
								justifyContent: 'space-between',
								borderRadius: '7px',
							}}
						>
							{this.state.replyImg ? (
								<img
									src={
										'https://cdn.staging.afrocamgist.com/' + this.state.replyImg
									}
									style={{
										width: '150px',
										height: '150px',
										objectFit: 'cover',
									}}
									alt=""
								/>
							) : null}
							<p>
								<i>{this.state.replyText}</i>
							</p>
							<i
								className="fa fa-times-circle"
								style={{ margin: '10px', cursor: 'pointer' }}
								aria-hidden="true"
								onClick={this.cancelReply}
							></i>
						</div>
					</div>
				</div>
			);
		}

		if (this.state.messages === null) {
			return <HorizontalLoader />;
		}

		if (this.state.messages.length === 0) {
			messages = (
				<p className="empty-messages">
					Say hello to your friend{' '}
					<span role="img" aria-label="waving emoji">
						👋
					</span>
				</p>
			);
		}

		if (this.state.messages.length > 0) {
			// const allMessages = [ ...this.state.messages ];
			messages = this.state.messages.map((message) => {
				return (
					<div
						className={`${
							message.from === 'me'
								? 'megfromme messagepart'
								: 'megfromhim messagepart'
						}`}
						key={message._id}
					>
						{message.message_image ? (
							<div>
								{message.message_reply_id ? (
									<div
										className="replyContainer"
										onClick={() =>
											this.scrollToMessage(message.message_reply_id)
										}
										style={{
											padding: '10px',
											background: '#5F6062',
											color: '#fff',
											width: '100%',
											borderRadius: '7px',
											marginBottom: '1px',
										}}
									>
										<p style={{ fontStyle: 'italic' }}>
											{message.message_reply_text.substr(0, 150) + '...'}
										</p>
									</div>
								) : null}
								<div
									className="msgg"
									style={{
										height: '140px',
										display: 'flex',
										justifyContent: 'flex-end',
									}}
									// id={'id' + message.message_id}
								>
									{message.message_text ? (
										<div
											style={{
												flex: 1,
												overflowWrap: 'break-word',
												wordWrap: 'break-word',
												width: '50%',
											}}
										>
											{message.message_text}
										</div>
									) : null}
									<div
										className={classes.FilePreviewContainer}
										style={{ marginLeft: '10px', height: '122px', flex: 1 }}
									>
										<div className={classes.FilePreviewItem}>
											<img
												src={`${BASE_URL}${message.message_image}?width=300`}
												className={classes.FilePreviewImage}
												style={{ cursor: 'pointer' }}
												alt="preview"
												onClick={() =>
													this.handleOpenViewBox(
														`${BASE_URL}${message.message_image}?width=600`
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div>
								{message.message_reply_id ? (
									<div
										className="replyContainer"
										onClick={() =>
											this.scrollToMessage(message.message_reply_id)
										}
										style={{
											padding: '10px',
											background: '#5F6062',
											color: '#fff',
											width: '100%',
											borderRadius: '7px',
											marginBottom: '1px',
										}}
									>
										<p style={{ fontStyle: 'italic' }}>
											{message.message_reply_text.substr(0, 150) + '...'}
										</p>
									</div>
								) : null}
								<div
									className="msgg"
									style={{ overflowWrap: 'break-word', wordWrap: 'break-word' }}
									id={'id' + message.message_id}
								>
									{message.message_text}
								</div>
							</div>
						)}
						<div className="nemewhomsg" style={{ marginRight: 'unset' }}>
							{message.from_user.first_name}
							<small>{moment(message.created_date).calendar()}</small>
							<i
								className="fa fa-heart"
								id="loveIcon"
								aria-hidden="true"
								onClick={() => this.onLike(message.message_id)}
								style={{
									color: message.like_count > 0 ? '#ff0000' : '#ccc',
									fontSize: '24px',
								}}
							></i>
							<i
								className="fa fa-reply"
								id="replyIcon"
								aria-hidden="true"
								onClick={() =>
									this.replyMessageHandler(
										message.message_id,
										message.message_text
									)
								}
							></i>
							{message.from === 'me' ? (
								<i
									className="fa fa-pencil"
									id="editIcon"
									aria-hidden="true"
									onClick={() =>
										this.editMessageHandler(
											message.message_id,
											message.message_text
										)
									}
								></i>
							) : null}
							{message.from === 'me' ? (
								<i
									className="fa fa-trash"
									id="deleteIcon"
									aria-hidden="true"
									onClick={() => this.deleteMessageHandler(message.message_id)}
								></i>
							) : null}
							{message.from === 'me' && message.message_status === 'pending' ? (
								<i
									className="fa fa-clock-o"
									aria-hidden="true"
									style={{ color: '#909090' }}
								></i>
							) : message.from === 'me' ? (
								<i
									className="fa fa-check"
									style={{
										color:
											message.message_status === 'read' ? '#007bff' : '#909090',
									}}
								/>
							) : null}
						</div>
						<div
							ref={(el) => {
								this.el = el;
							}}
						/>
					</div>
				);
			});
		}

		return (
			<UserLayout>
				<div className="midleconarea">
					{showViewer}
					<div className="awhitebg">
						<div className="detailsofmessage" id="msg-detail">
							{messages}
							{files !== null || uploadedImageUrl !== null ? (
								<div className={classes.FilePreviewContainer}>
									<div className={classes.FilePreviewItem}>
										{!isFileUploading ? (
											<i
												className={`fa fa-times-circle-o ${classes.FilePreviewClose}`}
												aria-hidden="true"
												onClick={this.handleImageDelete}
											/>
										) : null}
										{isFileUploading && <div className={classes.FileLoading} />}
										{files && isFileUploading && !uploadedImageUrl ? (
											<ExifOrientationImg
												alt="selected"
												src={URL.createObjectURL(files[0])}
												className={`${classes.FilePreviewImage} ${classes.FilePreviewImageOpacity}`}
											/>
										) : (
											<img
												src={`${BASE_URL}${uploadedImageUrl}?width=300`}
												className={`${classes.FilePreviewImage}`}
												alt="preview"
											/>
										)}
									</div>
									<div
										ref={(el) => {
											this.el = el;
										}}
										style={{ height: '100px' }}
									/>
								</div>
							) : null}
						</div>
						<div className="msgfrmarea mobilechat">
							{reply}
							<div className="row">
								<div className="col-10 norightpadd">
									<textarea
										className="form-control"
										id="inputMessage"
										placeholder="Type here ..."
										value={this.state.message}
										onKeyPress={this.onSendByKeyPress}
										onChange={this.onInputChange}
										height="37px"
									></textarea>
									{/* <input
                    type="text"
                    id="inputMessage"
                    className="form-control"
                    placeholder="Type here ..."
                    value={this.state.message}
                    onKeyPress={this.onSendByKeyPress}
                    onChange={this.onInputChange}
                    onFocus={this.onInputFocus}
                    autoComplete="off"
                  /> */}
								</div>
								<div className="col noleftpadd">
									<div
										className="iconsymbol"
										style={styles.chatIconContainerImage}
									>
										<input
											style={{ display: 'none' }}
											type="file"
											accept="image/*"
											ref={(input) => (this.inputFileUpload = input)}
											onChange={(e) => this.handleFileSelect(e)}
										/>
										<i
											className="fa fa-picture-o"
											onClick={() =>
												!isFileUploading && this.inputFileUpload.click()
											}
											style={{
												fontSize: '20px',
												color: isFileUploading ? '#aaa' : null,
												cursor: 'pointer',
											}}
										/>
									</div>
									<div className="iconsymbol" style={styles.chatIconContainer}>
										<i
											className="fa fa-smile-o"
											onClick={this.showEmojiMenu}
											style={{ fontSize: '20px' }}
										/>
									</div>
									<button
										type="submit"
										id="submitBtn"
										className="btn btn-primary"
										onClick={this.onSend}
										disabled={!message && !uploadedImageUrl}
									>
										<i className="fa fa-paper-plane" />
									</button>
								</div>
							</div>
						</div>
					</div>
					<div ref={this.setWrapperRef}>
						{this.state.emojiVisible ? (
							<Picker
								emoji=""
								showPreview={false}
								onSelect={this.addEmoji}
								style={styles.emojiMart}
							/>
						) : null}
					</div>
				</div>
			</UserLayout>
		);
	}
}

const styles = {
	chatIconContainer: {
		position: 'absolute',
		left: '-28px',
		top: '8px',
		color: '#0062cc',
	},
	chatIconContainerImage: {
		position: 'absolute',
		left: '-57px',
		top: '8px',
		color: '#0062cc',
	},
	emojiMart: {
		width: '100%',
		position: 'absolute',
		bottom: '0px',
	},
};

const mapStateToProps = (state) => {
	return {
		messageDetail: state.message.detail,
		token: state.auth.token,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		fetchDetail: (token, id) => dispatch(fetchMessageDetail(token, id)),
		postMessage: (token, id, data) =>
			dispatch(postMessageDetail(token, id, data)),
		likeMessage: (token, messageData) =>
			dispatch(likeMessageDetail(token, messageData)),
		deleteMessageDetail: (token, messageId) =>
			dispatch(deleteMessageDetail(token, messageId)),
	};
};

export default withErrorHandler(
	connect(mapStateToProps, mapDispatchToProps)(MessageDetail),
	axios
);
