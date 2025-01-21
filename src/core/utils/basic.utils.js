const funcs = {
  isDevelopMode() {
    return process.argv.includes('develop_mode');
  },
  prefixFromArguments() {
    const developMode = this.isDevelopMode();
    return developMode ? '_dev' : '';
  },
  isAutoUpdateMode() {
    return process.argv.includes('auto_update_only');
  }
};

export default funcs;
