export const styles = theme => {
  return {
    loadingContainer: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      display: 'flex',
      position: 'absolute',
      top: 0,
      backgroundColor: theme.palette.type == 'light' ? '#ffffff' : '#333333'
    }
  };
};
