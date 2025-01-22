import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
export const CssTextFieldStyle = withStyles(theme => ({
  root: {
    '& label': {
      color: 'white'
    },
    '& label.Mui-focused': {
      color: 'white'
    },
    '& label.Mui-error': {
      color: '#ffbcbc'
    },
    '& label.Mui-disabled': {
      color: 'rgba(255, 255, 255,  0.23)'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green'
    },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      '& .Mui-disabled': {
        color: 'rgba(255, 255, 255,  0.23)'
      },
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 1)'
      },
      '&:hover fieldset': {
        borderColor: 'white',
        borderWidth: 2
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      },
      '&.Mui-error fieldset': {
        borderColor: '#ffbcbc'
      },
      '&.Mui-disabled fieldset': {
        borderColor: 'rgba(255, 255, 255,  0.23)'
      }
    },
    '& .MuiFormHelperText-root': {
      '&.Mui-error': {
        color: '#ffbcbc'
      }
    },
    '& .MuiInputBase-input[value=""] + fieldset ': {
      borderColor: 'rgba(255, 255, 255, 0.23)'
    }
  }
}))(TextField);
export const CSSCheckBoxStyle = withStyles(theme => ({
  root: {
    color: 'rgba(255, 255, 255, 0.23)',
    '&$disabled': {
      color: 'rgba(255, 255, 255, 0.23)'
    },
    '&$checked:not($disabled)': {
      color: 'white'
    }
  },
  disabled: {},
  checked: {}
}))(Checkbox);

export const CSSButtonStyle = withStyles(theme => ({
  root: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    },
    '& .MuiButton-label': {
      color: '#0667BD',
      fontWeight: 700
    }
  }
}))(Button);

export const CssTextFieldStyleDL = withStyles(theme => ({
  root: {
    '& label': {
      color: theme.palette.type == 'light' ? '#8A9EAD' : 'white'
    },
    '& label.Mui-focused': {
      color: theme.palette.type == 'light' ? '#2870b6' : 'white'
    },
    '& label.Mui-error': {
      color: '#ff0000'
    },
    '& label.Mui-disabled': {
      color:
        theme.palette.type == 'light'
          ? 'rgba(0, 0, 0,  0.23)'
          : 'rgba(255, 255, 255,  0.23)'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'primary'
    },
    '& .MuiOutlinedInput-root': {
      color: theme.palette.type == 'light' ? '#333333' : 'white',
      '& .Mui-disabled': {
        color:
          theme.palette.type == 'light'
            ? 'rgba(0, 0, 0,  0.23)'
            : 'rgba(255, 255, 255,  0.23)'
      },
      '& fieldset': {
        borderColor: theme.palette.type == 'light' ? '#333333' : 'white'
      },
      '&:hover fieldset': {
        borderColor: theme.palette.type == 'light' ? '#2870b6' : 'white',
        borderWidth: 2
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.type == 'light' ? '#2870b6' : 'white'
      },
      '&.Mui-error fieldset': {
        borderColor: '#ff0000'
      },
      '&.Mui-disabled fieldset': {
        borderColor:
          theme.palette.type == 'light'
            ? 'rgba(0, 0, 0,  0.23)'
            : 'rgba(255, 255, 255,  0.23)'
      }
    },
    '& .MuiFormHelperText-root': {
      '&.Mui-error': {
        color: '#ff0000'
      }
    },
    '& .MuiInputBase-input[value=""] + fieldset ': {
      borderColor:
        theme.palette.type == 'light'
          ? 'rgba(0, 0, 0,  0.23)'
          : 'rgba(255, 255, 255,  0.23)'
    }
  }
}))(TextField);

export const CSSCheckBoxStyleDL = withStyles(theme => ({
  root: {
    color:
      theme.palette.type == 'light'
        ? 'rgba(0, 0, 0,  0.23)'
        : 'rgba(255, 255, 255,  0.23)',
    '&$disabled': {
      color:
        theme.palette.type == 'light'
          ? 'rgba(0, 0, 0,  0.23)'
          : 'rgba(255, 255, 255,  0.23)'
    },
    '&$checked:not($disabled)': {
      color: theme.palette.type == 'light' ? '#2870b6' : 'white'
    }
  },
  disabled: {},
  checked: {}
}))(Checkbox);

export const CSSButtonStyleDL = withStyles(theme => ({
  root: {
    borderRadius: 26,
    backgroundColor:
      theme.palette.type == 'light' ? '#0667BD' : 'rgba(255, 255, 255,  0.8)',
    '&:hover': {
      backgroundColor:
        theme.palette.type == 'light'
          ? 'rgba(40, 112, 182, 0.9)'
          : 'rgba(255, 255, 255,  0.5)'
    },
    '& .MuiButton-label': {
      color: theme.palette.type == 'light' ? 'white' : 'black',
      fontWeight: 700
    }
  }
}))(Button);
