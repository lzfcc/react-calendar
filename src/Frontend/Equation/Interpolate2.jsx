import React from "react";
import { Interpolate2 } from "Cal";

export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Interpolate2N: 1.12345678,
      Interpolate2Raw: "18588,4458,2840,1160,180",
      Interpolate20: 289943,
    };
    this.handle = this.handle.bind(this);
  }

  input() {
    return (
      <span className="year-select">
        <span>n</span>
        <input
          className="width4"
          value={this.state.Interpolate2N}
          onChange={(e) => {
            this.setState({ Interpolate2N: e.currentTarget.value });
          }}
        />
        <span>
          {" "}
          f<sub>0</sub>
        </span>
        <input
          className="width4"
          value={this.state.Interpolate20}
          onChange={(e) => {
            this.setState({ Interpolate20: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 差分</span>
        <input
          className="width5"
          value={this.state.Interpolate2Raw}
          onChange={(e) => {
            this.setState({ Interpolate2Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const arr = this.state.Interpolate2Raw.split(/;|,|，|。|；|｜| /)
        .filter(Boolean) // TODO: no array length validation?
        .map((x) => Number(x));
      const { yPrint } = Interpolate2(
        this.state.Interpolate2N,
        this.state.Interpolate20,
        arr,
        true
      );
      this.setState({ output: yPrint });
    } catch (e) {
      alert(e.message);
    }
  }

  result() {
    if (!this.state.output) {
      return null;
    }
    return (
      <div className="ans" style={{ whiteSpace: "pre-wrap" }}>
        <p>已知差分（由低次到高次排列），求 y(n)。次數爲差分的箇數。第一箇數的 n 是 0，上面的是 1</p>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.input()}
        <button onClick={this.handle} className="button4-5">
          朱世傑
        </button>
        <span className="Deci64">.64</span>
        {this.result()}
      </div>
    );
  }
}
