/* @flow */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Audio } from '../../base/media';
import { Avatar } from '../../base/participants';
import { Container, Text } from '../../base/react';
import UIEvents from '../../../../service/UI/UIEvents';

declare var $: Object;
declare var APP: Object;
declare var interfaceConfig: Object;

/**
 * Implements a React {@link Component} which depicts the establishment of a
 * call with a specific remote callee.
 *
 * @extends Component
 */
class CallOverlay extends Component {
    /**
     * The (reference to the) {@link Audio} which plays/renders the audio
     * depicting the ringing phase of the call establishment represented by this
     * {@code CallOverlay}.
     */
    _audio: ?Audio

    _onLargeVideoAvatarVisible: Function

    _playAudioInterval: ?number

    _ringingTimeout: ?number

    _setAudio: Function

    state: {

        /**
         * The CSS class (name), if any, to add to this {@code CallOverlay}.
         *
         * @type {string}
         */
        className: ?string,

        /**
         * The indicator which determines whether this {@code CallOverlay}
         * should play/render audio to indicate the ringing phase of the
         * call establishment between the local participant and the
         * associated remote callee.
         *
         * @type {boolean}
         */
        renderAudio: boolean,

        /**
         * The indicator which determines whether this {@code CallOverlay}
         * is depicting the ringing phase of the call establishment between
         * the local participant and the associated remote callee or the
         * phase afterwards when the callee has not answered the call for a
         * period of time and, consequently, is considered unavailable.
         *
         * @type {boolean}
         */
        ringing: boolean
    }

    /**
     * {@code CallOverlay} component's property types.
     *
     * @static
     */
    static propTypes = {
        _callee: React.PropTypes.object
    };

    /**
     * Initializes a new {@code CallOverlay} instance.
     *
     * @param {Object} props - The read-only React {@link Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this.state = {
            className: undefined,
            renderAudio:
                typeof interfaceConfig !== 'object'
                    || !interfaceConfig.DISABLE_RINGING,
            ringing: true
        };

        this._onLargeVideoAvatarVisible
            = this._onLargeVideoAvatarVisible.bind(this);
        this._setAudio = this._setAudio.bind(this);

        if (typeof APP === 'object') {
            APP.UI.addListener(
                UIEvents.LARGE_VIDEO_AVATAR_VISIBLE,
                this._onLargeVideoAvatarVisible);
        }
    }

    /**
     * Sets up timeouts such as the timeout to end the ringing phase of the call
     * establishment depicted by this {@code CallOverlay}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        // Set up the timeout to end the ringing phase of the call establishment
        // depicted by this CallOverlay.
        if (this.state.ringing && !this._ringingTimeout) {
            this._ringingTimeout
                = setTimeout(
                    () => {
                        this._pauseAudio();

                        this._ringingTimeout = undefined;
                        this.setState({
                            ringing: false
                        });
                    },
                    30000);
        }

        this._playAudio();
    }

    /**
     * Cleans up before this {@code Calleverlay} is unmounted and destroyed.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._pauseAudio();

        if (this._ringingTimeout) {
            clearTimeout(this._ringingTimeout);
            this._ringingTimeout = undefined;
        }

        if (typeof APP === 'object') {
            APP.UI.removeListener(
                UIEvents.LARGE_VIDEO_AVATAR_VISIBLE,
                this._onLargeVideoAvatarVisible);
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { className, ringing } = this.state;
        const { avatarUrl, name } = this.props._callee;

        return (
            <Container
                className = { `ringing ${className || ''}` }
                id = 'ringOverlay'>
                <Container className = 'ringing__content'>
                    { ringing ? <Text>Calling...</Text> : null }
                    <Avatar
                        className = 'ringing__avatar'
                        uri = { avatarUrl } />
                    <Container className = 'ringing__caller-info'>
                        <Text>
                            { name }
                            { ringing ? null : ' isn\'t available' }
                        </Text>
                    </Container>
                </Container>
                { this._renderAudio() }
            </Container>
        );
    }

    /**
     * Notifies this {@code CallOverlay} that the visibility of the
     * participant's avatar in the large video has changed.
     *
     * @param {boolean} largeVideoAvatarVisible - If the avatar in the large
     * video (i.e. of the participant on the stage) is visible, then
     * {@code true}; otherwise, {@code false}.
     * @private
     * @returns {void}
     */
    _onLargeVideoAvatarVisible(largeVideoAvatarVisible: boolean) {
        this.setState({
            className: largeVideoAvatarVisible ? 'solidBG' : undefined
        });
    }

    /**
     * Stops the playback of the audio which represents the ringing phase of the
     * call establishment depicted by this {@code CallOverlay}.
     *
     * @private
     * @returns {void}
     */
    _pauseAudio() {
        const audio = this._audio;

        if (audio) {
            audio.pause();
        }
        if (this._playAudioInterval) {
            clearInterval(this._playAudioInterval);
            this._playAudioInterval = undefined;
        }
    }

    /**
     * Starts the playback of the audio which represents the ringing phase of
     * the call establishment depicted by this {@code CallOverlay}.
     *
     * @private
     * @returns {void}
     */
    _playAudio() {
        if (this._audio) {
            this._audio.play();
            if (!this._playAudioInterval) {
                this._playAudioInterval
                    = setInterval(() => this._playAudio(), 5000);
            }
        }
    }

    /**
     * Renders an audio element to represent the ringing phase of the call
     * establishment represented by this {@code CallOverlay}.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderAudio() {
        if (this.state.renderAudio && this.state.ringing) {
            return (
                <Audio
                    ref = { this._setAudio }
                    src = './sounds/ring.ogg' />
            );
        }

        return null;
    }

    /**
     * Sets the (reference to the) {@link Audio} which renders the ringing phase
     * of the call establishment represented by this {@code CallOverlay}.
     *
     * @param {Audio} audio - The (reference to the) {@code Audio} which
     * plays/renders the audio depicting the ringing phase of the call
     * establishment represented by this {@code CallOverlay}.
     * @private
     * @returns {void}
     */
    _setAudio(audio) {
        this._audio = audio;
    }
}

/**
 * Maps (parts of) the redux state to {@code CallOverlay}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _callee: Object
 * }}
 */
function _mapStateToProps(state) {
    return {
        /**
         *
         * @private
         * @type {Object}
         */
        _callee: state['features/jwt'].callee
    };
}

export default connect(_mapStateToProps)(CallOverlay);