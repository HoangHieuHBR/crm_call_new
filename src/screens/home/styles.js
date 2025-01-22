import { createStyles, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme =>
  createStyles({
    main: {
      height: '100%',
      width: '100%',
      flexDirection: 'row',
      display: 'flex',
      overflow: 'hidden'
    },
    drawer: {
      backgroundColor:
        theme.palette.type == 'light'
          ? theme.palette.primary.main
          : theme.palette.background.paper,
      display: 'flex',
      float: 'left',
      height: '100%',
      width: 60,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    mainLayoutRight: {
      height: '100%',
      width: 'calc(100% - 60px)',
      position: 'absolute',
      left: 60,
      display: 'flex',
      flexDirection: 'column'
    },
    mainLayoutHeader: {
      height: 60,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 20,
      borderBottom: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.palette.divider
    },

    listItemIcon: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    listItem: {
      width: 60,
      height: 60,
      justifyContent: 'center'
    },
    listItemActive: {
      width: 60,
      height: 60,
      justifyContent: 'center',
      backgroundColor: '#EFF1F91A'
    },
    contentSelect: {
      width: 8,
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    selectedItem: {
      width: 2,
      height: '100%',
      backgroundColor: '#FFFFFF'
    }
  })
);
