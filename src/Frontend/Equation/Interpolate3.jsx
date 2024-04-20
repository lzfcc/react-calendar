import React from "react";
import { Interpolate3 } from "Cal";

export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      n: 11.36116,
      initial: "1.124,1.27;2.5873,4.38882;3.93,9.63882;7.98,64.899;12.68,565",
    };
    this.handle = this.handle.bind(this);
  }

  input() {
    return (
      <span className="year-select">
        <span>n</span>
        <input
          className="width4"
          value={this.state.n}
          onChange={(e) => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 數列</span>
        <input
          className="width5"
          value={this.state.initial}
          onChange={(e) => {
            this.setState({ initial: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const arr = this.state.initial.split(";").filter(Boolean); // TODO: no array length validation?
      const points = arr.map((s) => s.split(",").map((x) => Number(x))); // "1.2,3.4" => ["1.2", "3.4"] => [1.2, 3.4]
      // TODO: Strictly speaking, Number(x) will lose precision, if you intend to calculate with high precision,
      // you should keep string and pass into Interpolate3, it will handle the conversion.
      const { Print } = Interpolate3(this.state.n, points, true);
      this.setState({ output: Print });
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
        <p>數列中依次輸入各組 x, y 値。拉格朗日不等間距內插公式：y = Σ(n,1) yiLi, Li = Π(n,j=1,j≠i) (x-xj)/(xi-xj)</p>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>拉格朗日內插</h3>
        <h4>不等間距高次內插</h4>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          Lagrange
        </button>
        <span className="Deci64">.64</span>
        {this.result()}
      </div>
    );
  }
}
