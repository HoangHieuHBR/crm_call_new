import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
export const CssSelectStyleDL = withStyles(theme => ({
  root: {
    '& .MuiInputBase-root.MuiInput-root.MuiInput-underline:before': {
      borderBottomColor: '#000'
    }
  }
}))(Select);
