import React from 'react'
import Newm_DE from './Newm_DE'
import Eph from './Eph'
import Position from './Position'

export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section>
          <Newm_DE />
        </section>
        <section className='modulo'>
          <Position />
        </section>
        <section >
          <Eph />
        </section>
        <hr />
        <article>

        </article>
      </>
    )
  }
}