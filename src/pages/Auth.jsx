import { useState, useContext } from 'react'
import {
    Avatar,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Snackbar,
    SnackbarContent
} from '@material-ui/core'
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import axiosClient from '../api/axiosClient'
import UserContext from '../context/UserContext'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}))

const Auth = () => {
    const classes = useStyles()
    const userContext = useContext(UserContext)

    const [isLoginDisabled, setIsLoginDisabled] = useState(false)

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

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoginDisabled(true)

        const email = e.currentTarget.elements.email.value
        const password = e.currentTarget.elements.password.value

        if (!email || !password) {
            showToast('Email and Password is required!')
            setIsLoginDisabled(false)
            return
        }

        try {
            const { data } = await axiosClient.post('/auth', { email, password })
            userContext.signIn(data.userId, data.role.id, data.role.name, data.refreshToken, data.token, data.issuedAt, data.expiresAt)
        } catch (err) {
            if (err.response && err.response.data && (err.response.status === 400 || err.response.status === 403)) {
                console.error(err.response.data.code)
                showToast(err.response.data.message)
            } else {
                console.error(err.response)
            }
            setIsLoginDisabled(false)
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        type="email"
                        label="Email"
                        name="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isLoginDisabled}
                    >
                        Sign In
                    </Button>
                </form>
            </div>
            <Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose}>
                <SnackbarContent message={toastMessage} />
            </Snackbar>
        </Container>
    )
}

export default Auth