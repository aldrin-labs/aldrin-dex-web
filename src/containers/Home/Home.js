import React from 'react';
import { Link, Route } from 'react-router-dom';
import NavBar from '../../components/NavBar'
import CoinMarketCap from '../CoinMarketCap'
// import Layout from './Layout'

const Home = () => {
  return (
    <div>
      <NavBar />
      <CoinMarketCap />
    </div>
  );
};

export default Home;
