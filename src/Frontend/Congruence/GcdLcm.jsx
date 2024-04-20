import React from "react"
import { GcdLcmGroup } from "../../Cal/congruence/gcdlcm.mjs"
export default class a extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      GcdLcmIn: "4,6,8,18"
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className="year-select width5">
        <input
          value={this.state.GcdLcmIn}
          onChange={e => {
            this.setState({ GcdLcmIn: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      let arr = this.state.GcdLcmIn.split(/;|,|，|。|；|｜| /).filter(Boolean)
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Number(arr[i])
      }
      const { Print } = GcdLcmGroup(arr);
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
        <p>求多個整數或小數的最大公因數 gcd、最小公倍數 lcm</p>
        <p>{this.state.output}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h3>最大公因數　最小公倍數</h3>
        {this.input()}
        <button onClick={this.handle} className="button4-6">
          try
        </button><span className="Deci64">.64</span>
        {this.result()}
      </div>
    );
  }
}
