export const styles = theme => {
  return {
    center: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex'
    },
    wrapperContent: {
      width: '100%',
      border: `1px solid ${theme.palette.divider}`,
      padding: 10,
      borderRadius: 5,
      listStyle: 'none'
    },
    wrapperContentItem: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 10
    },
    wrapperContentItemCustomer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    wrapperContentItemTitle: {
      width: 200,
      fontWeight: 'bold'
    },
    wrapperContentItemContent: {
      flex: 1,
      width: 'calc(100% - 200px)',
      wordBreak: 'break-word'
    },
    wrapperContentItemContentHighlight: {
      flex: 1,
      backgroundColor: '#e7e7e7'
    },
    sectionStaff: {
      paddingLeft: 5,
      paddingRight: 5,
      height: 50,
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
      color: '#1E4E83'
    },
    sectionNameStaff: {
      textTransform: 'capitalize',
      fontSize: 12,
      marginLeft: 5,
      flex: 1
    },
    sectionSubject: {
      minWidth: 0,
      height: 50,
      paddingLeft: 10
    },
    sectionContentSubject: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineClamp: 3,
      boxOrient: 'vertical'
    }
  };
};
