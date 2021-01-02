import { useContext, useState, useEffect } from 'react'
import {
    LinearProgress,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    Paper
} from '@material-ui/core';

import UserContext from '../../context/UserContext'
import axiosClient from '../../api/axiosClient'

const Roles = () => {
    const userContext = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [roles, setRoles] = useState([])

    useEffect(() => {
        userContext
            .getToken()
            .then(({ token }) => {
                if (token) {
                    axiosClient
                        .get('/roles', { headers: { Authorization: token } })
                        .then(({ data }) => {
                            setRoles(data)
                            setIsLoading(false)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
    }, [userContext])

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
                        <Container>
                            <Typography variant="h6" gutterBottom>
                                Roles
                            </Typography>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <TableContainer component={Paper}>
                                    <Table aria-label="Roles">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sr. No.</TableCell>
                                                <TableCell>Role</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {roles.map((role, i) => (
                                                <TableRow key={role._id}>
                                                    <TableCell component="th" scope="row">
                                                        {i + 1}
                                                    </TableCell>
                                                    <TableCell>{role.name}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Container>
                    )
            }
        </>
    )
}

export default Roles