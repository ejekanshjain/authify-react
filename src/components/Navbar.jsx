import { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogActions,
    DialogTitle,
    Button
} from '@material-ui/core'
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Mail as MailIcon,
    PowerSettingsNew as PowerIcon,
    Home as HomeIcon,
    AccountCircle as ProfileIcon,
    VerifiedUser as SessionIcon,
    Build as ChangePasswordIcon
} from '@material-ui/icons'

import UserContext from '../context/UserContext'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: -drawerWidth
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
    }
}))

const Navbar = props => {
    const classes = useStyles()
    const theme = useTheme()

    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    const [isAlertOpen, setIsAlertOpen] = useState(false)

    const handleAlertClose = () => setIsAlertOpen(false)

    const userContext = useContext(UserContext)

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        Authify
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                {!userContext.user.userId &&
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="subtitle1" noWrap>
                            Sign In First
                        </Typography>
                    </div>
                }
                {userContext.user.userId &&
                    <>
                        {/* Admin */}
                        {
                            userContext.user.role.name === 'admin' &&
                            <>
                                <List>
                                    <ListItem component={NavLink} to="/admin/home" onClick={handleDrawerClose} button>
                                        <ListItemIcon>
                                            <HomeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Home' />
                                    </ListItem>
                                </List>
                                <Divider />
                                <List>
                                    <ListItem>
                                        <ListItemText secondary='Other' />
                                    </ListItem>
                                    <ListItem component={NavLink} to="/mail" onClick={handleDrawerClose}>
                                        <ListItemIcon>
                                            <MailIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Mail' />
                                    </ListItem>
                                </List>
                            </>
                        }
                        {/* Basic */}
                        {
                            userContext.user.role.name === 'basic' &&
                            <>
                                <List>
                                    <ListItem component={NavLink} to="/home" onClick={handleDrawerClose} button>
                                        <ListItemIcon>
                                            <HomeIcon />
                                        </ListItemIcon>
                                        <ListItemText primary='Home' />
                                    </ListItem>
                                </List>
                            </>
                        }
                        <Divider />
                        <List>
                            <ListItem>
                                <ListItemText secondary='My Account' />
                            </ListItem>
                            <ListItem component={NavLink} to="/profile" onClick={handleDrawerClose} button>
                                <ListItemIcon>
                                    <ProfileIcon />
                                </ListItemIcon>
                                <ListItemText primary="Profile" />
                            </ListItem>
                            <ListItem component={NavLink} to="/sessions" onClick={handleDrawerClose} button>
                                <ListItemIcon>
                                    <SessionIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sessions" />
                            </ListItem>
                            <ListItem component={NavLink} to="/changePassword" onClick={handleDrawerClose} button>
                                <ListItemIcon>
                                    <ChangePasswordIcon />
                                </ListItemIcon>
                                <ListItemText primary="Change Password" />
                            </ListItem>
                            <ListItem onClick={() => {
                                handleDrawerClose()
                                setIsAlertOpen(true)
                            }} button>
                                <ListItemIcon>
                                    <PowerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Sign Out" />
                            </ListItem>
                        </List>
                    </>
                }
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <div>
                    {props.children}
                </div>
            </main>
            {userContext.user.userId &&
                <Dialog
                    open={isAlertOpen}
                    onClose={handleAlertClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Are you sure you want to Sign Out?"}</DialogTitle>
                    <DialogActions>
                        <Button onClick={handleAlertClose} color="primary" autoFocus>
                            No
                        </Button>
                        <Button onClick={() => {
                            handleAlertClose()
                            userContext.signOut()
                        }} color="secondary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            }
        </div>
    )
}

export default Navbar