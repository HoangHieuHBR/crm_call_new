import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    dialog: {
      height: 400,
      width: '100%',
      flexDirection: 'column',
      display: 'flex'
    },
    contentTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex',
      padding: 4,
      paddingLeft: 8,
      color: 'white'
    },
    mainContent: {
      overflow: 'auto',
      flex: 1,
      flexDirection: 'row',
      display: 'flex',
      borderTopColor: theme.palette.divider,
      borderBottomColor: theme.palette.divider,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopStyle: 'solid',
      borderBottomStyle: 'solid'
    }
  })
);
