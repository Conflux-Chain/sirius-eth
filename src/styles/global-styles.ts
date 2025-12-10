import styled, { createGlobalStyle } from 'styled-components';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import {
  sansSerifFont,
  monospaceFont,
  blue0,
  blue1,
  blue2,
  blue3,
  blue4,
  gray0,
  gray1,
  gray2,
  gray3,
  gray4,
  green0,
  green1,
  green2,
  green3,
  orange0,
  black0,
} from './variable';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`

  body {
    --wcm-z-index: 1111;
    --theme-color-blue0: ${blue0};
    --theme-color-blue1: ${blue1};
    --theme-color-blue2: ${blue2};
    --theme-color-blue3: ${blue3};
    --theme-color-blue4: ${blue4};
    --theme-color-gray0: ${gray0};
    --theme-color-gray1: ${gray1};
    --theme-color-gray2: ${gray2};
    --theme-color-gray3: ${gray3};
    --theme-color-gray4: ${gray4};
    --theme-color-green0: ${green0};
    --theme-color-green1: ${green1};
    --theme-color-green2: ${green2};
    --theme-color-green3: ${green3};
    --theme-color-orange0: ${orange0};
    --theme-color-black0: ${black0};
    --theme-color-primary: ${theme.primary};
    --theme-color-highlight-bg: ${theme.highlightBg};
    --theme-color-primary-button-bg: ${theme.antdPrimaryButtonBg};
    --theme-color-button-bg: ${theme.buttonBg};
    --theme-color-outline: ${theme.outlineColor};
    --theme-color-shadow: ${theme.shadowColor};
    --theme-color-search-button-bg: ${theme.searchButtonBg};
    --theme-color-search-button-hover-bg: ${theme.searchButtonHoverBg};
    --theme-color-gas-price-line-bg: ${theme.gasPriceLineBg};
    --theme-color-foot-bg: ${theme.footerBg};
    --theme-color-foot-highlight: ${theme.footerHighLightColor};
    --theme-color-link: ${theme.linkColor};
    --theme-color-link-hover: ${theme.linkHoverColor};
    --theme-color-chart-title: ${theme.chartTitleColor};
    --theme-color-chart-link: ${theme.chartDetailLinkColor};
  }

  html,
  body {
    box-sizing: border-box;
    font-size: 14px;
    font-weight: 400;
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${sansSerifFont};
    letter-spacing: 0;

    a {
      color: var(--theme-color-link);

      &:hover, &:active {
        color: var(--theme-color-link-hover);
      }
    }

    p,
    label {
      line-height: 1.5em;
    }

    input, select {
      font-size: inherit;
    }

    pre {
      border: none;
      margin: 0;
      padding: 0;
      word-break: break-all;
      white-space: pre-wrap;
      font-family: ${monospaceFont};
    }
  }

  #root {
    min-height: 100%;
    min-width: 100%;
    background-color: var(--theme-color-green3);
  }

  .qrcode-modal.wrapper {
    .content {
      margin: 0 auto;
    }
  }

  // override @cfxjs/antd styles
  .ant-tag > .sirius-next-tooltip + .anticon {
    margin-left: 7px;
  }
  .ant-tag-rtl.ant-tag > .sirius-next-tooltip + .anticon {
    margin-right: 7px;
    margin-left: 0;
  }
  .ant-select-item-option-grouped {
    padding-left: 12px;
    margin-left: 12px;
    margin-right: 12px;
  }

  .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    border-radius: 3px;

  }

  .ant-select-selection-item {
    color: #333333;
  }

  // image preview text
  .ant-image-mask-info {
    font-size: 0;

    > span {
      font-size: 12px
    }
  }

  // .ant-pagination-next, .ant-pagination-prev {
  //   button.ant-pagination-item-link {
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     background-color: rgba(0,84,254,0.04); 
  //     color: #74798c;
  //     border-color: rgba(0,84,254,0.04);
  //   }
  // }
  //
  // .ant-pagination-item, .ant-select:not(.ant-select-customize-input) .ant-select-selector, .ant-pagination-options-quick-jumper input {
  //   background-color: rgba(0,84,254,0.04); 
  //   color: #74798c;
  //   border-color: rgba(0,84,254,0.04);
  // }
  //
  .ant-table .ant-table-expanded-row-fixed {
    max-width: 100%;
  }

  .ant-pagination-item-active, .ant-pagination-item-active:hover {
    border-color: var(--theme-color-link);
    background-color: var(--theme-color-link);

    a {
      color: #ffffff;
    }
  }

  //
  //.ant-pagination-options-quick-jumper {
  //  input {
  //    margin-right: 0;
  //  }
  //}
  //
  .ant-table-pagination.ant-pagination {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .ant-picker-panels {
    ${media.s} {
      flex-direction: column;
    }
  }

  ${media.s} {
    //.ant-pagination-total-text {
    //  width: 100%;
    //  text-align: right;
    //}
    .ant-pagination-options {
      display: inherit;
    }
  }


  //.ant-table-thead > tr > th:not(:first-child, :last-child), .ant-table-tbody > tr > td:not(:first-child, :last-child), .ant-table tfoot > tr > th:not(:first-child, :last-child), .ant-table tfoot > tr > td:not(:first-child, :last-child) {
  //  padding: 16px 8px;
  //}
  //
  //.ant-table-thead > tr > th:last-child.ant-table-column-has-sorters {
  //  padding: 16px 8px;
  //}
  //
  //.ant-table-column-sorters {
  //  display: flex;
  //  align-items: center;
  //  padding: 0;
  //  width: 100%;
  //  justify-content: flex-end;
  //
  //  .ant-table-column-sorter {
  //    margin-top: -0.4em;
  //  }
  //}
  //
  //.ant-table-footer {
  //  background-color: #ffffff;
  //  border-top: 1px solid #f0f0f0;
  //  padding-bottom: 0;
  //}
  //
  //.ant-table-thead {
  //  & > tr > th {
  //    color: rgb(155, 158, 172);
  //    white-space: nowrap;
  //    background-color: #ffffff;
  //    border-bottom: none;
  //
  //    &.ant-table-column-sort {
  //      background: inherit;
  //    }
  //
  //    & > td {
  //      border: none;
  //    }
  //  }
  //}
  //
  //.ant-table-tbody > tr {
  //  td.ant-table-cell {
  //    border: none;
  //  }
  //
  //  td.ant-table-column-sort {
  //    background: inherit;
  //  }
  //
  //  &:not(:nth-child(odd)) {
  //    background-color: #f9fafb;
  //  }
  //
  //  &:hover {
  //    background-color: #f0f5ff;
  //
  //    td.ant-table-cell{
  //      background-color: #f0f5ff;
  //    }
  //  }
  //}
  //

  .ant-table-title {
    padding: 16px 0;
  }

  .ant-table-column-sorter {
    margin-left: 5px;
  }

  td.ant-table-column-sort {
    background: inherit;
  }

  .ant-table-wrapper.shadowed {
    .ant-table {
      box-shadow: rgb(20 27 50 / 12%) 0.8571rem 0.5714rem 1.7143rem -0.8571rem;
      padding: 0 1.1429rem 1.1429rem;
      border-radius: 4px;
    }
  }

  .ant-table-empty {
    .ant-table-tbody > tr:hover {
      background-color: transparent;
    }
  }

  .ant-picker-separator {
    display: inline-flex;
  }

  ul li:before {
    content: '' !important;
  }

  .image-preview-popover {
    line-height: 1;

    .ant-popover-inner-content {
      padding: 16px;
    }

    .info-name {
      display: flex;
      justify-content: space-between;
      margin-top: 0.8571rem;

      .name {
        height: 18px;
        min-width: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  /* ---------- ant design popover, start ---------- */
  .ant-popover-arrow {
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }

  .ant-popover-inner {
    border-radius: 5px;
    box-shadow: 8px 30px 80px 0px rgba(112, 126, 158, 0.24);
  }

  /* ---------- ant design popover, end ---------- */

  /* ---------- ant design button, start ---------- */
  .ant-btn {
    background: rgba(0, 84, 254, 0.04);
    color: #424A71;
    border: none;

    &:hover, &:focus, &:active {
      background: rgba(0, 84, 254, 0.1);
      color: #424A71;
    }
  }

  .ant-switch-checked {
    background-color: var(--theme-color-link);
  }

  .ant-btn.ant-btn-primary {
    background-color: var(--theme-color-primary-button-bg);
    color: #ffffff;
  }
  .ant-input:focus, .ant-input-focused, .ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: var(--theme-color-outline);
    box-shadow: 0 0 0 2px var(--theme-color-shadow);
  }
  .ant-input:hover, .ant-select:hover, .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
    border-color: var(--theme-color-outline);
  }

  .ant-btn {
    &:hover {
      background: var(--theme-color-button-bg);
      color: #ffffff;
    }

    &[disabled] {
      background-color: var(--theme-color-gray3);
      color: var(--theme-color-gray2);

      &:hover {
        background-color: var(--theme-color-gray0);
        color: var(--theme-color-gray2);
      }
    }
  }

  /* ---------- ant design button, end ---------- */

  /* ---------- ant design form, start ---------- */
  .ant-row.ant-form-item {
    margin-bottom: 12px;

    .ant-select-selection-item {
      text-align: left;
    }

    .ant-form-item-label > label {
      color: #74798c;
    }

    .ant-select-selection-placeholder {
      color: #d8d8d8;
    }
  }

  .ant-tooltip {
    a {
      color: var(--theme-color-blue0);

      &:hover {
        color: var(--theme-color-blue2);
      }
    }
  }

  div.ant-message-custom-content {
    display: flex;
    align-items: center;

    .anticon {
      top: 0;
    }
  }

  /* ---------- ant design form, end ---------- */

  .sirius-select-dropdown.select-dropdown {
    .option {
      height: 2.1429rem;
      color: #65709a;
      background-color: #fff;
      border: none;

      &:hover {
        border: none;
        color: #65709a;
        background-color: #f1f4f6;
      }
    }

    .option.selected {
      color: var(--theme-color-foot-highlight);
      border: none;
    }

    &.currency-select {
      max-height: 7.1429rem;
    }

    &.dropdown {
      .option.selected {
        display: none;
      }
    }
  }

  .transactionModalContainer {
    .contentContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 2.1429rem;

      .successImg {
        width: 4rem;
      }

      .submitted {
        margin-top: 0.9286rem;
        font-size: 1rem;
        color: #282D30;
      }

      .txContainer {
        margin-top: 0.8571rem;
      }

      .label {
        color: #A4A8B6;
        line-height: 1.2857rem;
        font-size: 1rem;
      }

      .content {
        color: #1e3de4;
      }
    }
  }

  ${media.s} {
    html, body {
      font-size: 12px;
    }

    .cfx-picker-dropdown {
      max-width: 90vw;

      .cfx-picker-panel-container {
        max-width: 90vw;

        .cfx-picker-month-panel {
          max-width: 90vw;
          width: 100%;
        }
      }
    }
  }

  /* to solve black line issue in Chrome */
  .skeleton::after {
    border-left: 1px solid #EFF2FA;
  }

  /* picker style reset, should be extract to a component, but need to be careful of sub component, such as Datepicker.RangePicker */
  .cfx-picker-dropdown {
    ${media.s} {
      /* special style for mobile calendar */
      left: calc(5vw) !important;
    }

    .cfx-picker-header-view {
      button:hover {
        color: #65709A;
      }
    }

    .cfx-picker-panel-container {
      border: none;
      box-shadow: 0rem 0.4286rem 1.1429rem 0rem rgba(20, 27, 50, 0.08);
    }

    .cfx-picker-cell.cfx-picker-cell-in-view.cfx-picker-cell-range-start, .cfx-picker-cell.cfx-picker-cell-in-view.cfx-picker-cell-range-end,
    .cfx-picker-cell-in-view.cfx-picker-cell-selected, .cfx-picker-cell-in-view.cfx-picker-cell-range-start, .cfx-picker-cell-in-view.cfx-picker-cell-range-end {
      .cfx-picker-cell-inner {
        background: #65709A;
      }
    }

    .cfx-picker-cell-in-view.cfx-picker-cell-today .cfx-picker-cell-inner, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-hover:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-in-range:first-child::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-edge-start:not(.cfx-picker-cell-range-hover-edge-end-near-range):not(.cfx-picker-cell-range-hover-end):not(.cfx-picker-cell-range-hover)::after, tr > .cfx-picker-cell-in-view.cfx-picker-cell-range-end:first-child::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-edge-start:not(.cfx-picker-cell-range-hover-edge-start-near-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end:not(.cfx-picker-cell-in-range):not(.cfx-picker-cell-range-start):not(.cfx-picker-cell-range-end)::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-start.cfx-picker-cell-range-start-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover-end.cfx-picker-cell-range-end-single::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-hover:not(.cfx-picker-cell-in-range)::after, .cfx-picker-cell-in-view.cfx-picker-cell-in-range::after, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-range-hover-start::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-start:not(.cfx-picker-cell-range-start-single)::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-range-hover-end::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end.cfx-picker-cell-selected::before, .cfx-picker-cell-in-view.cfx-picker-cell-range-end:not(.cfx-picker-cell-range-end-single)::before,
    .cfx-picker-cell-in-view.cfx-picker-cell-selected .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-start .cfx-picker-cell-inner, .cfx-picker-cell-in-view.cfx-picker-cell-range-end .cfx-picker-cell-inner {
      border-color: #65709A;
    }

    .cfx-picker-panel,
    .cfx-picker-date-panel,
    .cfx-picker-year-panel,
    .cfx-picker-month-panel {
      width: 100%;
    }

    table.cfx-picker-content {
      width: 100%;
      table-layout: inherit;
    }
  }

  #cfx-ui-message {
    div.icon {
      display: flex;
    }
  }

  }

  #cfx-ui-notification {
    .ant-collapse-header, .ant-collapse-content-box {
      padding: 2px 2px 0 0px !important;
      color: #999;
      display: flex;
      align-items: center;
    }

    .ant-collapse-header {
      margin-left: -2px;
    }
  }
  
  ul.highcharts-menu {
    padding: 0 !important;

    li.highcharts-menu-item {
      margin-bottom: 0;
    }
  }
`;
export const Option = styled(Select.Option)`
  &[data-highlighted] {
    background-color: var(--theme-color-green2);
    color: #fff;
  }
`;
