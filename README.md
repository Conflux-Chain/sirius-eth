<h1 align="center">Conflux Scan</h1>

<p align="center">Blockchain Explorer for Conflux Network.</p>

Source code of [Conflux Scan](https://confluxscan.io)

## environment

```
node >= 18.18.2
npm >= 9.8.1
```

## install

```bash
yarn install
```

## development

```bash
# espace-mainnet: REACT_APP_EVM_MAINNET=true
yarn start:evm

# espace-testnet: REACT_APP_EVM_TESTNET=true
yarn start:evm-testnet

# espace-devnet: REACT_APP_EVM_DEVNET=true
yarn start:evm:devnet

```

## build

```bash
yarn build
```

After building, the config will be identified through the domain name, and if necessary, you can also specify environment variables to fix the use of a certain configuration.

### specify config

> Note: Please ensure that the deployed domain name is not matched, or disable the domain name matching logic in the `src/env/env-constants.ts`

```bash
yarn build REACT_APP_EVM_TESTNET=true
```

## config

> the config file is in `src/env/espace/xxx.ts`

```ts
// src/env/espace/xxx.ts
export const ENV_NETWORK_ID = 1030;
export const ENV_NETWORK_TYPE = NETWORK_TYPES.EVM_MAINNET;
export const ENV_API_HOST =
  API_HOST_MAP.openAPIHost ||
  (IS_STAGE
    ? `https://evmapi-stage.confluxscan${DOMAIN}`
    : `https://evmapi.confluxscan${DOMAIN}`);
export const ENV_CORE_API_HOST =
  API_HOST_MAP.secondaryOpenAPIHost ||
  (IS_STAGE
    ? `https://api-stage.confluxscan${DOMAIN}`
    : `https://api.confluxscan${DOMAIN}`);
export const ENV_CORE_SCAN_HOST =
  API_HOST_MAP.secondaryBackendAPIHost ||
  (IS_STAGE
    ? `https://www-stage.confluxscan${DOMAIN}`
    : `https://www.confluxscan${DOMAIN}`);
export const ENV_RPC_SERVER =
  API_HOST_MAP.rpcHost || 'https://evm-cfxbridge.confluxrpc.com';
export const ENV_WALLET_CONFIG = {
  chainId: ENV_NETWORK_ID,
  chainName: 'Conflux eSpace',
  rpcUrls: ['https://evm.confluxrpc.com'],
  blockExplorerUrls: ['https://evm.confluxscan.io/'],
  nativeCurrency: {
    name: 'Conflux',
    symbol: 'CFX',
    decimals: 18,
  },
};
export const ENV_LOGO = logo;
```

## add chain

> Note: only support evm network

1. You can copy the `src/env/espace` folder, name it the chain you plan to add, and modify its configuration.
   ```ts
   // src/env/demo/mainnet.ts
   export const ENV_NETWORK_ID = 11111111;
   export const ENV_NETWORK_TYPE = NETWORK_TYPES.DEMO_MAINNET;
   export const ENV_API_HOST =
     API_HOST_MAP.openAPIHost ||
     (IS_STAGE
       ? `https://demoapi-stage.confluxscan${DOMAIN}`
       : `https://demoapi.confluxscan${DOMAIN}`);
   export const ENV_CORE_API_HOST =
     API_HOST_MAP.secondaryOpenAPIHost ||
     (IS_STAGE
       ? `https://api-stage.confluxscan${DOMAIN}`
       : `https://api.confluxscan${DOMAIN}`);
   export const ENV_CORE_SCAN_HOST =
     API_HOST_MAP.secondaryBackendAPIHost ||
     (IS_STAGE
       ? `https://www-stage.confluxscan${DOMAIN}`
       : `https://www.confluxscan${DOMAIN}`);
   export const ENV_RPC_SERVER =
     API_HOST_MAP.rpcHost || 'https://demo-cfxbridge.confluxrpc.com';
   export const ENV_WALLET_CONFIG = {
     chainId: ENV_NETWORK_ID,
     chainName: 'Conflux Demo Space',
     rpcUrls: ['https://demo.confluxrpc.com'],
     blockExplorerUrls: ['https://demo.confluxscan.io/'],
     nativeCurrency: {
       name: 'Conflux Demo',
       symbol: 'CDS',
       decimals: 18,
     },
   };
   export const ENV_LOGO = logo;
   ```
2. add environment variables in package.json's scripts for development
   ```json
   "scripts": {
     "start:demo": "NODE_OPTIONS=--openssl-legacy-provider REACT_APP_DEMO_MAINNET=true react-app-rewired start",
   },
   ```
3. use environment variables in the `src/env/env-constants.ts` file
   ```ts
   export const IS_DEMO_MAINNET =
     process.env.REACT_APP_DEMO_MAINNET === 'true' ||
     /^demo[.-]/.test(window.location.hostname);
   ```
4. use the chain config in the `src/env/index.ts` file
   ```ts
   const ENV_CONFIG = (() => {
     if (IS_DEMO_MAINNET) {
       return DEMO_MAINNET_CONFIG;
     } else if (IS_DEMO_TESTNET) {
       return DEMO_TESTNET_CONFIG;
     } else if (IS_DEMO_DEVNET) {
       return DEMO_DEVNET_CONFIG;
     }
     // ...
     return DEFAULT_NETWORK_CONFIG;
   })();
   ```
5. set network option in `src/utils/constants.ts`
   ```ts
   export const NETWORK_OPTIONS = lodash.compact([
     // demo
     {
       name: 'Demo Mainnet',
       id: 11111111,
       url: `//demo.confluxscan${DOMAIN}`,
     },
     {
       name: 'Demo Testnet',
       id: 11111112,
       url: IS_STAGE
         ? '//testnet-stage.demoscan.net'
         : `//demo-testnet.confluxscan${DOMAIN}`,
     },
     IS_DEVNET && {
       name: 'Demo Devnet',
       id: 11111113,
       url: `//demo-devnet.confluxscan${DOMAIN}`,
     },
   ]);
   ```
6. setup proxy in `src/setupProxy.js` for development
   ```ts
   const configs = {
     demo_mainnet_url: 'https://demo.confluxscan.net/',
     demo_testnet_url: 'https://demo-testnet.confluxscan.io/',
     demo_devnet_url: 'https://demo-devnet.confluxscan.net/',
   };
   let url = configs.demo_mainnet_url;
   if (process.env.REACT_APP_DEMO_TESTNET === 'true') {
     url = configs.demo_testnet_url;
   } else if (process.env.REACT_APP_DEMO_DEVNET === 'true') {
     url = configs.demo_devnet_url;
   }
   ```
7. start development
   ```bash
   yarn start:demo
   ```

## What can I do?

Conflux Scan is still in its early stages compared to [Etherscan](https://etherscan.io). So
there's a lot features and improvements waiting there. You can find bugs,
request new features, send PRs to improve the code and docs. Don't forget to
check out the [Conflux Bounty](https://bounty.confluxnetwork.org) to earn reward
while improving scan.

## Contributing

Please make sure to read the [Contributing Guide](.github/CONTRIBUTING.md) before making a pull request.

## License

[MIT](http://opensource.org/licenses/MIT)
