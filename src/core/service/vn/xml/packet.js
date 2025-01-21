import xmlBuilder from 'xmlbuilder';
const VERSION = '20150202';
export default class Packet {
  constructor() {
    this.zipSupport = false;
  }
  extensionXml(root) {}

  xmlData(): string {
    let root = xmlBuilder.create('XML', { encoding: 'utf-8' });
    let ver = root.ele('VER', null, VERSION);
    this.extensionXml(root);
    return root.end({ pretty: true });
  }
}
