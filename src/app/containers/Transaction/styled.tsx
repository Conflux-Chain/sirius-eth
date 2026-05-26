import styled from 'styled-components';

export const TagWrapper = styled.div`
  margin-left: 12px;
  padding: 3px 8px;
  background-color: var(--theme-color-primary-button-bg);
  font-size: 10px;
  text-align: center;
  color: #fff;
  line-height: 18px;
  font-weight: 450;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

export const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
  .content-wrapper {
    position: relative;
    .raw-tx-json-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 3.2857rem;
      display: flex;
      align-items: center;
      .raw-tx-json {
        cursor: pointer;
        background: #fefefe;
        border: 1px solid #ebeced;
        height: 32px;
        display: flex;
        align-items: center;
        border-radius: 16px;
        color: #686c7e;
        padding: 0 16px;
      }
    }
  }
`;

export const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  .overview-cross {
    width: fit-content;
    margin-left: 16px;
    line-height: 32px;
    display: flex;
    align-items: center;
    background: #fff;
    font-weight: 400;
    border-radius: 16px;
    padding: 0px 12px;
    gap: 8px;
    font-size: 14px;
    img {
      width: 16px;
      height: 16px;
    }
  }
`;
