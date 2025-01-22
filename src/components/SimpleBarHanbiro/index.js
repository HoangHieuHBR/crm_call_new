import SimpleBar from 'simplebar';
export default class SimpleBarHanbiro extends SimpleBar {
  constructor(element, options) {
    super(element, options);
  }

  getScrollTop() {
    return this.getScrollElement().scrollTop;
  }

  getScrollHeight() {
    return this.getScrollElement().scrollHeight;
  }

  getClientHeight() {
    return this.getScrollElement().clientHeight;
  }

  scrollToBottom() {
    const scroll = this.getScrollElement();
    scroll.scrollTop = scroll.scrollHeight;
  }

  smoothScrollToBottom() {
    const scroll = this.getScrollElement();
    scroll.scrollTo({ top: scroll.scrollHeight, behavior: 'smooth' });
  }

  scrollTo(y) {
    const scroll = this.getScrollElement();
    scroll.scrollTop = y;
  }
  smoothScrollTo(y) {
    const scroll = this.getScrollElement();
    scroll.scrollTo({ top: y, behavior: 'smooth' });
  }
}
