import React, { Component } from 'react';

import Input from '../Input/Input';
import { Picker } from 'emoji-mart';
import sanitizeHtml from 'sanitize-html';

class CommentBox extends Component {
	state = {
		emojiVisible: false,
		controls: {
			post_text: {
				elementType: 'textarea',
				elementConfig: {
					placeholder: 'Write comment....',
					rows: 1,
				},
				value: '',
				validation: {},
				valid: false,
				touched: false,
			},
		},
	};

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.value !== this.props.value) {
			this.setState((prevState) => {
				return {
					...prevState,
					controls: {
						...prevState.controls,
						post_text: {
							...prevState.controls.post_text,
							value: this.props.value,
						},
					},
				};
			});
		}
	}

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

	setWrapperRef = (node) => {
		this.wrapperRef = node;
	};

	submitHandler = (event) => {
		event.preventDefault();
		this.setState((prevState) => {
			return {
				...prevState,
				emojiVisible: false,
				controls: {
					...prevState.controls,
					post_text: {
						...prevState.controls.post_text,
						value: '',
					},
				},
			};
		});

		const newObj = {
			comment_text: sanitizeHtml(this.state.controls.post_text.value),
		};

		if (this.props.commentId) {
			newObj.comment_parent_id = this.props.commentId;
		}

		console.log('new object:', newObj);
		this.props.onNewCommentSubmit(newObj);
	};

	render() {
		const { controls } = this.state;

		return (
			<div
				className="postlikecomment commentArea"
				style={{ display: this.props.visible ? 'block' : 'none' }}
			>
				<form onSubmit={this.submitHandler} className="form-inline">
					<Input
						elementType={controls.post_text.elementType}
						elementConfig={controls.post_text.elementConfig}
						value={controls.post_text.value}
						invalid={!controls.post_text.valid}
						shouldValidate={controls.post_text.validation}
						touched={controls.post_text.touched}
						changed={(event) => this.inputChangedHandler(event, 'post_text')}
					/>
					<div
						className="iconsymbol"
						style={{ position: 'absolute', left: '440px' }}
					>
						<i className="fa fa-smile-o" onClick={this.showEmojiMenu} />
					</div>
					<div className="rightsider">
						<input type="submit" className="subpostbtn" value="Comment" />
					</div>
				</form>
				<div ref={this.setWrapperRef}>
					{this.state.emojiVisible ? (
						<Picker
							emoji=""
							showPreview={false}
							onSelect={this.addEmoji}
							emojiSize={20}
						/>
					) : null}
				</div>
			</div>
		);
	}
}

export default CommentBox;
