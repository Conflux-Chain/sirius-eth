/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from 'serviceWorker';
import { RecoilRoot } from 'recoil';
import { completeDetect } from '@cfxjs/use-wallet-react/ethereum';
import 'sanitize.css/sanitize.css';
import '@cfxjs/antd/dist/@cfxjs/antd.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

// Initialize languages
import './locales/i18n';
import ENV_CONFIG, { NETWORK_TYPES } from 'env';

const { ENV_NETWORK_TYPE } = ENV_CONFIG;

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => (
  <HelmetProvider>
    <RecoilRoot>
      <React.StrictMode>
        <Component />
      </React.StrictMode>
    </RecoilRoot>
  </HelmetProvider>
);

const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', './locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    Promise.all([completeDetect()]).then(() => {
      const App = require('./app').App;
      render(App);
    });
  });
}

Promise.all([completeDetect()]).then(() => {
  render(App);
});

const currentVersion = 'v1.10.0';

const brand = `
╔═╗┌─┐┌┐┌┌─┐┬  ┬ ┬─┐ ┬  ┌─┐╔═╗┌─┐┌─┐┌─┐┌─┐ ${currentVersion}
║  │ ││││├┤ │  │ │┌┴┬┘  ├┤ ╚═╗├─┘├─┤│  ├┤ 
╚═╝└─┘┘└┘└  ┴─┘└─┘┴ └─  └─┘╚═╝┴  ┴ ┴└─┘└─┘
 `;

if (
  ENV_NETWORK_TYPE === NETWORK_TYPES.EVM_TESTNET ||
  ENV_NETWORK_TYPE === NETWORK_TYPES.BTC_TESTNET
) {
  console.log &&
    console.log(
      `%c 
${brand}
╔╦╗╔═╗╔═╗╔╦╗  ┌┐┌┌─┐┌┬┐
 ║ ║╣ ╚═╗ ║   │││├┤  │ 
 ╩ ╚═╝╚═╝ ╩   ┘└┘└─┘ ┴
`,
      'color:#e4310c;',
    );
} else if (
  ENV_NETWORK_TYPE === NETWORK_TYPES.EVM_MAINNET ||
  ENV_NETWORK_TYPE === NETWORK_TYPES.BTC_MAINNET
) {
  console.log &&
    console.log(
      `%c 
${brand}
╔╦╗╔═╗╔╦╗╦ ╦╦ ╦╔═╗
 ║ ║╣  ║ ╠═╣╚╦╝╚═╗
 ╩ ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
`,
      'color:#1e3de4;',
    );
} else {
  console.log &&
    console.log(
      `%c 
${brand}
╔═╗╦═╗╦╦  ╦╔═╗╔╦╗╔═╗  ┌┐┌┌─┐┌┬┐
╠═╝╠╦╝║╚╗╔╝╠═╣ ║ ║╣   │││├┤  │ 
╩  ╩╚═╩ ╚╝ ╩ ╩ ╩ ╚═╝  ┘└┘└─┘ ┴
`,
      'color:#e4c01e;',
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://create-react-app.dev/docs/making-a-progressive-web-app/
// serviceWorker.register();
serviceWorker.unregister();
