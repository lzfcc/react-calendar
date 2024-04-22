import React from "react"
import Deci2Clock from './Deci2Clock'
import Clock2Deci from './Clock2Deci'
import NightClock from './NightClock'
import Deci2Stage from './Deci2Stage'
import Date from './Date'
import JD from './JD'
import SC from './SC'
import Year from './Year'
import HexaZhuxi from './HexaZhuxi'
import HexaZhuxiB from './HexaZhuxiB'
import HexaQinghua from './HexaQinghua'

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <section className="modulo">
        <h2>時間</h2>
        <Deci2Clock />
        <br />
        <Clock2Deci />
        <NightClock />
        <Deci2Stage />
        <JD />
        <br />
        <Date />
        <Year />
        <br />
        <SC />
        <h2>筮占</h2>
        <HexaZhuxi />
        <HexaZhuxiB />
        <HexaQinghua />
      </section>
    );
  }
}
