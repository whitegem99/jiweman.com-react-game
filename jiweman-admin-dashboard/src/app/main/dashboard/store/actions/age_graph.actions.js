import axios from 'axios';
import moment from 'moment';
import store from '../../../../store';
import { authRoles } from '../../../../auth';

export const UPDATE_AGE_DATE = '[PROJECT DASHBOARD APP] UPDATE AGE DATES';
export const AGE_GRAPH_SUCCESS = '[PROJECT DASHBOARD APP] AGE GRAPH SUCCESS';

export const DefaultParams = {
    startDate: moment().subtract(5, 'month').endOf('month').utc().format(),
    endDate: moment().endOf('month').utc().format(),
    type: 'betting',
    bettingCompanyId: ''
}

export function updateAgeGraphDate(payload) {
    return dispatch =>
        dispatch({
            type: UPDATE_AGE_DATE,
            payload
        })
}

export function getAgeGraphData(payload) {
    const { user: { data: { bettingCompanyId: userBettingCompanyId = '', isSuperAdmin = false } = {}, role = [] } = {} } = store.getState().auth || {};
    
    const { startDate = '', endDate = '', bettingCompanyId = '', type = '' } = payload || {};

    let _bettingCompanyId = (isSuperAdmin && bettingCompanyId && bettingCompanyId === 'overAll') ? '' : (!isSuperAdmin && role[0]?.toLocaleLowerCase() === authRoles.admin[0]) ? userBettingCompanyId : bettingCompanyId;

	const request = axios.get(`/analytics/getAgeData?firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${type || DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId}`);

    return dispatch => {
        return request.then(response => {
            dispatch(updateAgeGraphDate(payload || DefaultParams))
            return dispatch({
                type: AGE_GRAPH_SUCCESS,
                payload: response.data.data
            })
        }
        );
    }
}