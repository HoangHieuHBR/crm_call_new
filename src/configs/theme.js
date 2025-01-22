import { createMuiTheme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';

const FORCE_LIGHT = true;

const MODE = 'light';
const DEFAULT_FONT = '-apple-system, system-ui, BlinkMacSystemFont, sans-serif';

const DEFAULT_FONT_SIZE = 14;
const DEFAULT_PRIMARY_THEME_ID = 1;

export const ThemeSupport = [
  {
    themeId: 1,
    primary: {
      main: '#0667BD',
      light: '#dae9ff',
      dark: '#004687',
      contrastText: '#fff'
    }
  }
];

export const FontSupport = [
  'Open Sans',
  'Roboto',
  'Sans-Serif',
  'Verdana',
  'Arial',
  'Courier New',
  'Georgia',
  'Charcoal',
  'Monaco',
  'Geneva',
  'Helvetica',
  'IBM Plex Sans'
];

export const FontSizeSupport = [12, 13, 14, 15, 16];

export const createTheme = (
  font = DEFAULT_FONT,
  fontSize = DEFAULT_FONT_SIZE,
  type = MODE
) => {
  const storageDarkTheme = useSelector(state => state.setting.darkmode);
  const storageFont = useSelector(state => state.setting.font);
  const storageFontSize = useSelector(state => state.setting.fontSize);
  const storagePrimaryColor = useSelector(state => state.setting.primaryTheme);
  const themeId = storagePrimaryColor?.themeId ?? DEFAULT_PRIMARY_THEME_ID;
  const primaryTheme =
    ThemeSupport.find(item => item.themeId == themeId) ?? ThemeSupport[0];

  const themeType = FORCE_LIGHT ? 'light' : storageDarkTheme ?? type;
  const isLight = themeType == 'light';

  return createMuiTheme({
    typography: {
      fontFamily: storageFont ?? font,
      fontSize: storageFontSize ?? fontSize
    },
    palette: {
      type: themeType,
      primary: isLight ? primaryTheme.primary : primaryTheme.primary,
      background: {
        paper: isLight ? '#fff' : '#424242',
        default: isLight ? '#fff' : '#303030',
        tabBarContainer: isLight ? '#efefef' : '#424242'
      },
      text: {
        default: isLight ? '#303030' : '#fff'
      },
      divider: isLight ? '#e5e5e5' : 'rgba(255, 255, 255, 0.12)',
      dividerTabBar: isLight ? '#707070' : '#303030'
    }
  });
};
