import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    wrapperTask: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 4,
      padding: 10,
      margin: 0,
      marginBottom: 20,
      listStyle: 'none'
    },
    itemDescription: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 5
    },
    itemDescriptionLabel: {
      width: 80,
      color: '#8A9EAD'
    }
  })
);
