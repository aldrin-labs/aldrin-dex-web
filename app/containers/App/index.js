import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import H1 from '../../components/H1';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const App = props => {
  const { classes } = props;
  return (
    <AppWrapper>
      <H1>123</H1>
    </AppWrapper>
  );
};

export default App;
