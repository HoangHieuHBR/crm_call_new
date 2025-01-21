import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
import allTranslation from '../language/electron.lang';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: allTranslation.text('HanbiroTalk'),
      submenu: [
        {
          label: allTranslation.text('About HanbiroTalk'),
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: allTranslation.text('Hide HanbiroTalk'),
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: allTranslation.text('Hide Others'),
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        {
          label: allTranslation.text('Show All'),
          selector: 'unhideAllApplications:',
        },
        { type: 'separator' },
        {
          label: allTranslation.text('Quit'),
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        {
          label: allTranslation.text('Undo'),
          accelerator: 'Command+Z',
          selector: 'undo:',
        },
        {
          label: allTranslation.text('Redo'),
          accelerator: 'Shift+Command+Z',
          selector: 'redo:',
        },
        { type: 'separator' },
        {
          label: allTranslation.text('Cut'),
          accelerator: 'Command+X',
          selector: 'cut:',
        },
        {
          label: allTranslation.text('Copy'),
          accelerator: 'Command+C',
          selector: 'copy:',
        },
        {
          label: allTranslation.text('Paste'),
          accelerator: 'Command+V',
          selector: 'paste:',
        },
        {
          label: allTranslation.text('Select All'),
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: allTranslation.text('View'),
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: allTranslation.text('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: allTranslation.text('View'),
      submenu: [
        {
          label: allTranslation.text('Toggle Full Screen'),
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: allTranslation.text('Window'),
      submenu: [
        {
          label: allTranslation.text('Minimize'),
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        {
          label: allTranslation.text('Close'),
          accelerator: 'Command+W',
          selector: 'performClose:',
        },
        { type: 'separator' },
        {
          label: allTranslation.text('Bring All to Front'),
          selector: 'arrangeInFront:',
        },
        { type: 'separator' },
        {
          label: allTranslation.text('Show App'),
          click: () => {
            this.mainWindow.show();
          },
        },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: allTranslation.text('Help'),
      submenu: [
        {
          label: allTranslation.text('Documentation'),
          click() {
            shell.openExternal('https://hanbiro.com');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: allTranslation.text('&File'),
        submenu: [
          {
            label: allTranslation.text('&Close'),
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: allTranslation.text('&View'),
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: allTranslation.text('Toggle &Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: allTranslation.text('Toggle &Full Screen'),
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen(),
                    );
                  },
                },
              ],
      },
      {
        label: allTranslation.text('Help'),
        submenu: [
          {
            label: allTranslation.text('Documentation'),
            click() {
              shell.openExternal('https://hanbiro.com');
            },
          },
        ],
      },
    ];

    return templateDefault;
  }
}
