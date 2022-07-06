import axios from 'axios';
import moment from 'moment';
import store from '../../../../store';
import { authRoles } from '../../../../auth';

export const UPDATE_GENDER_DATE = '[PROJECT DASHBOARD APP] UPDATE GENDER DATES';
export const GENDER_GRAPH_SUCCESS = '[PROJECT DASHBOARD APP] GENDER GRAPH SUCCESS';

export const DefaultParams = {
    startDate: moment().subtract(5, 'month').endOf('month').utc().format(),
    endDate: moment().endOf('month').utc().format(),
    type: 'betting',
    bettingCompanyId: ''
}

export function updateGenderGraphDate(payload) {
    return dispatch =>
        dispatch({
            type: UPDATE_GENDER_DATE,
            payload
        })
}

export function getGenderGraphData(payload) {
    const { user: { data: { bettingCompanyId: userBettingCompanyId = '', isSuperAdmin = false } = {}, role = [] } = {} } = store.getState().auth || {};
    
    const { startDate = '', endDate = '', bettingCompanyId = '', type = '' } = payload || {};

    let _bettingCompanyId = (isSuperAdmin && bettingCompanyId && bettingCompanyId === 'overAll') ? '' : (!isSuperAdmin && role[0]?.toLocaleLowerCase() === authRoles.admin[0]) ? userBettingCompanyId : bettingCompanyId;

	const request = axios.get(`/analytics/getGenderData?firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${type || DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId}`);

    return dispatch => {
        return request.then(response => {
            dispatch(updateGenderGraphDate(payload || DefaultParams))
            return dispatch({
                type: GENDER_GRAPH_SUCCESS,
                payload: response.data.data
            })
        }
        );
    }
}