import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Paper,
    Checkbox,
    LinearProgress
} from '@material-ui/core'
import {
    Check as CheckIcon
} from '@material-ui/icons'
import dayjs from 'dayjs'

import EnhancedTableToolbar from '../../components/EnhancedTableToolbar'
import EnhancedTableHead from '../../components/EnhancedTableHead'
import UserContext from '../../context/UserContext'
import axiosClient from '../../api/axiosClient'

const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1
    }
    if (b[orderBy] > a[orderBy]) {
        return 1
    }
    return 0
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy)
}

const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0])
        if (order !== 0) return order
        return a[1] - b[1]
    })
    return stabilizedThis.map((el) => el[0])
}

const headCells = [
    { id: 'sr', numeric: false, disablePadding: true, label: 'Sr. No.' },
    { id: 'email', numeric: false, disablePadding: true, label: 'Email' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
    { id: 'Active', numeric: false, disablePadding: false, label: 'Active' },
    { id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
    { id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
    { id: 'gender', numeric: false, disablePadding: false, label: 'Gender' },
    { id: 'dateOfBirth', numeric: false, disablePadding: false, label: 'Date Of Birth' },
    { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created At' },
    { id: 'updatedAt', numeric: false, disablePadding: false, label: 'Last Updated At' },
    { id: 'passwordUpdatedAt', numeric: false, disablePadding: false, label: 'Password Updated At' }
]

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}))

export default function EnhancedTable() {
    const classes = useStyles()
    const userContext = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [rows, setRows] = useState([])
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('email')
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        userContext
            .getToken()
            .then(({ token }) => {
                if (token) {
                    axiosClient
                        .get('/users', { headers: { Authorization: token } })
                        .then(({ data }) => {
                            setRows(data.map(d => ({
                                _id: d._id,
                                email: d.email,
                                role: d.role.name,
                                active: d.active ? 'Active' : 'Inactive',
                                firstName: d.details.name.firstName,
                                lastName: d.details.name.lastName,
                                gender: d.details.gender,
                                dateOfBirth: dayjs(new Date(d.details.dateOfBirth)).format('DD MMM YYYY'),
                                createdAt: dayjs(new Date(d.createdAt)).format('DD MMM YYYY, h:mm a'),
                                updatedAt: dayjs(new Date(d.updatedAt)).format('DD MMM YYYY, h:mm a'),
                                passwordUpdatedAt: d.passwordUpdatedAt ? dayjs(new Date(d.passwordUpdatedAt)).format('DD MMM YYYY, h:mm a') : 'NA',
                            })))
                            setIsLoading(false)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
    }, [userContext])

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n._id)
            setSelected(newSelecteds)
            return
        }
        setSelected([])
    }

    const handleClick = (event, _id) => {
        const selectedIndex = selected.indexOf(_id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, _id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }
        setSelected(newSelected)
    }

    const handleChangePage = (event, newPage) => setPage(newPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

    return (
        <>
            {
                isLoading
                    ?
                    (
                        <LinearProgress />
                    )
                    :
                    (
                        <div className={classes.root} >
                            <Paper className={classes.paper}>
                                <EnhancedTableToolbar
                                    numSelected={selected.length}
                                    title="Users"
                                    multipleSelectedTitle="Delete"
                                    multipleSelectedIcon={<CheckIcon />}
                                    onMultipleSelectedClick={() => { }}
                                />
                                <TableContainer>
                                    <Table
                                        className={classes.table}
                                        size='medium'
                                    >
                                        <EnhancedTableHead
                                            classes={classes}
                                            numSelected={selected.length}
                                            order={order}
                                            orderBy={orderBy}
                                            onSelectAllClick={handleSelectAllClick}
                                            onRequestSort={handleRequestSort}
                                            rowCount={rows.length}
                                            headCells={headCells}
                                        />
                                        <TableBody>
                                            {stableSort(rows, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, i) => {
                                                    const isItemSelected = isSelected(row._id)
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={row._id}
                                                            selected={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                    onClick={(event) => handleClick(event, row._id)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{i + 1}</TableCell>
                                                            <TableCell>{row.email}</TableCell>
                                                            <TableCell>{row.role}</TableCell>
                                                            <TableCell>{row.active}</TableCell>
                                                            <TableCell>{row.firstName}</TableCell>
                                                            <TableCell>{row.lastName}</TableCell>
                                                            <TableCell>{row.gender}</TableCell>
                                                            <TableCell>{row.dateOfBirth}</TableCell>
                                                            <TableCell>{row.createdAt}</TableCell>
                                                            <TableCell>{row.updatedAt}</TableCell>
                                                            <TableCell>{row.passwordUpdatedAt}</TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 53 * emptyRows }}>
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[10, 25]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </div >
                    )
            }
        </>
    )
}