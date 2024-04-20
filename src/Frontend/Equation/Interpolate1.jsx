import React from "react";
import { Interpolate1 } from "Cal";

export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Interpolate1N: 2.12345678,
      Interpolate1Raw: "289943,308531,331577,361921,403563,461843",
    };
    this.handle = this.handle.bind(this);
  }

  input() {
    return (
      <span className="year-select">
        <span>n</span>
        <input
          className="width4"
          value={this.state.Interpolate1N}
          onChange={(e) => {
            this.setState({ Interpolate1N: e.currentTarget.value });
          }}
        />
        <p></p>
        <span> 數列</span>
        <input
          className="width5"
          value={this.state.Interpolate1Raw}
          onChange={(e) => {
            this.setState({ Interpolate1Raw: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const arr = this.state.Interpolate1Raw.split(/;|,|，|。|；|｜| /)
        .filter(Boolean) // TODO: no array length validation?
        .map((x) => Number(x));
      const { Print } = Interpolate1(this.state.Interpolate1N, arr, true);
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
        <p>在「數列」框中輸入一組離散値，數量 = 次數 + 1，以第一箇數爲起算點。「次數」爲進行幾次內插，卽幾次多項式。n 爲所求的數，第一箇離散値的 n 爲 1。內插公式的一般形式：f(x<sub>0</sub>+x) = f(x<sub>0</sub>) + Δ<sup>1</sup>x + Δ<sup>2</sup> 1/2! x (x-1) +...+ Δ<sup>p</sup> 1/p! x (x-1) ... (x-p+1)。初始値爲大衍曆晷影五次差分表</p>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>招差術</h3>
        <h4>等間距高次內插</h4>
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
