import { useState, useEffect } from 'react'
import { LinearProgress } from '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom'

import axiosClient from './api/axiosClient'
import UserContext from './context/UserContext'
import Navbar from './components/Navbar'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Sessions from './pages/Sessions'
import ChangePassword from './pages/ChangePassword'
import BasicHome from './pages/Basic/Home'
import AdminHome from './pages/Admin/Home'

const defaultUser = {
    userId: '',
    role: {
        id: '',
        name: ''
    },
    token: '',
    issuedAt: 0,
    expiresAt: 0
}

const App = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(defaultUser)

    const signIn = (userId, roleId, roleName, refreshToken, token, issuedAt, expiresAt) => {
        setUser({
            userId,
            role: {
                id: roleId,
                name: roleName
            },
            token,
            issuedAt,
            expiresAt
        })
        localStorage.setItem('authify-refresh-token', refreshToken)
    }

    const getToken = async () => {
        const lsRefreshToken = localStorage.getItem('authify-refresh-token')
        if (user.userId && lsRefreshToken && user.token && user.expiresAt) {
            if (Math.ceil(Date.now() / 1000) < (user.expiresAt - 10)) {
                return { token: user.token, refreshToken: lsRefreshToken }
            } else {
                try {
                    const { data: { userId, role, refreshToken, token, issuedAt, expiresAt } } = await axiosClient.post('/token', { refreshToken: lsRefreshToken })
                    signIn(userId, role.id, role.name, refreshToken, token, issuedAt, expiresAt)
                    return { token, refreshToken }
                } catch (err) {
                    console.error(err)
                    localStorage.removeItem('authify-refresh-token')
                    setUser(defaultUser)
                }
            }
        }
        return { token: '', refreshToken: '' }
    }

    const signOut = async () => {
        setIsLoading(true)
        const { token, refreshToken } = await getToken()
        if (token && refreshToken) {
            try {
                await axiosClient.delete(
                    '/auth',
                    {
                        headers: {
                            Authorization: token
                        },
                        data: {
                            refreshToken: refreshToken
                        }
                    }
                )
            } catch (err) {
                console.error(err)
            }
        }
        localStorage.removeItem('authify-refresh-token')
        setUser(defaultUser)
        setIsLoading(false)
    }

    const getProfile = async () => {
        const { token, refreshToken } = await getToken()
        if (token && refreshToken) {
            try {
                return (await axiosClient.get('/profile', { headers: { Authorization: token } })).data
            } catch (err) {
                console.error(err)
            }
        }
    }

    useEffect(() => {
        const lsRefreshToken = localStorage.getItem('authify-refresh-token')
        if (lsRefreshToken) {
            if (lsRefreshToken) {
                axiosClient
                    .post('/token', { refreshToken: lsRefreshToken })
                    .then(({ data: { userId, role, refreshToken, token, issuedAt, expiresAt } }) => {
                        setUser({
                            userId,
                            role: {
                                id: role.id,
                                name: role.name
                            },
                            token,
                            issuedAt,
                            expiresAt
                        })
                        localStorage.setItem('authify-refresh-token', refreshToken)
                        setIsLoading(false)
                    })
                    .catch(err => {
                        console.error(err)
                        localStorage.removeItem('authify-refresh-token')
                        setUser(defaultUser)
                        setIsLoading(false)
                    })
            }
        } else {
            setIsLoading(false)
        }
    }, [])

    const theme = createMuiTheme({
        palette: {
            primary: {
                main: '#1a73e8',
            }
        }
    })

    return (
        <>
            <UserContext.Provider value={{ user, signIn, signOut, getToken, getProfile }}>
                <Router>
                    <ThemeProvider theme={theme}>
                        {
                            isLoading
                                ?
                                (
                                    <LinearProgress />
                                )
                                :
                                (
                                    <Navbar>
                                        <Switch>
                                            {/* Redirection Rules */}
                                            {!user.userId && <Redirect from="/" to="/auth" exact />}
                                            {user.userId && user.role.name === 'basic' && <Redirect from="/auth" to="/home" exact />}
                                            {user.userId && user.role.name === 'basic' && <Redirect from="/" to="/home" exact />}
                                            {user.userId && user.role.name === 'admin' && <Redirect from="/auth" to="/admin/home" exact />}
                                            {user.userId && user.role.name === 'admin' && <Redirect from="/" to="/admin/home" exact />}

                                            {/* Routes */}
                                            {!user.userId && <Route path="/auth" component={Auth} exact />}
                                            {user.userId && <Route path="/profile" component={Profile} exact />}
                                            {user.userId && <Route path="/sessions" component={Sessions} exact />}
                                            {user.userId && <Route path="/changePassword" component={ChangePassword} exact />}
                                            {/* User Role Admin */}
                                            {user.userId && user.role.name === 'admin' && <Route path="/admin/home" component={AdminHome} exact />}
                                            {/* Basic Role User */}
                                            {user.userId && user.role.name === 'basic' && <Route path="/home" component={BasicHome} exact />}

                                            {/* Handle Un-matched route */}
                                            <Redirect from="*" to="/" exact />
                                        </Switch>
                                    </Navbar>
                                )
                        }
                    </ThemeProvider>
                </Router>
            </UserContext.Provider>
        </>
    )
}

export default App