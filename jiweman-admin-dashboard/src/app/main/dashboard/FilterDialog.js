import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from '@lodash';
import PropTypes from 'prop-types';
import * as Actions from './store/actions/filter.actions';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	actionsContainer: {
		marginBottom: theme.spacing(2)
	},
	resetContainer: {
		padding: theme.spacing(3)
	},
	dialogPaper: {
		// minHeight: '50vh'
		// maxHeight: '50vh'
	}
}));

export const FILTER_TYPE = {
    DEPOSIT: 'deposit',
    OTHER: 'other',
}


function FilterDialog(props) {
    const { title = '', open = false, getFilteredData = () => { }, toggleDialog = () => { }, type = FILTER_TYPE.OTHER } = props || {};
    const [form, setForm] = useState({
        startDate: '',
        endDate: '',
        type: '',
        bettingCompanyId: '',
        bettingCompanyPlayerId: ''
    });
	const classes = useStyles();
    const dispatch = useDispatch();
    const { auth, projectDashboardApp } = useSelector((state) => state);
    const { user: {data: { isSuperAdmin = false, bettingCompanyId: userBettingCompanyId = '' } = {} } = {} } = auth || {};
    const { filters: { data: filterData = [], playersList = [] } = {} } = projectDashboardApp || {}

    useEffect(() => { 
        if (!isSuperAdmin) {
            dispatch(Actions.getBettingCompanyPlayers(userBettingCompanyId))
        }

        getFilterCompaniesList();
        
    }, [])

    const getFilterCompaniesList = () => {
        dispatch(Actions.getFilterCompaniesList());
    }

    const _getFilteredData = (e) => {
        e.preventDefault();
        toggleDialog();
        dispatch(getFilteredData(form));
    };
    
    const handleChange = (e) => {
        const { target: { name = '', value = '' } = {} } = e || {}

        if (name === 'company') {
            setForm({ ...form, bettingCompanyId: value })
            getBettingCompanyPlayers(value);
        }
        else if (name === 'startDate') {
            return setForm({...form, startDate: moment(value).utc().format('YYYY-MM-DDThh:mm')})
        }
        else if (name === 'endDate') {
            return setForm({...form, endDate: moment(value).utc().format('YYYY-MM-DDThh:mm')})
        }
        else if (name === 'type') {
            setForm({...form, type: value})
        }
        else if (name === 'bettingCompanyPlayer') {
            setForm({...form, bettingCompanyPlayerId: value})
        }
        else if (name === 'filterBy') {
            setForm({...form, filterBy: value})
        }
    }

    const getBettingCompanyPlayers = (bettingCompanyId) => {
        if (!isSuperAdmin) return;

        dispatch(Actions.getBettingCompanyPlayers(bettingCompanyId))
    }
    
	return (
		<Dialog
            open={open}
			onClose={toggleDialog}
			fullWidth
			maxWidth="sm"
			classes={{ paper: classes.dialogPaper }}
			disableBackdropClick={true}
			disableEscapeKeyDown={true}
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
                        { title }
					</Typography>
				</Toolbar>
			</AppBar>

            <form onSubmit={_getFilteredData}>
			    <DialogContent classes={{ root: 'p-0' }}>
                    <div className="sm:px-24">
                            {
                                isSuperAdmin &&
                                <div className="flex py-12">
                                    <FormControl className="px-8" variant="outlined" required fullWidth>
                                        <InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
                                            Betting Company
                                        </InputLabel>
                                        <Select
                                            value={form.bettingCompanyId}
                                            labelId="demo-simple-select-outlined-label-region"
                                            id="demo-simple-select-outlined-region"
                                            onChange={handleChange}
                                            required
                                            label="Filter By Betting Company"
                                            name="company"
                                        >
                                            {filterData && filterData?.map(({ name, _id }) => (
                                                <MenuItem value={_id} key={_id.toString()}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            {
                                (type === FILTER_TYPE.DEPOSIT && ((!_.isEmpty(form.bettingCompanyId) && !_.isEqual(form.bettingCompanyId, 'overAll')) ||!isSuperAdmin)) &&
                                <div className="flex py-12">
                                    <FormControl className="px-8" variant="outlined" required fullWidth>
                                        <InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
                                            Players
                                        </InputLabel>
                                        <Select
                                            value={form.bettingCompanyPlayerId}
                                            labelId="demo-simple-select-outlined-label-region"
                                            id="demo-simple-select-outlined-region"
                                            onChange={handleChange}
                                            required
                                            label="Filter By Betting Company"
                                            name="bettingCompanyPlayer"
                                        >
                                        {playersList && playersList?.map(({ name, _id }) => (
                                                <MenuItem value={_id} key={_id.toString()}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            }
                            {
                            (!_.isEmpty(form.bettingCompanyId) || !isSuperAdmin) &&
                            <>
                                <div className="flex py-12">
                                    <FormControl className="px-8" variant="outlined" required fullWidth>
                                        <InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
                                            Filter By
                                        </InputLabel>
                                        <Select
                                            value={form.filterBy}
                                            labelId="demo-simple-select-outlined-label-region"
                                            id="demo-simple-select-outlined-region"
                                            onChange={handleChange}
                                            required
                                            label="Filter By Betting Company"
                                            name="filterBy"
                                        >
                                        {[
                                            { name: 'Transactions', _id: 'transactions' },
                                            { name: 'Age', _id: 'age' },
                                            { name: 'Gender', _id: 'gender' },
                                            { name: 'Location', _id: 'location' },
                                        ]?.map(({ name, _id }) => (
                                                <MenuItem value={_id} key={_id.toString()}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className="flex py-12">
                                    <FormControl className="px-4" required fullWidth>
                                        <TextField
                                            name="startDate"
                                            label="Start Date"
                                            type="datetime-local"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                max: form.endDate,
                                            }}
                                            value={form.startDate}
                                            onChange={handleChange}
                                            variant="outlined"
                                            required
                                        />
                                    </FormControl>
                                    <FormControl className="px-8" required fullWidth>
                                        <TextField
                                            name="endDate"
                                            label="End Date"
                                            type="datetime-local"
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                            inputProps={{
                                                min: form.startDate
                                            }}
                                            value={form.endDate}
                                            onChange={handleChange}
                                            variant="outlined"
                                            required
                                        />
                                    </FormControl>
                                </div>
                                <div className="flex py-12">
                                <FormControl className="px-8" variant="outlined" required fullWidth>
                                    <InputLabel style={{ marginLeft: 5 }} id="demo-simple-select-outlined-label-region">
                                        Type
                                    </InputLabel>
                                    <Select
                                        value={form.type}
                                        labelId="demo-simple-select-outlined-label-region"
                                        id="demo-simple-select-outlined-region"
                                        onChange={handleChange}
                                        required
                                        label="Transaction Type"
                                        name="type"
                                    >
                                        {[
                                            { name: 'Betting', value: 'betting' },
                                            { name: 'League', value: 'league' },
                                            { name: 'Debit', value: 'debit' },
                                            { name: 'Credit', value: 'credit' }

                                        ].map(({ name, value }) => (
                                            <MenuItem value={value} key={value.toString()}>{name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                </div>
                            </>
                        }
                    </div>
			    </DialogContent>

			    <DialogActions className="justify-end p-8">
                    <div className="px-16">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={_getFilteredData}
                        className={clsx(classes.button, 'flex self-end')}
                        disabled={(isSuperAdmin && _.isEmpty(form.bettingCompanyId)) || (_.isEmpty(form.startDate) || _.isEmpty(form.endDate) || _.isEmpty(form.type) || (type === FILTER_TYPE.DEPOSIT && _.isEmpty(form.bettingCompanyPlayerId) && form.bettingCompanyId !== 'overAll') || _.isEmpty(form.filterBy))}
                    >
                        Submit
                    </Button>

                    </div>
                    <div className="px-16">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => toggleDialog()}
                        >
                            Close
                        </Button>
                    </div>
                </DialogActions>
            </form>
		</Dialog>
	);
}

FilterDialog.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    type: PropTypes.string,
    getFilteredData: PropTypes.func,
}

export default FilterDialog;
