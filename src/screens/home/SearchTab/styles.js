import {createStyles, makeStyles} from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    splitViewContentLeft: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%'
    },
    splitViewContentRight: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: '100%'
    }, searchContentContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    center: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    }

  })
);
