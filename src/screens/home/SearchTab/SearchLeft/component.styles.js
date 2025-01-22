import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
export const TextTitleTypography = withStyles(theme => ({
  root: {
    color:
      theme.palette.type == 'light' ? theme.palette.primary.main : '#EFF1F9',
    fontSize: 14
  }
}))(Typography);
export const TextHintTypography = withStyles(theme => ({
  root: {
    color: '#8A9EAD',
    fontSize: 12
  }
}))(Typography);
