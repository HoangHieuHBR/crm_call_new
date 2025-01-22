import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    loginContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row'
    },
    center: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    imgLoginContainer: {
      display: 'flex',
      alignItems: 'center',
      flexShrink: 5,
      justifyContent: 'center',
      height: '100%',
      backgroundColor: theme.palette.type == 'light' ? '#EFF1F9' : '#333333'
    },
    avatar: {
      margin: theme.spacing(1),
      width: 172,
      height: 77
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      height: 53,
      margin: theme.spacing(3, 0, 2)
    },

    root2: {
      '& .Mui-focused': {
        '& fieldset': {
          borderColor: 'white !important'
        },
        '& label': {
          color: 'red !important'
        }
      }
    },
    label: {
      color: theme.palette.type == 'light' ? '#333333' : 'white',
      '&.Mui-disabled': {
        color:
          theme.palette.type == 'light'
            ? 'rgba(0, 0, 0,  0.23)'
            : 'rgba(255, 255, 255,  0.23)'
      }
    }
  })
);
