const funcs = {
  isEmpty(str) {
    return str == null || str == '';
  },
  isNotEmpty(str) {
    return str != null && str != '';
  },
  timeFromTimeStampSafe(time) {
    if (!time || time == '') {
      return Date.now();
    }
    if (time.length < 12) {
      return time * 1000;
    }
    return time;
  }
};

export default funcs;
