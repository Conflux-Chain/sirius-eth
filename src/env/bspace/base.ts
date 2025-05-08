import imgArrow from 'images/token/arrow-btc.svg';
const baseColor = '#F7931A';
export const ENV_THEME = {
  primary: baseColor,
  antdPrimaryButtonBg: baseColor,
  highlightBg: '#eefffb',
  buttonBg: 'rgb(247, 147, 26, 0.8)',
  outlineColor: baseColor,
  shadowColor: 'rgb(247, 147, 26, 0.2)',
  searchButtonBg: baseColor,
  searchButtonHoverBg: '#EDA54E',
  gasPriceLineBg: '#FDF4E9',
  footerBg: '#13161E',
  footerHighLightColor: baseColor,
  linkColor: baseColor,
  linkHoverColor: baseColor,
  chartColors: [baseColor, '#36B46B', '#0D2535', '#5388D8'] as const,
  mixedChartColors: [baseColor, '#36B46B', '#434348'] as const,
  pieChartColors: ['#F4BE37', baseColor, '#0D2535', '#5388D8'] as const,
  chartTitleColor: baseColor,
  chartDetailLinkColor: baseColor,
};
export const ENV_ICONS = {
  imgArrow,
};
