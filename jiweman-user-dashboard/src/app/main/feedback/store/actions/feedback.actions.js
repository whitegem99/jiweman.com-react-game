import axios from 'axios';

export const GET_FEEDBACKS = 'GET_FEEDBACKS';
export const OPEN_FEEDBACK_DIALOG = 'OPEN_FEEDBACK_DIALOG';
export const CLOSE_FEEDBACK_DIALOG = 'CLOSE_FEEDBACK_DIALOG';
export const TOGGLE_MESSAGE_LIST_PANEL_OPEN = 'TOGGLE_MESSAGE_LIST_PANEL_OPEN';
export const TOGGLE_MESSAGE_LIST_PANEL_CLOSE = 'TOGGLE_MESSAGE_LIST_PANEL_CLOSE';

export function getFeedbacks() {
	const request = axios.get('/feedback/');
	return dispatch =>
		request
			.then(response =>
				dispatch({
					type: GET_FEEDBACKS,
					payload: response.data.data ? response.data.data : []
				})
			)
			.catch(error =>
				dispatch({
					type: GET_FEEDBACKS,
					payload: []
				})
			);
}

export function openFeedbackDialog() {
	console.log('open');
	return {
		type: OPEN_FEEDBACK_DIALOG,
		payload: null
	};
}

export function closeFeedbackDialog() {
	return {
		type: CLOSE_FEEDBACK_DIALOG,
		payload: null
	};
}

export function toggleMessageListPanelClose() {
	return {
		type: TOGGLE_MESSAGE_LIST_PANEL_CLOSE,
		payload: null
	};
}

export function toggleMessageListPanelOpen(payload) {
	return {
		type: TOGGLE_MESSAGE_LIST_PANEL_OPEN,
		payload
	};
}
