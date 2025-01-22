import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapperContact: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    sectionFilter: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 55,
      paddingLeft: 20,
      paddingRight: 20,
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    sectionContentContact: {
      width: '100%',
      height: 'calc(100% - 55px)',
      overflowY: 'auto'
    },
    center: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    }
  })
);
