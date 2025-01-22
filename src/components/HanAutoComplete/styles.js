import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      flexWrap: 'wrap',
      listStyle: 'none',
      overflowY: 'auto',
      maxHeight: 90,
      minHeight: 90,
      padding: theme.spacing(0.5),
      margin: 0
    },
    chip: {
      margin: theme.spacing(0.5)
    }
  })
);
