import React from "react"
import { Jd2DatePrint } from '../../Cal/time/jd2date.mjs'
import { eotPrint } from '../../Cal/time/sidereal_time.mjs'
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 2421321.8,
      b: 116.428
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select">
        <span>UT1+0儒略日</span>
        <input className="width4"
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>地理經度</span>
        <input className="width3"
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Date = Jd2DatePrint(this.state.a, this.state.b);
      const { LASTPrint, LASTPrint1, LMSolarPrint, LASolarPrint, EOTPrint, Jd, DeltaT, DeltaTErr, TThms } = eotPrint(this.state.a, this.state.b)
      this.setState({ Date, LASTPrint, LASTPrint1, LMSolarPrint, LASolarPrint, EOTPrint, Jd, DeltaT, DeltaTErr, TThms });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.Date) {
      return null;
    }
    return (
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>日干支序 = mod(儒略日 -11, 60) + 1</p>
        <p>{this.state.Date}</p>
        <p>平太陽時 {this.state.LMSolarPrint} 真太陽時 {this.state.LASolarPrint} 時差 {this.state.EOTPrint}</p>
        <p>ΔT = {this.state.DeltaT} ± {this.state.DeltaTErr}s, TT儒略日 {this.state.Jd} {this.state.TThms}</p>
        <p>真恆星時 {this.state.LASTPrint} = {this.state.LASTPrint1}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>儒略日 ⇌ 日期、恆星時、太陽時</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-8">
          JD2date
        </button>
        {this.result()}
      </div>
    );
  }
}
