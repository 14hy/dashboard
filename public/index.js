import { connectRoute } from './utils/router.js';
import './pages/page-home.js';
import './pages/page-login.js';

const init = () => {
  connectRoute();
};

init();