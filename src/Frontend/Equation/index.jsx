import React from 'react'
import Equa1 from './Equa1'
// import Sqrt1 from './Sqrt1'
// import Sqrt3 from './Sqrt3'
import Sn1 from './Sn1'
import Sn4 from './Sn4'
import Sn3 from './Sn3'
import Interpolate1 from './Interpolate1'
import Interpolate2 from './Interpolate2'
import Interpolate3 from './Interpolate3'
import MeasureSols from './MeasureSols'
// import Polyfit from './Polyfit'

export default class Equation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <>
        <section className='modulo'>
          <h2>垛積</h2>
          <Sn1 />
          <Sn3 />
          <Sn4 />
          <h2>內插</h2>
          <Interpolate1 />
          <p></p>
          <Interpolate2 />
          <Interpolate3 />
          <MeasureSols />
          {/* <h2>擬合</h2>
          <Polyfit /> */}
          <h2>方程</h2>
          <Equa1 />
          {/* <h2>開方</h2>
        <Sqrt1 />
        <Sqrt3 /> */}
        </section>
        <hr />
        <article>
     
        </article>
      </>
    )
  }
}