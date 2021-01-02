import { useContext, useState } from 'react'
import {
    Grid,
    Typography,
    TextField,
    Button,
    Snackbar,
    SnackbarContent
} from '@material-ui/core';

import UserContext from '../context/UserContext'
import axiosClient from '../api/axiosClient'

const ChangePassword = () => {
    const userContext = useContext(UserContext)
    const [isToastOpen, setIsToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const handleCurrentPasswordChange = e => setCurrentPassword(e.target.value)
    const handleNewPasswordChange = e => setNewPassword(e.target.value)
    const handleConfirmPasswordChange = e => setConfirmPassword(e.target.value)
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
        const obj = {
            currentPassword: currentPassword.trim(),
            newPassword: newPassword.trim(),
            confirmPassword: confirmPassword.trim()
        }
        if (obj.currentPassword && obj.newPassword && obj.confirmPassword) {
            const { token } = await userContext.getToken()
            if (token) {
                try {
                    await axiosClient.patch('/password', obj, {
                        headers: {
                            Authorization: token
                        }
                    })
                    showToast('Password Changed Successfully!')
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                } catch (err) {
                    if (err.response.status === 400 && err.response.data.message) showToast(err.response.data.message)
                    else console.error(err)
                }
            }
        }
    }
    return (
        <>
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <form onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                        Change Password
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="currentPassword"
                                name="currentPassword"
                                label="Current Password"
                                fullWidth
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="newPassword"
                                name="newPassword"
                                label="New Password"
                                fullWidth
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                required
                                id="confirmPassword"
                                name="confirmPassword"
                                label="Confirm Password"
                                fullWidth
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                type="password"
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <Button variant="contained" color="primary" type="submit">Change Password</Button>
                </form>
            </Grid>
            <Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose}>
                <SnackbarContent message={toastMessage} />
            </Snackbar>
        </>
    )
}

export default ChangePassword