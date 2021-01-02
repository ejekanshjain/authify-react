import { useContext, useEffect, useState } from 'react'
import {
    LinearProgress,
    Grid,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Button,
    Snackbar,
    SnackbarContent
} from '@material-ui/core';
import dayjs from 'dayjs'

import UserContext from '../context/UserContext'
import axiosClient from '../api/axiosClient'

const Profile = () => {
    const userContext = useContext(UserContext)
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
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [gender, setGender] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState(dayjs(new Date()).format('YYYY-MM-DD'))
    useEffect(() => {
        userContext
            .getProfile()
            .then(data => {
                if (data) {
                    setEmail(data.email)
                    setFirstName(data.details.name.firstName)
                    setLastName(data.details.name.lastName)
                    setGender(data.details.gender)
                    setDateOfBirth(dayjs(new Date(data.details.dateOfBirth)).format('YYYY-MM-DD'))
                    setIsLoading(false)
                }
            }).catch(console.error)
    }, [userContext])
    const handleEmailChange = e => setEmail(e.target.value)
    const handleFirstNameChange = e => setFirstName(e.target.value)
    const handleLastNameChange = e => setLastName(e.target.value)
    const handleDateOfBirthChange = e => setDateOfBirth(e.target.value)
    const handleGenderChange = e => setGender(e.target.value)
    const handleSubmit = async e => {
        e.preventDefault()
        const obj = {
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth: new Date(dateOfBirth),
            gender: gender.trim(),
        }
        if (obj.email && obj.firstName && obj.lastName && obj.dateOfBirth && obj.gender) {
            const { token } = await userContext.getToken()
            if (token) {
                try {
                    await axiosClient.patch('/profile', obj, {
                        headers: {
                            Authorization: token
                        }
                    })
                    showToast('Profile Updated Successfully!')
                } catch (err) {
                    if (err.response.status === 400 && err.response.data.message) showToast(err.response.data.message)
                    else console.error(err)
                }
            }
        }
    }
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
                        <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="center"
                        >
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h6" gutterBottom>
                                    Profile
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="email"
                                            name="email"
                                            label="Email"
                                            fullWidth
                                            value={email}
                                            onChange={handleEmailChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="firstName"
                                            name="firstName"
                                            label="First Name"
                                            fullWidth
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="lastName"
                                            name="lastName"
                                            label="Last name"
                                            fullWidth
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            label="Birthday"
                                            fullWidth
                                            type="date"
                                            value={dateOfBirth}
                                            onChange={handleDateOfBirthChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InputLabel id="gender-label">Gender *</InputLabel>
                                        <Select
                                            labelId="gender-label"
                                            id="gender"
                                            required
                                            value={gender}
                                            label="Gender"
                                            fullWidth
                                            onChange={handleGenderChange}
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                            <MenuItem value="other">Other</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                                <br />
                                <Button variant="contained" color="primary" type="submit">Update</Button>
                            </form>
                        </Grid>
                    )
            }
            <Snackbar open={isToastOpen} autoHideDuration={5000} onClose={handleToastClose}>
                <SnackbarContent message={toastMessage} />
            </Snackbar>
        </>
    )
}

export default Profile