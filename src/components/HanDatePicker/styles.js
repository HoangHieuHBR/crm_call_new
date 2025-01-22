import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    textField: {
      borderRadius: 4,
      position: 'relative',
      // backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: 0,
      height: 41,
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
      }
    }
  })
);
