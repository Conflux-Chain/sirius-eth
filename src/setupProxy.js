const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

const scantest = 'https://evm-stage.confluxscan.net/';
let stat = `${scantest}`;
let v1 = `${scantest}`;
let rpcv2 = `${scantest}/rpcv2`;
let confluxDag = `${scantest}`;

if (process.env.REACT_APP_TestNet === 'true') {
  const testnet = 'https://evmtestnet-stage.confluxscan.net/';
  stat = `${testnet}`;
  v1 = `${testnet}`;
  rpcv2 = `${testnet}/rpcv2`;
  confluxDag = `${testnet}`;
} else if (process.env.REACT_APP_8889 === 'true') {
  const testnet = 'https://net8889eth.confluxscan.net/';
  stat = `${testnet}`;
  v1 = `${testnet}`;
  rpcv2 = `${testnet}/rpcv2`;
  confluxDag = `${testnet}`;
}

module.exports = app => {
  app.use(
    '/stat',
    createProxyMiddleware({
      target: stat,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/v1',
    createProxyMiddleware({
      target: v1,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    '/rpcv2',
    createProxyMiddleware({
      target: rpcv2,
      changeOrigin: true,
      secure: false,
    }),
  );
  app.use(
    /\/\d?\.?conflux-dag\.js/,
    createProxyMiddleware({
      target: confluxDag,
      changeOrigin: true,
      secure: false,
    }),
  );
};
