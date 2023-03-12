import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import VisibilitySensor from 'react-visibility-sensor';

class CustomReactPlayer extends Component {
	state = {
		playing: false,
		isTouched: false,
		isPaused: false,
		isPausedByScroll: false,
	};

	onChange = (isVisible) => {
		/*if (!isVisible && this.state.playing) {
      this.setState({isPausedByScroll: true, playing: false});
    }
    if (isVisible && this.state.isTouched && !this.state.isPaused) {
      this.setState({playing: true});
    }
    if (isVisible && this.state.isTouched && this.state.isPausedByScroll) {
      this.setState({playing: true, isPausedByScroll: false});
    }*/
		if (isVisible && !this.state.isTouched) {
			this.playerRef = (e) => {
				if (e) {
					e.handleClickPreview();
					// this.setState({playing: true, isTouched: true});
					this.setState({ playing: true, isTouched: true }, () => {
						if (this.props.handleViewPost) {
							this.props.handleViewPost(this.props.postId);
						}
					});
				}
			};
		}
		if (!isVisible && this.state.playing) {
			this.setState({ isPausedByScroll: true, playing: false });
		}
		if (isVisible && !this.state.isPaused) {
			this.setState({ playing: true });
		}
		if (isVisible && this.state.isPausedByScroll) {
			this.setState({ playing: true, isPausedByScroll: false });
		}
	};

	handleStart = () => {
		//this.setState({playing: true, isTouched: true});
		this.setState({ playing: true });
	};

	render() {
		return (
			<VisibilitySensor onChange={this.onChange}>
				<ReactPlayer
					url={this.props.url}
					controls={!!this.props.controls}
					style={this.props.style}
					width={this.props.width || '100%'}
					height={this.props.height || '192px'}
					playing={this.state.playing}
					light={
						typeof this.props.light === 'string' && this.props.light !== ''
							? this.props.light
							: false
					}
					onStart={this.handleStart}
					onPlay={() => this.setState({ playing: true, isPaused: false })}
					onPause={() => this.setState({ playing: false, isPaused: true })}
					onEnded={() => this.setState({ playing: false })}
					volume={1}
					muted={true}
					ref={this.playerRef}
				/>
			</VisibilitySensor>
		);
	}
}

export default CustomReactPlayer;
