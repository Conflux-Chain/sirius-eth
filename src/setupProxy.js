const { createProxyMiddleware } = require('http-proxy-middleware');

// cra doc https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually
// http-proxy-middleware doc https://www.npmjs.com/package/http-proxy-middleware#example

const scantest = 'https://scantest.confluxnetwork.org';
let stat = `${scantest}`;
let v1 = `${scantest}`;
let rpc = `${scantest}/rpc`;
let rpcv2 = `${scantest}/rpcv2`;
let confluxDag = `${scantest}`;

if (process.env.REACT_APP_TestNet === 'true') {
  const testnet = 'https://testnet-scantest.confluxnetwork.org';
  stat = `${testnet}`;
  v1 = `${testnet}`;
  rpc = `${testnet}/rpc`;
  rpcv2 = `${testnet}/rpcv2`;
  confluxDag = `${testnet}`;
} else if (process.env.REACT_APP_PrivateNet === 'true') {
  const pos = 'https://posrc.confluxscan.net/';
  stat = pos;
  v1 = pos;
  rpc = 'https://39.100.97.209:12537/rpc';
  rpcv2 = 'https://39.100.97.209:12537/rpc';
  confluxDag = pos;
} else if (process.env.REACT_APP_ETHNet === 'true') {
  const net12000 = 'https://net12001eth.confluxscan.net/';
  stat = `${net12000}/`;
  v1 = `${net12000}/`;
  rpc = `${net12000}/rpc`;
  rpcv2 = `${net12000}/rpcv2`;
  confluxDag = `${net12000}/`;
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
    '/rpc',
    createProxyMiddleware({
      target: rpc,
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
