const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

const scantest = 'https://scantest.confluxnetwork.org';
let stat = `${scantest}`;
let v1 = `${scantest}`;
let rpcv2 = `${scantest}/rpcv2`;
let confluxDag = `${scantest}`;

if (process.env.REACT_APP_TestNet === 'true') {
  const testnet = 'https://testnet-scantest.confluxnetwork.org';
  stat = `${testnet}`;
  v1 = `${testnet}`;
  rpcv2 = `${testnet}/rpcv2`;
  confluxDag = `${testnet}`;
} else if (process.env.REACT_APP_ETHNet === 'true') {
  const url = 'https://evmtestnet-stage.confluxscan.net/';
  // const url = 'https://evmtestnet.confluxscan.net/';
  // const url = 'https://net8889eth.confluxscan.net/';
  // const rpcBrigde = 'https://net8889eth.confluxscan.net/rpcv2';
  stat = `${url}/`;
  v1 = `${url}/`;
  rpcv2 = `${url}/rpcv2`;
  confluxDag = `${url}/`;
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
  // test api with backend dev service
  // app.use(
  //   '/v1',
  //   createProxyMiddleware({
  //     target: 'http://scan-dev-service.conflux-chain.org:8895/',
  //     changeOrigin: true,
  //     secure: false,
  //   }),
  // );
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
