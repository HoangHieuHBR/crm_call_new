import HomeTab from '../screens/home/HomeTab';
import MissedCallTab from '../screens/home/MissedCallTab';
import SearchTab from '../screens/home/SearchTab';
import ContactTab from '../screens/home/ContactTab';

export const routeName = {
  HOME: '/home',
  MISSED_CALL: '/missed_call',
  SEARCH: '/search',
  CONTACTS: '/contacts'
};

export const routes = [
  {
    path: routeName.HOME,
    exact: true,
    content: HomeTab,
    commonKey: 'home_container'
  },
  {
    path: routeName.MISSED_CALL,
    content: MissedCallTab,
    commonKey: 'missed_call_container'
  },
  {
    path: routeName.SEARCH,
    content: SearchTab,
    commonKey: 'search_container'
  },
  {
    path: routeName.CONTACTS,
    content: ContactTab,
    commonKey: 'contacts_container'
  }
];
