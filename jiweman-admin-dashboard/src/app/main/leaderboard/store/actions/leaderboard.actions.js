import axios from 'axios';

export const GET_LEADERBOARD = '[PROJECT DASHBOARD APP] GET_LEADERBOARD';
export const GET_LEADERBOARD_LEAGUE = '[PROJECT DASHBOARD APP] GET_LEADERBOARD_LEAGUE';
export const RESET_LEADERBOARD = '[PROJECT DASHBOARD APP] RESET_LEADERBOARD';

export function getLeaderboard(params) {
	const request = axios.get('/leaderboard', { params });

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_LEADERBOARD,
				payload: response.data.data
			})
		).catch(response =>
			dispatch({
				type: GET_LEADERBOARD,
				payload: []
			}));
}

export function getLeagueForLeaderboard() {
	const request = axios.get('/leagueForAdmin');

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_LEADERBOARD_LEAGUE,
				payload: response.data.data
			})
		);
}

export function resetLeaderboardDate() {
	return dispatch => dispatch({
				type: RESET_LEADERBOARD,
				payload: []
			});
}