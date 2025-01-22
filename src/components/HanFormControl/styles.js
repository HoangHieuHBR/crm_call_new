import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    formGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 10
    },
    formGroupNoMargin: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },
    formLabel: {
      width: 'calc(100% / 4)',
      color: '#8A9EAD'
    },
    formChildren: {
      width: '75%'
    },
    titleAsigned: {
      fontWeight: theme.typography.fontWeightMedium,
      fontSize: 14
    }
  })
);
