import axios from 'axios';

export const FETCH_COMPANIES = '[PROJECT DASHBOARD APP] FETCH FILTER COMPANIES';
export const FETCH_COMPANY_PLAYER_LIST = '[PROJECT DASHBOARD APP] FETCH COMPANY PLAYERS LIST';

export const DEFAULT_FILTER_VALUES = {
    overAll: 'overAll',
}

export function getFilterCompaniesList() {
    const request = axios.get('/bettingCompany/all');

    return dispatch =>
        request.then(response => {
            const data = [{ name: 'Over All', _id: DEFAULT_FILTER_VALUES.overAll }];
            const _data = data.concat(response.data.data);
            dispatch({
                type: FETCH_COMPANIES,
                payload: _data
            })
        }
        );
}

export function getBettingCompanyPlayers(bettingCompanyId) {
    const request = axios.get(`/getPlayers?bettingCompanyId=${bettingCompanyId}`)

    return dispatch => 
        request.then(response => {
            const data = [{ name: 'Over All', _id: DEFAULT_FILTER_VALUES.overAll }];
            const _data = data.concat(response.data.data || []);
            return dispatch({
                type: FETCH_COMPANY_PLAYER_LIST,
                payload: _data
            })
        })
}