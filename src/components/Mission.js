// Home.js
import Marquee from "react-fast-marquee";
import React, { Component } from 'react';
import Newsfeed from './NewsfeedMarquee';
import  API from './Api';
import { useState , useEffect } from 'react'

const Mission = ({state}) => {
  const [news, setNews] = useState([
  ]);

const newsURI = '/api/news/public'
const fetchUserNews = async() => {
  const res = await fetch (newsURI, {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
  return data
}

  function fetchNews(){
    const getNews = async () => {
      const JsonFromServer = await fetchUserNews()
      setNews(JsonFromServer)
    }
    getNews()
  }

  useEffect(() =>{
    fetchNews()
  }, [])

    return (
        <div>
          <Marquee speed={60} gradientWidth={20}><Newsfeed NewsList={news}/></Marquee>
          <div style={{ padding: 20 }}>
          <h2>Our Mission</h2>
          <p>
          Most of my friends suck with money and it's so easy to invest. I don't want to retire at the age of 40 and have no one to invite on adventures because all my mates are busy working.
          </p>
          <p>
          I see 2 common solutions for wealth aquisition. The first solution is an uphill battle against bureaucracy and paperwork creating a barrier for entry.
          The other solution is colourful and fancy but encourages gambling, immediate gratification and has hidden fees.
          </p>
          <p>
          It's my mission to offer investment advice to people I trust without it costing anything.
          </p>
          </div>
        </div>
    );
}

export default Mission;
