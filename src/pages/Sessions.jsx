import { useContext, useEffect, useState } from 'react'
import {
    LinearProgress,
    Snackbar,
    SnackbarContent,
    Grid,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
    IconButton,
    Chip
} from '@material-ui/core'
import dayjs from 'dayjs'
import { Delete as RemoveIcon } from '@material-ui/icons'
import UAParser from 'ua-parser-js'

import UserContext from '../context/UserContext'
import axiosClient from '../api/axiosClient'

const Sessions = () => {
    const userContext = useContext(UserContext)
    const [sessions, setSessions] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [isToastOpen, setIsToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const showToast = message => {
        setIsToastOpen(true)
        setToastMessage(message)
    }
    const handleToastClose = () => {
        setIsToastOpen(false)
        setToastMessage('')
    }

    useEffect(() => {
        userContext
            .getToken()
            .then(({ token, refreshToken }) => {
                if (token && refreshToken) {
                    axiosClient
                        .post('/sessions', { refreshToken }, { headers: { Authorization: token } })
                        .then(({ data }) => {
                            const uaParser = new UAParser()
                            data.forEach(d => {
                                uaParser.setUA(d.userAgent)
                                d.device = uaParser.getDevice()
                                d.browser = uaParser.getBrowser()
                                d.os = uaParser.getOS()
                            })
                            setSessions(data)
                            setIsLoading(false)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
    }, [userContext])

    const removeSession = async sessionId => {
        const { token, refreshToken } = await userContext.getToken()
        try {
            await axiosClient.delete('/sessions/' + sessionId, {
                headers: {
                    Authorization: token
                },
                data: { refreshToken }
            })
            showToast('Session Removed!')
            setSessions(prevSessions => prevSessions.filter(prevSession => prevSession._id !== sessionId))
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <Container>
            {
                isLoading
                    ?
                    (
                        <LinearProgress />
                    )
                    :
                    (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Active Sessions
                            </Typography>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <TableContainer component={Paper}>
                                    <Table aria-label="Active Sessions">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Sr. No.</TableCell>
                                                <TableCell>Signed in at</TableCell>
                                                <TableCell>OS</TableCell>
                                                <TableCell>Device</TableCell>
                                                <TableCell>Browser</TableCell>
                                                <TableCell>Remove</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sessions.map((session, i) => (
                                                <TableRow key={session._id}>
                                                    <TableCell component="th" scope="row">
                                                        {i + 1}
                                                    </TableCell>
                                                    <TableCell>{dayjs(new Date(session.createdAt)).format('MMMM DD YYYY, h:mm:ss a')}</TableCell>
                                                    <TableCell>{session.os.name + ' ' + session.os.version}</TableCell>
                                                    <TableCell>{session.device.model ? session.device.model : 'Unknown'}</TableCell>
                                                    <TableCell>{session.browser.name + ' ' + session.browser.major}</TableCell>
                                                    <TableCell>
                                                        {
                                                            session.isCurrent
                                                                ?
                                                                (
                                                                    <Chip variant="outlined" color="primary" label="Current" />
                                                                )
                                                                :
                                                                (
                                                                    <IconButton aria-label="remove" onClick={removeSession.bind(this, session._id)}>
                                                                        <RemoveIcon style={{ color: 'red' }} />
                                                                    </IconButton>
                                                                )
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </>
                    )
            }
            <Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose}>
                <SnackbarContent message={toastMessage} />
            </Snackbar>
        </Container>
    )
}

export default Sessions