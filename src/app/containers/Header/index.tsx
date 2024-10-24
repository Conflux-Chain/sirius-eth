/**
 *
 * Header
 *
 */

import React, { memo } from 'react';
import lodash from 'lodash';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Search } from './Search';
import { ConnectWallet } from 'app/components/ConnectWallet';
import {
  useBreakpoint,
  media,
} from '@cfxjs/sirius-next-common/dist/utils/media';
import { Nav } from 'app/components/Nav';
import { genParseLinkFn, HeaderLinks } from './HeaderLink';
import { Check } from '@zeit-ui/react-icons';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';
import { ScanEvent } from 'utils/gaConstants';
import { trackEvent } from 'utils/ga';
import { useToggle } from 'react-use';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { NetworksType } from '@cfxjs/sirius-next-common/dist/store/types';
import { getNetwork, gotoNetwork, getDomainTLD, getNetworkIcon } from 'utils';
// import { Notices } from 'app/containers/Notices/Loadable';
import { GasPriceDropdown } from '@cfxjs/sirius-next-common/dist/components/GasPriceDropdown';

import ENV_CONFIG, { IS_ESPACE, IS_MAINNET, IS_TESTNET } from 'env';

// TODO-btc: NETWORK_TYPES
export const Header = memo(() => {
  const [globalData, setGlobalData] = useGlobalData();
  const { networkId, networks } = globalData;

  const { t, i18n } = useTranslation();
  const zh = '中文';
  const en = 'EN';
  const iszh = i18n.language.includes('zh');

  const location = useLocation();
  // const contractMatched =
  //   location.pathname.startsWith('/sponsor') ||
  //   location.pathname.startsWith('/contract');
  const statisticsMatched =
    location.pathname.startsWith('/chart') ||
    location.pathname.startsWith('/statistics');
  const moreMatched =
    location.pathname.startsWith('/address-converter') ||
    location.pathname.startsWith('/push-tx') ||
    location.pathname.startsWith('/block-countdown') ||
    location.pathname.startsWith('/nft-checker');
  const blockchainMatched =
    location.pathname.startsWith('/contract') ||
    location.pathname.startsWith('/sponsor');
  const ecosystemMatched = false;

  const bp = useBreakpoint();
  const [visible, toggleMenu] = useToggle(false);

  const menuClick = () => {
    if (bp === 's' || bp === 'm') toggleMenu(false);
  };

  const supportAndHelpMenuItems = [
    {
      title: [
        t(translations.header.techIssue),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.techIssue,
      afterClick: menuClick,
      href: 'https://github.com/Conflux-Chain/sirius-eth/issues',
    },
    // {
    //   title: [
    //     t(translations.header.supportCenter),
    //     <Check size={18} key="check" />,
    //   ],
    //   name: ScanEvent.menu.action.supportCenter,
    //   afterClick: menuClick,
    //   href: iszh
    //     ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn'
    //     : 'https://confluxscansupportcenter.zendesk.com/hc/en-us',
    // },
    {
      title: [
        t(translations.header.suggestionBox),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.suggestionBox,
      afterClick: menuClick,
      href: iszh
        ? 'https://confluxscansupportcenter.zendesk.com/hc/zh-cn/requests/new'
        : 'https://confluxscansupportcenter.zendesk.com/hc/en-us/requests/new',
    },
  ];

  const ecosystemItems: any = [];

  const contractItems = [
    {
      // deploy
      title: [
        t(translations.header.contractDeployment),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.contractDeployment,
      afterClick: menuClick,
      href: '/contract-deployment',
    },
    {
      // contract verification
      title: [
        t(translations.header.contractVerification),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.contractVerification,
      afterClick: menuClick,
      href: '/contract-verification',
    },
    // {
    //   title: t(translations.header.contracts),
    //   name: ScanEvent.menu.action.contractsList,
    //   afterClick: menuClick,
    //   href: '/contracts',
    // },
  ];

  const toolItems = [
    {
      title: [
        t(translations.header.broadcastTx),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.broadcastTx,
      afterClick: menuClick,
      href: '/push-tx',
    },
    {
      title: [
        t(translations.header.nftChecker),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.nftChecker,
      afterClick: menuClick,
      href: '/nft-checker',
    },
    {
      // profile
      title: [t(translations.header.profile), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.home,
      afterClick: menuClick,
      href: '/profile',
      className: 'profile',
    },
    {
      title: [t(translations.header.approval), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.approval,
      afterClick: menuClick,
      href: '/approval',
    },
  ];

  if (IS_ESPACE && (IS_MAINNET || IS_TESTNET)) {
    const TLD = getDomainTLD();
    supportAndHelpMenuItems.unshift({
      title: [
        t(translations.header.developerAPI),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.developerAPI,
      afterClick: menuClick,
      href:
        IS_ESPACE && IS_TESTNET
          ? `https://evmapi-testnet.confluxscan.${TLD}/doc`
          : `https://evmapi.confluxscan.${TLD}/doc`,
    });

    ecosystemItems.unshift({
      title: [
        t(translations.header.stakingAndGovernance),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.stakingAndGovernance,
      afterClick: menuClick,
      href:
        IS_ESPACE && IS_TESTNET
          ? 'https://test.confluxhub.io/governance/'
          : 'https://confluxhub.io/governance/',
    });

    ecosystemItems.push({
      title: [
        t(translations.header.crossSpace),
        <Check size={18} key="check" />,
      ],
      name: ScanEvent.menu.action.crossSpace,
      afterClick: menuClick,
      href:
        IS_ESPACE && IS_TESTNET
          ? 'https://test.confluxhub.io/'
          : 'https://confluxhub.io/',
    });

    // contractItems.splice(2, 0, {
    //   // sponsor
    //   title: [
    //     t(translations.header.contractSponsor),
    //     <Check size={18} key="check" />,
    //   ],
    //   name: ScanEvent.menu.action.sponsor,
    //   afterClick: menuClick,
    //   href: '/sponsor',
    // });
  }

  if (IS_ESPACE && IS_TESTNET) {
    toolItems.unshift({
      title: [t(translations.header.faucet), <Check size={18} key="check" />],
      name: ScanEvent.menu.action.faucet,
      afterClick: menuClick,
      href: 'https://efaucet.confluxnetwork.org/',
    });
  }

  const startLinks: HeaderLinks = [
    {
      // home
      title: t(translations.header.home),
      name: ScanEvent.menu.action.home,
      afterClick: menuClick,
      href: '/',
    },
    {
      title: t(translations.header.blockchain),
      className: 'plain',
      matched: blockchainMatched,
      children: [
        {
          title: [
            t(translations.header.blockchain),
            <Check size={18} key="check" />,
          ],
          plain: true,
          children: [
            {
              // block
              title: [t(translations.header.block)],
              name: ScanEvent.menu.action.blocks,
              afterClick: menuClick,
              href: '/blocks',
            },
            {
              // txn
              title: [t(translations.header.txn)],
              name: ScanEvent.menu.action.transactions,
              afterClick: menuClick,
              href: '/txs',
            },
            {
              // accounts
              title: [
                t(translations.header.accounts),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.accounts,
              afterClick: menuClick,
              href: '/accounts',
            },
            {
              // cfx transfers
              title: [
                t(translations.header.transfers),
                <Check size={18} key="check" />,
              ],
              name: ScanEvent.menu.action.cfxTransfers,
              afterClick: menuClick,
              href: '/cfx-transfers',
            },
          ],
        },
        {
          title: [
            t(translations.header.contract),
            <Check size={18} key="check" />,
          ],
          plain: true,
          children: contractItems,
        },
      ],
    },
    {
      title: t(translations.header.tokens),
      matched: location?.pathname?.startsWith('/tokens'),
      children: [
        {
          // erc 20
          title: [
            t(translations.header.tokens20),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens20,
          afterClick: menuClick,
          href: '/tokens',
        },
        {
          // erc 721
          title: [
            t(translations.header.tokens721),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens721,
          afterClick: menuClick,
          href: '/tokens-nft',
        },
        {
          // erc 1155
          title: [
            t(translations.header.tokens1155),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tokens1155,
          afterClick: menuClick,
          href: '/tokens-nft1155',
        },
      ],
    },
    // ecosystem
    {
      title: t(translations.header.ecosystem),
      matched: ecosystemMatched,
      children: ecosystemItems,
    },
    // charts
    {
      title: t(translations.header.chartsAndStatistics),
      matched: statisticsMatched,
      children: [
        {
          title: [
            t(translations.header.charts),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.charts,
          afterClick: menuClick,
          href: '/charts',
        },
        {
          title: [
            t(translations.header.statistics),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.statistics,
          afterClick: menuClick,
          href: '/statistics',
          isMatchedFn: () => !!location?.pathname?.startsWith('/statistics'),
        },
      ],
    },
    // more
    {
      title: t(translations.header.more),
      matched: moreMatched,
      className: 'plain',
      children: [
        // {
        //   title: [
        //     t(translations.header.tools),
        //     <Check size={18} key="check" />,
        //   ],
        //   name: ScanEvent.menu.action.tools,
        //   plain: true,
        //   children: [
        //     // {
        //     //   title: [
        //     //     t(translations.header.addressConverter),
        //     //     <Check size={18} key="check" />,
        //     //   ],
        //     //   name: ScanEvent.menu.action.addressConverter,
        //     //   afterClick: menuClick,
        //     //   href: '/address-converter',
        //     // },
        //     // {
        //     //   title: [
        //     //     t(translations.header.broadcastTx),
        //     //     <Check size={18} key="check" />,
        //     //   ],
        //     //   name: ScanEvent.menu.action.broadcastTx,
        //     //   afterClick: menuClick,
        //     //   href: '/push-tx',
        //     // },
        //     {
        //       title: [
        //         t(translations.header.blocknumberCalc),
        //         <Check size={18} key="check" />,
        //       ],
        //       name: ScanEvent.menu.action.blocknumberCalc,
        //       afterClick: menuClick,
        //       href: '/block-countdown',
        //     },
        //     {
        //       title: [
        //         t(translations.header.balanceChecker),
        //         <Check size={18} key="check" />,
        //       ],
        //       name: ScanEvent.menu.action.balanceChecker,
        //       afterClick: menuClick,
        //       href: '/balance-checker',
        //     },
        //   ],
        // },
        {
          title: [
            t(translations.header.tools),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.tools,
          plain: true,
          children: toolItems,
        },
        {
          title: [
            t(translations.header.support),
            <Check size={18} key="check" />,
          ],
          name: ScanEvent.menu.action.support,
          plain: true,
          children: supportAndHelpMenuItems,
        },
      ],
    },
    // blockchain
    // {
    //   title: t(translations.header.blockchain),
    //   className: 'plain',
    //   matched: blockchainMatched,
    //   children: [
    //     {
    //       title: [
    //         t(translations.header.blockchain),
    //         <Check size={18} key="check" />,
    //       ],
    //       plain: true,
    //       children: [
    //         {
    //           // block
    //           title: [
    //             t(translations.header.block),
    //             <Check size={18} key="check" />,
    //           ],
    //           name: ScanEvent.menu.action.blocks,
    //           afterClick: menuClick,
    //           href: '/blocks',
    //         },
    //         {
    //           // txn
    //           title: [
    //             t(translations.header.txn),
    //             <Check size={18} key="check" />,
    //           ],
    //           name: ScanEvent.menu.action.transactions,
    //           afterClick: menuClick,
    //           href: '/txs',
    //         },
    //       ],
    //     },
    //     {
    //       title: [
    //         t(translations.header.contract),
    //         <Check size={18} key="check" />,
    //       ],
    //       plain: true,
    //       children: contractItems,
    //     },
    //   ],
    // },
    // // contract
    // // {
    // //   title: t(translations.header.contract),
    // //   matched: contractMatched,
    // //   children: [
    // //     {
    // //       // deploy
    // //       title: [
    // //         t(translations.header.contractDeployment),
    // //         <Check size={18} key="check" />,
    // //       ],
    // //       name: ScanEvent.menu.action.contractDeployment,
    // //       afterClick: menuClick,
    // //       href: '/contract-deployment',
    // //     },
    // //     {
    // //       // create contract
    // //       title: [
    // //         t(translations.header.contractCreation),
    // //         <Check size={18} key="check" />,
    // //       ],
    // //       name: ScanEvent.menu.action.contractReg,
    // //       afterClick: menuClick,
    // //       href: '/contract',
    // //     },
    // //     {
    // //       // sponsor
    // //       title: [
    // //         t(translations.header.contractSponsor),
    // //         <Check size={18} key="check" />,
    // //       ],
    // //       name: ScanEvent.menu.action.sponsor,
    // //       afterClick: menuClick,
    // //       href: '/sponsor',
    // //     },
    // //     {
    // //       title: t(translations.header.contracts),
    // //       name: ScanEvent.menu.action.contractsList,
    // //       afterClick: menuClick,
    // //       href: '/contracts',
    // //     },
    // //   ],
    // // },
  ];

  const getNetworkLink = (n: NetworksType) => {
    const isMatch = n.id === networkId;
    return {
      title: [
        <NetWorkWrapper key="network">
          <img src={getNetworkIcon(n.id)} alt="" />
          {n.name}
        </NetWorkWrapper>,
        isMatch && <Check size={18} key="check" />,
      ],
      onClick: () => {
        trackEvent({
          category: ScanEvent.preference.category,
          action: ScanEvent.preference.action.changeNet,
          label: n.name,
        });

        menuClick();

        setGlobalData({
          ...globalData,
          networkId: n.id,
        });

        gotoNetwork(n.url);
      },
      isMatchedFn: () => isMatch,
    };
  };

  const endLinks: HeaderLinks = [
    {
      // switch network
      name: 'switch-network',
      title: (
        <NetWorkWrapper>
          <img src={getNetworkIcon(networkId)} alt="Network" />
          {getNetwork(networks, networkId).name}
        </NetWorkWrapper>
      ),
      className: 'not-link',
      children: lodash.compact([
        {
          title: false,
          plain: true,
          vertical: true,
          children: networks.mainnet.map(getNetworkLink),
        },
        {
          title: false,
          plain: true,
          vertical: true,
          children: networks.testnet.map(getNetworkLink),
        },
        networks.devnet.length > 0 && {
          title: false,
          plain: true,
          vertical: true,
          children: networks.devnet.map(getNetworkLink),
        },
      ]),
    },
  ];

  if (bp === 'm' || bp === 's') {
    endLinks.push({
      // switch language
      title: (
        <div className="header-link-lang-title" style={{ minWidth: '2.1rem' }}>
          {iszh ? zh : en}
        </div>
      ), // level 0 title
      children: [
        {
          // en
          title: [en, !iszh && <Check size={18} key="check" />],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeLang,
              label: 'en',
            });
            menuClick();
            if (iszh) {
              i18n.changeLanguage('en');
            }
          },
          isMatchedFn: () => !iszh,
        },
        {
          // zh
          title: [zh, iszh && <Check size={18} key="check" />],
          onClick: () => {
            trackEvent({
              category: ScanEvent.preference.category,
              action: ScanEvent.preference.action.changeLang,
              label: 'zh-CN',
            });
            menuClick();
            if (!iszh) {
              i18n.changeLanguage('zh-CN');
            }
          },
          isMatchedFn: () => iszh,
        },
      ],
    });
  }

  const startLinksJSX = genParseLinkFn(startLinks);
  const endLinksJSX = genParseLinkFn(endLinks);
  const gasPriceJSX = (
    <div className="nav-gasprice">
      <GasPriceDropdown />
    </div>
  );

  const brand = (
    <LogoWrapper>
      <Link href="/">
        <img
          className="confi-logo"
          alt="conflux scan logo"
          src={ENV_CONFIG.ENV_LOGO}
        />
      </Link>
    </LogoWrapper>
  );
  const mainMenu = [...startLinksJSX];
  const topMenu = [
    bp !== 'm' && bp !== 's' && (
      <>
        <SearchWrapper>
          <Search />
        </SearchWrapper>
        {/* TODO, eth space, hide temporary */}
        <WalletWrapper>
          <ConnectWallet />
        </WalletWrapper>
      </>
    ),
    endLinksJSX,
    gasPriceJSX,
  ];

  return (
    <Wrapper>
      <Nav
        visible={visible}
        toggleMenu={toggleMenu}
        brand={brand}
        mainMenu={mainMenu}
        topMenu={topMenu}
        // subMenu={<Notices />}
      />
      {(bp === 's' || bp === 'm') && (
        <SearchWrapper>
          <Search />
        </SearchWrapper>
      )}
    </Wrapper>
  );
});

const LogoWrapper = styled.div`
  .confi-logo {
    height: 2rem;
  }

  a.link {
    display: flex;
    align-items: center;

    svg {
      ${media.m} {
        display: none;
      }
    }
  }
`;
const Wrapper = styled.header`
  .not-link {
    &:hover {
      color: #424a71 !important;
    }
  }

  .navbar-menu {
    .navbar-end {
      .navbar-item {
        .navbar-link-menu {
          .navbar-link.level-0 {
            padding: 0 0.57rem;

            svg {
              display: none;
            }
          }
        }

        &:nth-child(1) {
          flex-grow: 1;
          justify-content: flex-end;
        }
      }
    }
  }

  ${media.m} {
    .nav-gasprice {
      display: none;
    }
    .navbar-menu {
      background-color: #4a5064;
      padding: 1.64rem 5.14rem;
      padding-bottom: 3.86rem;

      .navbar-end {
        .navbar-item {
          display: flex;
          align-items: flex-start !important;
          flex-direction: row;
          align-items: baseline;

          .header-link-menu {
            padding-left: 0;
          }

          .navbar-link-menu {
            .navbar-link {
              &.level-0 {
                padding: 0.43rem 1.3rem;

                svg {
                  display: block;
                }
              }
            }
          }

          &:nth-child(1) {
            flex-grow: 0;
          }
        }
      }
    }
  }

  ${media.s} {
    .navbar-menu {
      padding-left: 3rem;
      padding-right: 3rem;
    }
  }
`;

const SearchWrapper = styled.div`
  flex-grow: 1;

  .header-search-container {
    max-width: unset;
  }

  ${media.m} {
    .header-search-container {
      position: fixed;
      flex-grow: 0;
      top: 11px;
      right: 4rem;
      left: 14rem;
      z-index: 2000;
    }
  }

  ${media.s} {
    .header-search-container {
      position: absolute;
      left: 0;
      right: 0;
      top: 5.67rem;
      z-index: 100;
    }
  }
`;

const WalletWrapper = styled.div`
  min-width: 180px;

  .connect-wallet-button.notConnected {
    .connect-wallet-button-left {
      //color: #fff;
      width: 100%;
      justify-content: center;
      //background: #424a71;
      &:hover {
        //background: #68719c;
      }
    }
  }
`;

const NetWorkWrapper = styled.div`
  display: flex;
  gap: 4px;
`;
