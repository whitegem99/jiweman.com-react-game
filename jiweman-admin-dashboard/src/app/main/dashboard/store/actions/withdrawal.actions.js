import axios from 'axios';
import moment from 'moment';
import store from '../../../../store';
import { authRoles } from '../../../../auth';

export const UPDATE_WITHDRAWAL_DATE = '[PROJECT DASHBOARD APP] UPDATE WITHDRAWAL DATES';
export const WITHDRAWAL_SUCCESS = '[PROJECT DASHBOARD APP] WITHDRAWAL SUCCESS';

export const DefaultParams = {
    startDate: moment('2020-09-26').utc().format(),
    endDate: moment().utc().format(),
    type: 'credit',
    bettingCompanyId: ''
}

export function updateWithdrawalDate(payload) {
    return dispatch =>
        dispatch({
            type: UPDATE_WITHDRAWAL_DATE,
            payload
        })
}

export function getWithdrawalHistory(payload) {
    const { user: { data: { bettingCompanyId: userBettingCompanyId = '', isSuperAdmin = false, } = {}, role = [] } = {} } = store.getState().auth || {};
    
    const { startDate = '', endDate = '', bettingCompanyId = '' } = payload || {};

    let _bettingCompanyId = (isSuperAdmin && bettingCompanyId && bettingCompanyId === 'overAll') ? '' : (!isSuperAdmin && role[0].toLocaleLowerCase() === authRoles.admin[0]) ? userBettingCompanyId : bettingCompanyId;

    const request = axios.get(`/analytics/getTransactionData?firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId || DefaultParams.bettingCompanyId}`);
    
    const playerRequest = axios.get('/players');

    return dispatch => {
        // return request.then(response => {
        //     dispatch(updateDepositsDate(payload || DefaultParams))
        //     return dispatch({
        //         type: DEPOSITS_SUCCESS,
        //         payload: response.data.data
        //     })
        // }
        return Promise.all([
            request,
            playerRequest
        ]).then((response) => {
            return dispatch({
                type: WITHDRAWAL_SUCCESS,
                payload: response[0].data.data
            })
        });
    }
}