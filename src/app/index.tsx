/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Switch,
  Route,
  BrowserRouter,
  Redirect,
  useLocation,
  withRouter,
} from 'react-router-dom';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import WebFontLoader from 'webfontloader';
import { SWRConfig } from 'swr';
import { CfxProvider, CssBaseline } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { GlobalStyle } from 'styles/global-styles';
import { TxnHistoryProvider } from 'utils/hooks/useTxnHistory';
import { GlobalProvider, useGlobalData } from 'utils/hooks/useGlobal';
import { reqProjectConfig } from 'utils/httpRequest';
import { NETWORK_ID, CFX_TOKEN_TYPES, NETWORK_OPTIONS } from 'utils/constants';
import { isAddress } from 'utils';
import MD5 from 'md5.js';
import lodash from 'lodash';
import { getClientVersion } from 'utils/rpcRequest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Header } from './containers/Header';
import { Footer } from './containers/Footer/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { Blocks } from './containers/Blocks/Loadable';
import { Transactions } from './containers/Transactions/Loadable';
import { NotFoundPage } from './containers/NotFoundPage/Loadable';
import { NotFoundAddressPage } from './containers/NotFoundAddressPage/Loadable';
import { Tokens } from './containers/Tokens/Loadable';
import { Accounts } from './containers/Accounts/Loadable';
import { Transaction } from './containers/Transaction/Loadable';
import { Block } from './containers/Block/Loadable';
import { AddressContractDetailPage } from './containers/AddressContractDetail/Loadable';
import { GlobalNotify } from './containers/GlobalNotify';
import { Search } from './containers/Search';
// import { BalanceChecker } from './containers/BalanceChecker/Loadable';
// import { BlocknumberCalc } from './containers/BlocknumberCalc/Loadable';
// import { AddressConverter } from './containers/AddressConverter';
// import { NetworkError } from './containers/NetworkError/Loadable';
import { Contract } from './containers/Contract/Loadable';
import { TokenDetail } from './containers/TokenDetail/Loadable';

import { Loading } from '@cfxjs/sirius-next-common/dist/components/Loading';
// import { CookieTip } from './components/CookieTip';
// import { GlobalTip } from './components/GlobalTip';

// import { Swap } from './containers/Swap';
import { ContractDeployment } from './containers/ContractDeployment/Loadable';
import { ContractVerification } from './containers/ContractVerification/Loadable';
import { ABIVerification } from './containers/ABIVerification/Loadable';
import { CFXTransfers } from './containers/CFXTransfers/Loadable';
// import { PackingPage } from './containers/PackingPage/Loadable';
// import { Contracts } from './containers/Contracts/Loadable';

// import { Epoch } from './containers/Epoch/Loadable';

import { Statistics } from './containers/Statistics/Loadable';
import { BroadcastTx } from './containers/BroadcastTx/Loadable';
import { NFTChecker } from './containers/NFTChecker/Loadable';
import { Approval } from './containers/Approval/Loadable';
import { NFTDetail } from './containers/NFTDetail/Loadable';
import { Profile } from './containers/Profile/Loadable';

import {
  NewChart,
  BlockTime,
  TPS,
  HashRate,
  Difficulty,
  TotalSupply,
  CirculatingSupply,
  Tx,
  CFXTransfer,
  TokenTransfer,
  CFXHolderAccounts,
  AccountGrowth,
  ActiveAccounts,
  Contracts as ContractsCharts,
} from './containers/Charts/Loadable';
import { Chart as EIP1559Metrics } from './containers/Charts/eip1559Metrics/Loadable';

import enUS from '@cfxjs/antd/lib/locale/en_US';
import zhCN from '@cfxjs/antd/lib/locale/zh_CN';
import moment from 'moment';
import { ConfigProvider } from '@cfxjs/antd';
import 'moment/locale/zh-cn';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

import ENV_CONFIG_LOCAL, { IS_CONFLUX_FEATURE_ENABLED } from 'env';
import { useEnv } from '@cfxjs/sirius-next-common/dist/store/index';

// WebFontLoader.load({
//   custom: {
//     families: ['Circular Std:n4,i4,n7,i7,n8,i8'],
//     urls: ['/font.css'],
//   },
// });

dayjs.extend(utc);

WebFontLoader.load({
  custom: {
    families: ['Roboto Mono:n1,n2,n3,n4,n5,n6,n7'],
    urls: ['/fontmono.css'],
  },
});

BigNumber.config({ EXPONENTIAL_AT: [-18, 34] });

// @ts-ignore
window.recaptchaOptions = {
  useRecaptchaNet: true,
};

export const PageLoading = () => {
  return (
    <StyledMaskWrapper>
      <Loading></Loading>
    </StyledMaskWrapper>
  );
};

export function App() {
  const [globalData, setGlobalData] = useGlobalData();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh-cn' : 'en';
  const [loading, setLoading] = useState(true);
  const { SET_ENV_CONFIG } = useEnv();

  moment.locale(lang);
  dayjs.locale(lang);

  function _ScrollToTop(props) {
    const { pathname } = useLocation();
    useEffect(() => {
      if (pathname !== '/charts') {
        window.scrollTo(0, 0);
      }
    }, [pathname]);
    return props.children;
  }

  const ScrollToTop = withRouter(_ScrollToTop);

  useEffect(() => {
    setLoading(true);
    reqProjectConfig()
      .then(resp => {
        delete resp.referer;
        let networks = {
          ...NETWORK_OPTIONS,
        };
        if (!IS_CONFLUX_FEATURE_ENABLED) {
          networks = {
            devnet: resp.networks ?? [],
          };
        }

        const networkId = resp?.networkId;
        const md5String = new MD5().update(JSON.stringify(resp)).digest('hex');

        if (
          NETWORK_ID !== networkId ||
          localStorage.getItem(LOCALSTORAGE_KEYS_MAP.reqProjectConfigMD5) !==
            md5String
        ) {
          localStorage.setItem(LOCALSTORAGE_KEYS_MAP.networkId, networkId);
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.reqProjectConfigMD5,
            md5String,
          );
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.contracts,
            JSON.stringify(
              // @ts-ignore
              resp?.contracts.reduce(
                (prev, curr) => ({
                  ...prev,
                  [curr.key]: curr.address,
                }),
                {},
              ),
            ),
          );
          localStorage.setItem(
            LOCALSTORAGE_KEYS_MAP.apis,
            JSON.stringify({
              evmRPCHost: resp?.EVM_RPC_URL,
              rpcHost: resp?.CONFURA_URL,
              openAPIHost: resp?.OPEN_API_URL,
              secondaryOpenAPIHost: resp?.CORE_OPEN_API_URL,
              secondaryBackendAPIHost: resp?.CORE_API_URL,
            }),
          );
          // contract name tag config, hide for temp
          // localStorage.setItem(
          //   LOCALSTORAGE_KEYS_MAP.contractNameTag,
          //   JSON.stringify(
          //     // @ts-ignore
          //     resp?.contracts.reduce(
          //       (prev, curr) => ({
          //         ...prev,
          //         [curr.address]: curr.name,
          //       }),
          //       {},
          //     ),
          //   ),
          // );
          window.location.reload();
        }

        setGlobalData({
          ...globalData,
          ...(resp as object),
          networks,
        });
      })
      .catch(e => {
        console.log('request frontend config error: ', e);
      })
      .finally(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    SET_ENV_CONFIG(ENV_CONFIG_LOCAL);
    getClientVersion().then(v => {
      console.log('conflux-network-version:', v);
    });
  }, [SET_ENV_CONFIG]);

  useEffect(() => {
    const key = LOCALSTORAGE_KEYS_MAP.addressLabel;
    const keyTx = LOCALSTORAGE_KEYS_MAP.txPrivateNote;
    const data = globalData;

    // address label
    if (!data[key]) {
      let dStr = localStorage.getItem(key);
      let d = {};

      if (dStr) {
        d = JSON.parse(dStr).reduce((prev, curr) => {
          return {
            ...prev,
            [curr.a]: curr.l,
          };
        }, {});
      }

      const _globalData = { ...globalData, [key]: d };
      setGlobalData(_globalData);
    }

    // private tx note
    if (!data[keyTx]) {
      let dStrTx = localStorage.getItem(keyTx);
      let dTx = {};

      if (dStrTx) {
        dTx = JSON.parse(dStrTx).reduce((prev, curr) => {
          return {
            ...prev,
            [curr.h]: curr.n,
          };
        }, {});
      }

      const _globalData = { ...globalData, [keyTx]: dTx };
      setGlobalData(_globalData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalData]);

  // @todo, add loading for request frontend config info
  return (
    <GlobalProvider>
      <ConfigProvider locale={i18n.language.includes('zh') ? zhCN : enUS}>
        <TxnHistoryProvider
          value={{
            config: {
              // txn history record i18n handler
              convert: info => {
                try {
                  let data = JSON.parse(info);
                  return t(
                    translations.connectWallet.notify.action[data.code],
                    data,
                  );
                } catch (e) {}
              },
            },
          }}
        >
          <SWRConfig
            value={{
              // disable auto polling, reconnect or retry
              revalidateOnFocus: false,
              revalidateOnReconnect: false,
              refreshInterval: 0,
              shouldRetryOnError: false,
              errorRetryCount: 0,
            }}
          >
            {/* @ts-ignore */}
            <BrowserRouter>
              <CfxProvider
                theme={{
                  breakpoints: {
                    xs: {
                      min: '0',
                      max: '600px',
                    },
                    sm: {
                      min: '600px',
                      max: '1024px',
                    },
                    md: {
                      min: '1024px',
                      max: '1280px',
                    },
                    lg: {
                      min: '1280px',
                      max: '1440px',
                    },
                    xl: {
                      min: '1440px',
                      max: '10000px',
                    },
                  },
                }}
              >
                <CssBaseline />
                <Helmet
                  titleTemplate="%s - ConfluxScan"
                  defaultTitle="ConfluxScan"
                >
                  <meta
                    name="description"
                    content={t(translations.metadata.description)}
                  />
                </Helmet>
                {loading ? (
                  <PageLoading />
                ) : (
                  <>
                    <Header />
                    <Main key={lang}>
                      <ScrollToTop>
                        <Switch>
                          <Route exact path="/" component={HomePage} />
                          <Route exact path="/blocks" component={Blocks} />
                          <Route exact path="/block/:hash" component={Block} />
                          <Route exact path="/txs" component={Transactions} />
                          <Route
                            exact
                            path="/tx/:hash"
                            component={Transaction}
                          />
                          <Route exact path="/accounts" component={Accounts} />
                          <Route exact path="/tokens" component={Tokens} />
                          <Route
                            exact
                            path="/tokens-nft"
                            render={(routeProps: any) => {
                              routeProps.match.params.tokenType =
                                CFX_TOKEN_TYPES.erc721;
                              return <Tokens {...routeProps} />;
                            }}
                          />
                          <Route
                            exact
                            path="/tokens-nft1155"
                            render={(routeProps: any) => {
                              routeProps.match.params.tokenType =
                                CFX_TOKEN_TYPES.erc1155;
                              return <Tokens {...routeProps} />;
                            }}
                          />
                          <Route
                            path="/address/:address"
                            render={(routeProps: any) => {
                              const address = routeProps.match.params.address;

                              if (isAddress(address, false)) {
                                if (/[A-Z]/.test(address)) {
                                  return (
                                    <Redirect
                                      to={`/address/${address.toLowerCase()}`}
                                    />
                                  );
                                }
                                return (
                                  <AddressContractDetailPage {...routeProps} />
                                );
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }}
                          />
                          <Route
                            exact
                            path="/notfound/:contractAddress"
                            component={NotFoundAddressPage}
                          />
                          <Route path="/search/:text" component={Search} />
                          <Route
                            exact
                            path="/token/:tokenAddress"
                            render={(routeProps: any) => {
                              const address =
                                routeProps.match.params.tokenAddress;

                              if (isAddress(address, false)) {
                                if (/[A-Z]/.test(address)) {
                                  return (
                                    <Redirect
                                      to={`/token/${address.toLowerCase()}`}
                                    />
                                  );
                                }

                                return <TokenDetail {...routeProps} />;
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }}
                          />
                          <Route
                            exact
                            path="/contract-deployment"
                            component={ContractDeployment}
                          />
                          <Route
                            exact
                            path="/contract-verification"
                            component={ContractVerification}
                          />
                          <Route
                            exact
                            path="/abi-verification"
                            component={ABIVerification}
                          />
                          <Route
                            exact
                            path="/push-tx"
                            component={BroadcastTx}
                          />
                          <Route
                            exact
                            path="/cfx-transfers"
                            component={CFXTransfers}
                          />
                          <Route
                            exact
                            path={[
                              '/contract-info/:contractAddress',
                              '/token-info/:contractAddress',
                            ]}
                            render={(routeProps: any) => {
                              const address =
                                routeProps.match.params.contractAddress;

                              const path = routeProps.match.path.match(
                                /(\/.*\/)/,
                              )[1];

                              if (isAddress(address, false)) {
                                if (/[A-Z]/.test(address)) {
                                  return (
                                    <Redirect
                                      to={`${path}${address.toLowerCase()}`}
                                    />
                                  );
                                }

                                return <Contract {...routeProps} />;
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }}
                          />
                          <Route
                            exact
                            path={['/nft-checker', '/nft-checker/:address']}
                            render={(routeProps: any) => {
                              const address = routeProps.match.params.address;

                              if (
                                lodash.isNil(address) ||
                                isAddress(address, false)
                              ) {
                                if (
                                  !lodash.isNil(address) &&
                                  /[A-Z]/.test(address)
                                ) {
                                  return (
                                    <Redirect
                                      to={`/nft-checker/${address.toLowerCase()}`}
                                    />
                                  );
                                }

                                return <NFTChecker {...routeProps} />;
                              } else {
                                return <Redirect to={`/notfound/${address}`} />;
                              }
                            }}
                          />

                          <Route
                            exact
                            path="/eip-1559-metrics"
                            component={EIP1559Metrics}
                          />

                          <Route
                            exact
                            path="/statistics"
                            render={() => (
                              <Redirect to="/statistics/overview" />
                            )}
                          />
                          <Route
                            exact
                            path="/statistics/:statsType"
                            component={Statistics}
                          />
                          <Route
                            exact
                            path="/nft/:address/:id"
                            component={NFTDetail}
                          />

                          <Route exact path="/charts" component={NewChart} />

                          <Route
                            exact
                            path="/charts/blocktime"
                            component={BlockTime}
                          />

                          <Route exact path="/charts/tps" component={TPS} />

                          <Route
                            exact
                            path="/charts/hashrate"
                            component={HashRate}
                          />

                          <Route
                            exact
                            path="/charts/difficulty"
                            component={Difficulty}
                          />

                          <Route
                            exact
                            path="/charts/supply"
                            component={TotalSupply}
                          />

                          <Route
                            exact
                            path="/charts/circulating"
                            component={CirculatingSupply}
                          />

                          <Route exact path="/charts/tx" component={Tx} />

                          <Route
                            exact
                            path="/charts/token-transfer"
                            component={TokenTransfer}
                          />

                          <Route
                            exact
                            path="/charts/cfx-transfer"
                            component={CFXTransfer}
                          />

                          <Route
                            exact
                            path="/charts/cfx-holder-accounts"
                            component={CFXHolderAccounts}
                          />

                          <Route
                            exact
                            path="/charts/account-growth"
                            component={AccountGrowth}
                          />

                          <Route
                            exact
                            path="/charts/active-accounts"
                            component={ActiveAccounts}
                          />

                          <Route
                            exact
                            path="/charts/contracts"
                            component={ContractsCharts}
                          />

                          <Route exact path="/Profile" component={Profile} />

                          <Route
                            exact
                            path={['/approval']}
                            component={Approval}
                          />

                          {/* <Route
                            exact
                            path="/packing/:txHash"
                            component={PackingPage}
                          />
                          <Route
                            exact
                            path="/contracts"
                            component={Contracts}
                          />
                          <Route
                            exact
                            path="/registered-contracts"
                            component={RegisteredContracts}
                          />
                          <Route
                            exact
                            path="/epoch/:number"
                            component={Epoch}
                          />
                          <Route exact path="/swap" component={Swap} />
                          <Route
                            exact
                            path={[
                              '/address-converter',
                              '/address-converter/:address',
                            ]}
                            component={AddressConverter}
                          />
                          <Route
                            exact
                            path={[
                              '/block-countdown',
                              '/block-countdown/:block',
                            ]}
                            component={BlocknumberCalc}
                          />
                          <Route
                            exact
                            path="/balance-checker"
                            component={BalanceChecker}
                          />
                          <Route
                            exact
                            path={['/networkError', '/networkError/:network']}
                            component={NetworkError}
                          />
                          */}
                          <Route component={NotFoundPage} />
                        </Switch>
                      </ScrollToTop>
                    </Main>
                    <Footer />
                    <GlobalStyle />
                    {/* <CookieTip />
                    <GlobalTip tipKey="addressWarning" /> */}
                  </>
                )}
                <GlobalNotify />
              </CfxProvider>
            </BrowserRouter>
          </SWRConfig>
        </TxnHistoryProvider>
      </ConfigProvider>
    </GlobalProvider>
  );
}

const Main = styled.div`
  box-sizing: border-box;
  position: relative;
  max-width: 1368px;
  margin: 0 auto;
  padding-top: 106px;
  padding-bottom: 20px;
  min-height: calc(100vh - 260px);

  ${media.xl} {
    padding-top: 106px;
    padding-left: 10px;
    padding-right: 10px;
  }

  ${media.m} {
    padding-top: 90px;
  }

  ${media.s} {
    padding: 100px 16px 32px;
    //min-height: calc(100vh - 254px);
  }

  .link {
    color: var(--theme-color-link) !important;
  }
`;

const StyledMaskWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;
