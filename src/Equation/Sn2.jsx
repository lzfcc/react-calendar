import React from "react";
import { Sn2 } from "../Cal/equa_sn";
export default class Equa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Sn2N: 4,
      Sn2P: 2,
    };
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>n</span>
        <input className='width3'
          value={this.state.Sn2N}
          onChange={e => {
            this.setState({ Sn2N: e.currentTarget.value });
          }}
        />
        <span> p</span>
        <input className='width3'
          value={this.state.Sn2P}
          onChange={e => {
            this.setState({ Sn2P: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = Sn2(this.state.Sn2N, this.state.Sn2P)
      this.setState({ output: Print })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans'>
        <p>{this.state.output}</p>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>四角垛　方垛</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-3'>解</button>
        {this.result()}
      </div>
    );
  }
}
