import {
    SET_FILMSTRIP_REMOTE_VIDEOS_COUNT,
    SET_FILMSTRIP_REMOTE_VIDEOS_VISIBLITY,
    SET_FILMSTRIP_VISIBILITY
} from './actionTypes';

/**
 * Sets the visibility of remote videos in the filmstrip.
 *
 * @param {boolean} remoteVideosVisible - Whether or not remote videos in the
 * filmstrip should be visible.
 * @returns {{
 *     type: SET_FILMSTRIP_REMOTE_VIDEOS_VISIBLITY,
 *     remoteVideosVisible: boolean
 * }}
 */
export function setFilmstripRemoteVideosVisibility(remoteVideosVisible) {
    return {
        type: SET_FILMSTRIP_REMOTE_VIDEOS_VISIBLITY,
        remoteVideosVisible
    };
}

/**
 * Sets how many remote videos are currently in the filmstrip.
 *
 * @param {number} remoteVideosCount - The number of remote videos.
 * @returns {{
 *     type: SET_FILMSTRIP_REMOTE_VIDEOS_COUNT,
 *     remoteVideosCount: number
 * }}
 */
export function setFilmstripRemoteVideosCount(remoteVideosCount) {
    return {
        type: SET_FILMSTRIP_REMOTE_VIDEOS_COUNT,
        remoteVideosCount
    };
}

/**
 * Sets if the entire filmstrip should be visible.
 *
 * @param {boolean} visible - Whether not the filmstrip is visible.
 * @returns {{
 *     type: SET_FILMSTRIP_VISIBILITY,
 *     visible: boolean
 * }}
 */
export function setFilmstripVisibility(visible) {
    return {
        type: SET_FILMSTRIP_VISIBILITY,
        visible
    };
}
