import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
export const CSSListItem = withStyles(theme => ({
  root: {},
  selected: {
    '&.Mui-selected': {
      background:
        theme.palette.type == 'light' ? '#fafafa' : theme.palette.divider,
      '&:hover, &:focus': {
        background:
          theme.palette.type == 'light' ? '#fafafa' : theme.palette.divider,
        '&:before': {
          background:
            theme.palette.type == 'light' ? '#fafafa' : theme.palette.divider,
          transform: 'scale(1)'
        }
      },
      '&:after': {
        width: 'calc(0.5rem + 8px)',
        background:
          theme.palette.type == 'light' ? '#fafafa' : theme.palette.divider,
        transform: 'translateX(0)'
      }
    }
  }
}))(ListItem);
