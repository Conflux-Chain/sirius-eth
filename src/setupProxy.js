const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

const configs = {
  evm_mainnet_url: 'https://evm.confluxscan.net/',
  evm_testnet_url: 'https://evmtestnet-stage.confluxscan.net/',
  evm_devnet_url: 'https://net8889eth.confluxscan.net/',
  // TODO-btc
  btc_mainnet_url: 'https://evm.confluxscan.net/',
  btc_testnet_url: 'https://evmtestnet-stage.confluxscan.net/',
  btc_devnet_url: 'https://net8889eth.confluxscan.net/',
};

let url = configs.evm_mainnet_url;
if (process.env.REACT_APP_EVM_TESTNET === 'true') {
  url = configs.evm_testnet_url;
} else if (process.env.REACT_APP_EVM_DEVNET === 'true') {
  url = configs.evm_devnet_url;
} else if (process.env.REACT_APP_BTC_MAINNET === 'true') {
  url = configs.btc_mainnet_url;
} else if (process.env.REACT_APP_BTC_TESTNET === 'true') {
  url = configs.btc_testnet_url;
} else if (process.env.REACT_APP_BTC_DEVNET === 'true') {
  url = configs.btc_devnet_url;
}

module.exports = app => {
  app.use(
    '/stat',
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/v1',
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpcv2',
    createProxyMiddleware({
      target: `${url}/rpcv2`,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target: url,
      changeOrigin: true,
      secure: false,
    }),
  );
};
