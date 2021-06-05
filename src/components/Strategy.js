// Contact.js

import React, { Component } from 'react';
import Collapse from './Collapse';
class Strategy extends Component {
  render() {
    return (
        <div style={{ padding: 20 }}>
          <p>My investing advice can be broken down into a few bullet points. If you have questions, you know where to find me.</p>
          <h2>Want to be rich.</h2>
          <p>A rising tide lifts all boats. It's not a moral virtue to not be able to support yourself.</p>
          <h2>The system isn't rigged against you. Your psychology is.</h2>
          <p>You only need to be right like 4 times. Be patient and don't get pulled into FOMO(fear of missing out)</p>
          <h2>30K latte. Gamify.</h2>
          <p>You'll forget about this stuff in 2 days. Set yourself up for mini-wins that don't require heavy commitment.</p>
          <h2>Be broke.</h2>
          <p>Pay yourself first. Avoid lifestyle creep. Be happy with what you have and growing wealth will be effortless.</p>

        <h3 style={{ padding: 20 }}>Further reading if you think I'm a moron. Click to expand.</h3>
        <ul>
          <li><Collapse title={<h4>The Intelligent Investor</h4>} children={<div>Benjamin Graham<div style={{ padding: 20 }}>A long and dry rite of passage for you, if you're overly excited about making 10000% gains on your bitcoin.</div></div>}/></li>
          <li><Collapse title={<h4>The richest man in babylon</h4>} children={<div>George S. Clason<div style={{ padding: 20 }}>A short and sweet book that hammers the brilliance of compound interest and basic financial theory, into your head.</div></div>}/></li>
          <li><Collapse title={<h4>Rich dad. Poor dad</h4>} children={<div>Robert T. Kiyosaki<div style={{ padding: 20 }}>The author is a fraud but his advice in this book is legit. Rich people aquire assets, poor people aquire liabilities. Aquire assets.</div></div>}/></li>
          <li><Collapse title={<h4>The millionaire booklet</h4>} children={<div>Grant Cardone<div style={{ padding: 20 }}>Be Broke. Want to be rich. Grant cardone is probably the most motivational dude on the planet and goes over the psychology of saving.</div></div>}/></li>
          <li><Collapse title={<h4>I will teach you to be rich</h4>} children={<div>Ramit Sethi<div style={{ padding: 20 }}>The index is amazing and the author goes into how to automate your finances. I don't follow the advice strictly but it's a building block of gamifying your investment.</div></div>}/></li>
        </ul>
        </div>
    );
  }
}

export default Strategy;
