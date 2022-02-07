import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from './Components/Header';
import Home from './Routes/Home';
import Search from './Routes/Search';
import Tv from './Routes/Tv';

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path={`${process.env.PUBLIC_URL}/`} element={<Home/>}/>
        <Route path={`${process.env.PUBLIC_URL}/movies/:category/:movieId`} element={<Home/>}/>
        <Route path={`${process.env.PUBLIC_URL}/tv`} element={<Tv/>}/>
        <Route path={`${process.env.PUBLIC_URL}/tv/:category/:tvId`} element={<Tv/>}/>
        <Route path={`${process.env.PUBLIC_URL}/search`} element={<Search/>}/>
      </Routes>
    </Router>
  );
}

export default App;
