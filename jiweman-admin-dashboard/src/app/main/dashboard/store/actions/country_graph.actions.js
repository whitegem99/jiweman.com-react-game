import axios from 'axios';
import moment from 'moment';
import store from '../../../../store';
import { authRoles } from '../../../../auth';

export const UPDATE_COUNTRY_DATE = '[PROJECT DASHBOARD APP] UPDATE COUNTRY DATES';
export const COUNTRY_GRAPH_SUCCESS = '[PROJECT DASHBOARD APP] COUNTRY GRAPH SUCCESS';

export const DefaultParams = {
    startDate: moment().subtract(5, 'month').utc().format(),
    endDate: moment().utc().format(),
    type: 'betting',
    bettingCompanyId: ''
}

export function updateCountryGraphDate(payload) {
    return dispatch =>
        dispatch({
            type: UPDATE_COUNTRY_DATE,
            payload
        })
}

export function getCountryGraphData(payload) {
    const { user: { data: { bettingCompanyId: userBettingCompanyId = '', isSuperAdmin = false } = {}, role = [] } = {} } = store.getState().auth || {};
    
    const { startDate = '', endDate = '', bettingCompanyId = '', type = '' } = payload || {};

    let _bettingCompanyId = (isSuperAdmin && bettingCompanyId && bettingCompanyId === 'overAll') ? '' : (!isSuperAdmin && role[0]?.toLocaleLowerCase() === authRoles.admin[0]) ? userBettingCompanyId : bettingCompanyId;

	const request = axios.get(`/analytics/getCountryData?firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${type || DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId}`);

    return dispatch => {
        return request.then(response => {
            dispatch(updateCountryGraphDate(payload || DefaultParams))
            return dispatch({
                type: COUNTRY_GRAPH_SUCCESS,
                payload: response.data.data
            })
        }
        );
    }
}