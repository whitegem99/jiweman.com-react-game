import axios from 'axios';
import moment from 'moment';
import store from '../../../../store';
import { authRoles } from '../../../../auth';

export const UPDATE_TRANSACTIONS_DATE = '[PROJECT DASHBOARD APP] UPDATE TRANSACTIONS DATES';
export const TRANSATIONS_SUCCESS = '[PROJECT DASHBOARD APP] TRANSACTIONS SUCCESS';

export const DefaultParams = {
    startDate: moment('2020-09-26').utc().format(),
    endDate: moment().utc().format(),
    type: 'betting',
    bettingCompanyId: ''
}

export const FILTER_BY = {
    transactions: 'transactions',
    age: 'age',
    gender: 'gender',
    location: 'location'
}

export function updateTransactionsDate(payload) {
    return dispatch =>
        dispatch({
            type: UPDATE_TRANSACTIONS_DATE,
            payload
        })
}

export function getTransactions(payload) {
    const { user: { data: { bettingCompanyId: userBettingCompanyId = '', isSuperAdmin = false } = {}, role = [] } = {} } = store.getState().auth || {};
    
    const { startDate = '', endDate = '', bettingCompanyId = '', type = '', filterBy = 'transactions' } = payload || {};

    let _bettingCompanyId = (isSuperAdmin && bettingCompanyId && bettingCompanyId === 'overAll') ? '' : (!isSuperAdmin && role[0]?.toLocaleLowerCase() === authRoles.admin[0]) ? userBettingCompanyId : bettingCompanyId;
    let request = null;

    let queryParams = `firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${type || DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId || DefaultParams.bettingCompanyId}`

    switch (filterBy) {
        case FILTER_BY.transactions:
            request = axios.get(`/analytics/getTransactionData?${queryParams}`);
            break;
        
        case FILTER_BY.age:
            request = axios.get(`/analytics/getAgeData?${queryParams}`);
            break;
        
        case FILTER_BY.gender:
            request = axios.get(`/analytics/getGenderData?${queryParams}`);
            break;
        
        case FILTER_BY.location:
            request = axios.get(`/analytics/getCountryData?${queryParams}`);
            break;
    }

	// const request = axios.get(`/analytics/getTransactionData?firstDate=${startDate || DefaultParams.startDate}&lastDate=${endDate || DefaultParams.endDate}&type=${type || DefaultParams.type}&&bettingCompanyId=${_bettingCompanyId || DefaultParams.bettingCompanyId}`);

    return dispatch => {
        return request.then(response => {
            dispatch(updateTransactionsDate(payload || DefaultParams))
            return dispatch({
                type: TRANSATIONS_SUCCESS,
                payload: response.data.data
            })
        }
        );
    }
}