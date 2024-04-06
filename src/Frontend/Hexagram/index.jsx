import React from 'react'
import HexoZhuxi from './HexoZhuxi'
import HexoZhuxiB from './HexoZhuxiB'
import HexoQinghua from './HexoQinghua'


export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <section className='modulo'>
        <h2>筮占</h2>
        <HexoZhuxi />
        <HexoZhuxiB />
        <HexoQinghua />
      </section>
    )
  }
}