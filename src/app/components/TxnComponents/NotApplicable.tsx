import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  width: fit-content;
  background-color: rgba(171, 172, 181, 0.1);
  border-radius: 12px;
  font-size: 12px;
  color: #9b9eac;
  padding: 4px 12px;
`;

const NotApplicable = () => {
  return <StyledWrapper>Inapplicable</StyledWrapper>;
};

export default NotApplicable;
