import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    titleModal: {
      padding: '5px 20px',
      borderBottom: `1px solid ${theme.palette.divider}`,
      textTransform: 'uppercase',
      flex: 1
    },
    footerModal: {
      borderTop: `1px solid ${theme.palette.divider}`
    }
  })
);
