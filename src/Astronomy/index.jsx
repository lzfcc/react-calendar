import React from 'react'
import AcrV from './AcrV'
import Equator2Ecliptic from './Equator2Ecliptic'
import Longi2Lati from './Longi2Lati'
import MoonLongi from './MoonLongi'
// import  Equator2Ecliptic from './'
// import  Equator2Ecliptic from './' 

export default class Astronomy extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     Dial2: 365.2445,
  //     Angle2: 365.2445,
  //   }
  //   // this.handleDial = this.handleDial.bind(this)
  //   // this.handleAngle = this.handleAngle.bind(this)
  // }

  // InputDial() {
  //   return (
  //     <span className='year-select'>
  //       <span>天頂距<n>度</n></span>
  //       <input className='width3'
  //         value={this.state.Dial1}
  //         onChange={(e) => {
  //           this.setState({ Dial1: e.currentTarget.value });
  //         }}
  //       />
  //       <span> 週天<n>度</n></span>
  //       <input className='width3'
  //         value={this.state.Dial2}
  //         onChange={(e) => {
  //           this.setState({ Dial2: e.currentTarget.value });
  //         }}
  //       />
  //     </span>
  //   );
  // }
  // InputAngle() {
  //   return (
  //     <span className='year-select'>
  //       <span>晷長<n>尺</n></span>
  //       <input className='width3'
  //         value={this.state.Angle1}
  //         onChange={(e) => {
  //           this.setState({ Angle1: e.currentTarget.value });
  //         }}
  //       />
  //       <span> 週天<n>度</n></span>
  //       <input className='width3'
  //         value={this.state.Angle2}
  //         onChange={(e) => {
  //           this.setState({ Angle2: e.currentTarget.value });
  //         }}
  //       />
  //     </span>
  //   );
  // }




  // handleDial() {
  //   try {
  //     const Print = Angle2DialWest(this.state.Dial1, this.state.Dial2)
  //     this.setState({ outputDial: Print })
  //   } catch (e) {
  //     alert(e.message)
  //   }
  // }
  // handleAngle() {
  //   try {
  //     const Print = Dial2AngleWest(this.state.Angle1, this.state.Angle2)
  //     this.setState({ outputAngle: Print })
  //   } catch (e) {
  //     alert(e.message)
  //   }
  // }

  // ResultDial() {
  //   if (!this.state.outputDial) {
  //     return null
  //   }
  //   return (
  //     <div className='ans'>
  //       <p>{this.state.outputDial}</p>
  //     </div>
  //   )
  // }
  // ResultAngle() {
  //   if (!this.state.outputAngle) {
  //     return null
  //   }
  //   return (
  //     <div className='ans'>
  //       <p>{this.state.outputAngle}</p>
  //     </div>
  //   )
  // }


  render() {
    return (
      <section className='modulo'>
        <h2>躔離之什</h2>
        <AcrV />
        <h2>日軌之什</h2>
        <Equator2Ecliptic />
        <Longi2Lati />
        <h2>月軌之什</h2>
        <MoonLongi />
        {/* <h3>天頂距 ⇌ 晷長</h3>
        <p className='note'>晷長單位爲尺，表高 8 尺。有效晷長範圍：0—50 尺，有效天頂距範圍：0—85 度。天頂距<n>戴日之北度</n> = 黃道去極度 - (象限 - 緯度)，象限 = 恆星年/4，<u>陽城</u>緯度<n>北極出地高度</n> 34.475<span className='decimal64'>.64</span></p>
        {this.InputDial()}
        <button onClick={this.handleDial} className='button4-5'>angle2length</button>
        {this.ResultDial()}
        <p></p>
        {this.InputAngle()}
        <button onClick={this.handleAngle} className='button4-5'>length2angle</button>
        {this.ResultAngle()} */}
      </section>
    )
  }
}