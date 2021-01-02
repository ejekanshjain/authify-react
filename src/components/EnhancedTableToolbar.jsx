import PropTypes from 'prop-types'
import clsx from 'clsx'
import { lighten, makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1)
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85)
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark
            },
    title: {
        flex: '1 1 100%'
    }
}))

const EnhancedTableToolbar = ({
    numSelected,
    title,
    multipleSelectedTitle,
    multipleSelectedIcon,
    onMultipleSelectedClick
}) => {
    const classes = useToolbarStyles()

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                    <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
                        {title}
                    </Typography>
                )}

            {numSelected > 0 && (
                <Tooltip title={multipleSelectedTitle}>
                    <IconButton onClick={onMultipleSelectedClick}>
                        {multipleSelectedIcon}
                    </IconButton>
                </Tooltip>
            )}
        </Toolbar>
    )
}

EnhancedTableToolbar.propTypes = {
    title: PropTypes.string.isRequired,
    numSelected: PropTypes.number.isRequired,
    multipleSelectedTitle: PropTypes.string.isRequired,
    multipleSelectedIcon: PropTypes.element.isRequired,
    onMultipleSelectedClick: PropTypes.func.isRequired
}

export default EnhancedTableToolbar