import React, { PureComponent, Fragment } from 'react';
import { Picker } from 'emoji-mart';
import ExifOrientationImg from 'react-exif-orientation-img';
import { toast } from 'react-toastify';

import Input from '../../components/Input/Input';
import ReactPlayer from 'react-player';
import './Picker.css';
import axios from '../../utils/axiosConfig';
import { BASE_URL } from '../../constants/ImageUrls';
import sanitizeHtml from 'sanitize-html';

class NewPostArea extends PureComponent {
	constructor(props) {
		super(props);

		const textData = this.setHeadingText(
			this.props.pageName,
			this.props.hashDetails
		);

		this.mounted = true;

		this.state = {
			postMode: 'text',
			postModeImageVideo: false,
			emojiVisible: false,
			controls: {
				post_text: {
					elementType: 'hashtag',
					elementConfig: {
						placeholder: textData.placeHolder,
						asyncData: this.handleHashSuggestions,
					},
					value: textData.value || '',
					validation: {},
					valid: false,
					touched: false,
					onlyClassName: 'new-post-textarea',
					onlyOuterClassName: 'new-post-textarea-wrapper',
				},
			},
			showViewer: false,
			headingText: textData.headingText,
			areaFocused: false,
			postLocation: '',
		};
	}

	static getDerivedStateFromProps(props, state) {
		if (
			props.image.file &&
			props.image.file.length > 0 &&
			!state.postModeImageVideo
		) {
			return {
				...state,
				postModeImageVideo: true,
			};
		}
		if (
			!props.image.file ||
			(props.image.file.length === 0 && state.postModeImageVideo)
		) {
			return {
				...state,
				postMode: 'text',
				postModeImageVideo: false,
			};
		}
		return null;
	}

	componentDidMount() {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};

		const success = (pos) => {
			const crd = pos.coords;

			/*console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);*/
			if (this.mounted) {
				this.setState({ postLocation: `${crd.latitude},${crd.longitude}` });
			}
		};

		const error = () => {
			//console.warn(`ERROR(${err.code}): ${err.message}`);
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	setHeadingText = (pageName, details) => {
		const result = {};

		switch (pageName) {
			case 'swagger': {
				result.headingText = 'Ginger the Swagger';
				result.placeHolder = 'Swagger Me The Ginger';
				break;
			}
			case 'talent': {
				result.headingText = 'Talent Page';
				result.placeHolder = 'Show the world your talent';
				break;
			}
			case 'hashtag': {
				result.headingText = `Post for #${details}`;
				result.placeHolder = 'Write Something...';
				break;
			}
			default: {
				result.headingText = 'Gist us';
				result.placeHolder = 'Write Something...';
			}
		}
		return result;
	};

	handleHashSuggestions = (query, callback) => {
		const config = {
			headers: { Authorization: 'bearer ' + this.props.token },
		};

		axios.get(`/hashtags?page=1&search=${query}`, config).then((res) => {
			const newData = res.data.data.slice(0, 5);
			callback(
				newData.map((hashtag) => ({
					id: hashtag.hashtag_id,
					display: hashtag.hashtag_slug,
				}))
			);
		});
	};

	/*handleModeChange = (event) => {
    this.setState({postMode: event.target.value});
    this.props.onModeChange();
  };*/

	checkValidity = (value, rules) => {
		let isValid = true;
		if (!rules) {
			return true;
		}

		if (rules.required) {
			isValid = value.trim() !== '' && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		if (rules.isEmail) {
			const pattern =
				/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			isValid = pattern.test(value) && isValid;
		}

		if (rules.isNumeric) {
			const pattern = /^\d+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	};

	inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: event.target.value,
				valid: this.checkValidity(
					event.target.value,
					this.state.controls[controlName].validation
				),
				touched: true,
			},
		};
		this.setState({ controls: updatedControls });
	};

	submitHandler = (event) => {
		event.preventDefault();
		if (this.props.pageName === 'hashtag') {
			this.props.onNewPostSubmit(
				{
					post_text: sanitizeHtml(
						`${this.state.controls.post_text.value}  #${this.props.hashDetails}`,
						{ allowedTags: [], allowedAttributes: {} }
					),
					post_lat_long: this.state.postLocation,
				},
				this.state.postMode
			);
		} else {
			this.props.onNewPostSubmit(
				{
					post_text: sanitizeHtml(this.state.controls.post_text.value, {
						allowedTags: [],
						allowedAttributes: {},
					}),
					post_lat_long: this.state.postLocation,
				},
				this.state.postMode
			);
		}
		const textData = this.setHeadingText(
			this.props.pageName,
			this.props.hashDetails
		);
		this.setState({
			postMode: 'text',
			postModeImageVideo: false,
			emojiVisible: false,
			controls: {
				post_text: {
					elementType: 'hashtag',
					elementConfig: {
						placeholder: textData.placeHolder,
						asyncData: this.handleHashSuggestions,
					},
					value: '',
					validation: {},
					valid: false,
					touched: false,
					onlyClassName: 'new-post-textarea',
					onlyOuterClassName: 'new-post-textarea-wrapper',
				},
			},
			showViewer: false,
			headingText: textData.headingText,
		});
	};

	onInitialChange = (e) => {
		const _validFileExtensionsImage = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
		const _validFileExtensionsVideo = [
			'.mp4',
			'.m4a',
			'.m4b',
			'.m4v',
			'.webm',
			'.ogg',
			'.wav',
			'.avi',
			'.flv',
			'.3gp',
			'.mov',
			'.wmv',
		];
		const files = Array.from(e.target.files);
		if (files.length !== 0) {
			let blnType = 'text';
			for (const file of files) {
				const oInput = file;
				const sFileName = oInput.name;
				if (sFileName.length > 0) {
					for (let j = 0; j < _validFileExtensionsImage.length; j++) {
						const sCurExtension = _validFileExtensionsImage[j];
						if (
							sFileName
								.substr(
									sFileName.length - sCurExtension.length,
									sCurExtension.length
								)
								.toLowerCase() === sCurExtension.toLowerCase()
						) {
							blnType = 'image';
							break;
						}
					}

					for (let j = 0; j < _validFileExtensionsVideo.length; j++) {
						const sCurExtension = _validFileExtensionsVideo[j];
						if (
							sFileName
								.substr(
									sFileName.length - sCurExtension.length,
									sCurExtension.length
								)
								.toLowerCase() === sCurExtension.toLowerCase()
						) {
							blnType = blnType === 'image' ? 'both' : 'video';
							break;
						}
					}
					if (blnType === 'text') {
						toast.error(
							'Sorry, ' +
								sFileName +
								' is invalid, allowed extensions are: ' +
								_validFileExtensionsImage.join(', ') +
								_validFileExtensionsVideo.join(', '),
							{
								position: toast.POSITION.TOP_CENTER,
							}
						);
						oInput.value = '';
						this.props.onModeChange();
						break;
					}
					if (blnType === 'both') {
						toast.error('Sorry, please select either video or image', {
							position: toast.POSITION.TOP_CENTER,
						});
						oInput.value = '';
						this.props.onModeChange();
						break;
					}
				}
			}

			if (blnType === 'image') {
				this.setState({ postMode: 'image' });
				this.props.onImageSubmit(files);
			}
			if (blnType === 'video') {
				if (files.length > 1) {
					toast.error('Sorry, multiple videos are not allowed', {
						position: toast.POSITION.TOP_CENTER,
					});
					this.props.onModeChange();
				} else {
					this.setState({ postMode: 'video' });
					this.props.onImageSubmit(files, true);
				}
			}
		}
		e.target.value = null;
	};

	onChange = (e) => {
		const _validFileExtensions = ['.jpg', '.jpeg', '.bmp', '.gif', '.png'];
		const files = Array.from(e.target.files);
		if (files.length !== 0) {
			let blnValid = false;
			for (const file of files) {
				const oInput = file;
				const sFileName = oInput.name;
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

					if (!blnValid) {
						toast.error(
							'Sorry, ' +
								sFileName +
								' is invalid, allowed extensions are: ' +
								_validFileExtensions.join(', '),
							{
								position: toast.POSITION.TOP_CENTER,
							}
						);
						oInput.value = '';
						break;
					}
				}
			}
			if (blnValid) {
				this.props.onImageSubmit(files);
			}
		}
		e.target.value = null;
	};

	onVideoChange = (e) => {
		const _validFileExtensions = [
			'.mp4',
			'.m4a',
			'.m4b',
			'.m4v',
			'.webm',
			'.ogg',
			'.wav',
			'.avi',
			'.flv',
			'.3gp',
			'.mov',
			'.wmv',
		];
		const files = Array.from(e.target.files);
		if (files.length !== 0) {
			const oInput = files[0];
			const sFileName = oInput.name;
			if (sFileName.length > 0) {
				let blnValid = false;
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

				if (!blnValid) {
					toast.error(
						'Sorry, ' +
							sFileName +
							' is invalid, allowed extensions are: ' +
							_validFileExtensions.join(', '),
						{
							position: toast.POSITION.TOP_CENTER,
						}
					);
					oInput.value = '';
					return false;
				} else {
					this.props.onImageSubmit(files, true);
				}
			}
		}
		e.target.value = null;
	};

	addEmoji = (e) => {
		let sym = e.unified.split('-');
		let codesArray = [];
		sym.forEach((el) => codesArray.push('0x' + el));
		let emojiPic = String.fromCodePoint(...codesArray);
		let newValue = this.state.controls.post_text.value + ' ' + emojiPic;
		this.setState((prevState) => ({
			controls: {
				...prevState.controls,
				post_text: {
					...prevState.controls.post_text,
					value: newValue,
				},
			},
		}));
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

	handleTextAreaFocus = () => {
		this.setState({ areaFocused: true });
		window.scrollTo({
			left: 0,
			top: this.newPostBox.getBoundingClientRect().top - 110,
			behavior: 'smooth',
		});
	};

	handleTextAreaBlur = () => {
		this.setState({ areaFocused: false });
	};

	setWrapperRef = (node) => {
		this.wrapperRef = node;
	};

	render() {
		const { controls, headingText } = this.state;

		let parentClasses = 'insiderarea marbtm20';
		if (this.state.areaFocused) {
			parentClasses = 'insiderarea marbtm20 new-postbox';
		}

		let postButton = (
			<input type="submit" value="Post" className="subpostbtn" />
		);

		if (!this.props.isLoading) {
			postButton = <input type="submit" value="Post" className="subpostbtn" />;
		}

		if (this.props.isLoading) {
			postButton = (
				<button className="subpostbtn" disabled>
					Post
				</button>
			);
		}

		if (
			this.state.postMode === 'text' &&
			this.state.controls.post_text.value === ''
		) {
			postButton = (
				<button className="subpostbtn" disabled>
					Post
				</button>
			);
		}

		if (
			this.state.postMode === 'image' &&
			(this.props.image.file === null || this.props.image.path === '')
		) {
			postButton = (
				<button className="subpostbtn" disabled>
					Post
				</button>
			);
		}

		if (
			this.state.postMode === 'video' &&
			(this.props.image.file === null || this.props.image.path === '')
		) {
			postButton = (
				<button className="subpostbtn" disabled>
					Post
				</button>
			);
		}

		let mediaUpload = (
			<div>
				<p className="uploadbtnheader">Upload Image/Video :</p>
				<input
					type="file"
					className="uploadbttn"
					onChange={this.onInitialChange}
					multiple
					accept="image/*,video/mp4,video/x-m4v,video/3gpp,video/x-flv,video/x-m4v,video/*"
					id="uploadcreatepost"
					disabled={
						this.props.image.file && this.props.image.file.length === 4
							? 'disabled'
							: ''
					}
				/>
				<label htmlFor="uploadcreatepost" className="uploadinstyle">
					<i className="fa fa-image" />
					Upload..
				</label>
			</div>
		);

		if (this.state.postMode === 'image') {
			mediaUpload = (
				<div>
					{/*<span className="image-upload-text">Select multiple image to upload multiple (Ctrl + select)</span>*/}
					<p className="uploadbtnheader">Upload Image :</p>
					<input
						type="file"
						className="uploadbttn"
						onChange={this.onChange}
						multiple
						accept="image/*"
						id="uploadcreatepost"
						disabled={
							this.props.image.file && this.props.image.file.length === 4
								? 'disabled'
								: ''
						}
					/>
					<label htmlFor="uploadcreatepost" className="uploadinstyle">
						<i className="fa fa-image" />
						Upload..
					</label>
				</div>
			);
		}

		if (this.state.postMode === 'video') {
			mediaUpload = (
				<div>
					<p className="uploadbtnheader">Upload Video :</p>
					<input
						type="file"
						className="uploadbttn"
						onChange={this.onVideoChange}
						id="uploadcreatepostvideo"
						accept="video/mp4,video/x-m4v,video/3gpp,video/x-flv,video/x-m4v,video/*"
					/>
					<label htmlFor="uploadcreatepostvideo" className="uploadinstyle">
						<i className="fa fa-file-video-o" />
						Upload..
					</label>
				</div>
			);
		}

		return (
			<Fragment>
				<div
					className={parentClasses}
					ref={(postBox) => (this.newPostBox = postBox)}
				>
					<div className="postboxarea">
						<h3>
							<i className="fa fa-pencil" />
							{headingText}
						</h3>
						<form onSubmit={this.submitHandler}>
							<div className="roww">
								<div className="dpimhgar">
									<img
										src={`${BASE_URL}${this.props.user.profile_image_url}?width=300`}
										alt="user"
										className="img-responsive userimggg mobprifgt"
										onClick={() => this.setState({ showViewer: true })}
									/>
								</div>
								<div
									className="restogtheplace"
									id="ondefaultshow"
									onClick={this.handleTextAreaFocus}
								>
									<div className="inhideboxo">Swagger Me The Ginger ..</div>
									<div className="inbuttonboxo">
										<i className="fa fa-file-image-o" />
									</div>
								</div>
								<div className="restogtheplace" id="myptarea">
									<Input
										elementType={controls.post_text.elementType}
										elementConfig={controls.post_text.elementConfig}
										value={controls.post_text.value}
										invalid={!controls.post_text.valid}
										shouldValidate={controls.post_text.validation}
										touched={controls.post_text.touched}
										onlyClassName={controls.post_text.onlyClassName}
										onlyOuterClassName={controls.post_text.onlyOuterClassName}
										changed={(event) =>
											this.inputChangedHandler(event, 'post_text')
										}
									/>
									<div className="clearfix"></div>
									<div className="upimgvidplc">
										<div className="leftoptions">
											{this.props.pageName === 'hashtag' ? (
												<div className="row">
													<div className="col-sm-2" />
													<div className="col-sm-10 hash-detail">
														<span className="hashnamedetail">
															#{this.props.hashDetails}
														</span>
													</div>
												</div>
											) : null}
											<input
												type="radio"
												value="text"
												id="iftext"
												readOnly
												checked={
													this.state.postMode === 'text' ||
													((this.state.postMode === 'image' ||
														this.state.postMode === 'video') &&
														this.state.controls.post_text.value !== '')
												}
											/>
											<label
												htmlFor="iftext"
												className="checkdesignn"
												style={{ display: 'none' }}
											>
												<i className="fa fa-align-left" />
												Text
											</label>
											<input
												type="radio"
												value="image"
												id="ifimage"
												readOnly
												checked={this.state.postMode === 'image'}
											/>
											<label htmlFor="ifimage" className="checkdesignn">
												<i className="fa fa-picture-o" />
												Image
											</label>
											<input
												type="radio"
												value="video"
												id="ifvideo"
												readOnly
												checked={this.state.postMode === 'video'}
											/>
											<label htmlFor="ifvideo" className="checkdesignn">
												<i className="fa fa-file-video-o" />
												Video
											</label>
											{this.props.isLoading ? (
												<div style={{ display: 'inline-block', width: '60px' }}>
													<div className="progress" style={{ height: '7px' }}>
														<div
															className="progress-bar progress-bar-striped progress-bar-animated"
															style={{
																width: `${this.props.image.uploadProgress}%`,
																backgroundColor: '#ff7400',
															}}
														/>
													</div>
												</div>
											) : null}
											<div className="iconsymbol">
												<i
													className="fa fa-smile-o"
													onClick={this.showEmojiMenu}
												/>
											</div>
											<div className="clearfix" />
											<div className="row">
												{this.props.image.file &&
												this.state.postMode === 'image'
													? this.props.image.isLoading
														? this.props.image.file.map((image, index) => (
																<div className="col-sm-4 mb-2" key={index}>
																	<ExifOrientationImg
																		alt="selected"
																		src={URL.createObjectURL(image)}
																		className="img-responsive userimggg"
																		style={{ opacity: 0.5 }}
																	/>
																</div>
														  ))
														: this.props.image.path
														? this.props.image.file.map((image, index) => (
																<div className="col-sm-4 mb-2" key={index}>
																	<div className="image-preview">
																		<i
																			className="fa fa-times"
																			aria-hidden="true"
																			style={{ cursor: 'pointer' }}
																			onClick={() =>
																				this.props.onImagePreviewDelete(index)
																			}
																		/>
																		<ExifOrientationImg
																			alt="selected"
																			src={URL.createObjectURL(image)}
																			className="img-responsive userimggg"
																		/>
																	</div>
																</div>
														  ))
														: null
													: null}
												{this.props.image.file &&
												this.state.postMode === 'video'
													? this.props.image.path
														? this.props.image.file.map((image, index) => (
																<div className="col-sm-6 mb-2" key={index}>
																	<ReactPlayer
																		controls={false}
																		url={`${BASE_URL}${this.props.image.path[0]}`}
																		width={120}
																		height="100%"
																	/>
																</div>
														  ))
														: null
													: null}
											</div>
											{mediaUpload}
										</div>
										<div className="rightsider">{postButton}</div>
									</div>
								</div>
							</div>
						</form>
						<div ref={this.setWrapperRef}>
							{this.state.emojiVisible ? (
								<Picker
									emoji=""
									showPreview={false}
									onSelect={this.addEmoji}
									color="#ff7400"
									title=""
									set="twitter"
									emojiSize={20}
								/>
							) : null}
						</div>
					</div>
				</div>
				<div style={{ clear: 'both', display: 'block', width: '100%' }} />
			</Fragment>
		);
	}
}

export default NewPostArea;
