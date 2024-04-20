import React from 'react'
import { bindMoonLat } from '../../Cal/astronomy/bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 5,
      b: 5,
      c: 55,
      d: 4,
      f: 54
    }
    this.handle = this.handle.bind(this)
  }
  input() {
    return (
      <span className='year-select'>
        <div>
          <span>此時：入交</span>
          <input className='width3'
            value={this.state.a}
            onChange={e => {
              this.setState({ a: e.currentTarget.value });
            }}
          />
          <span>入轉</span>
          <input className='width3'
            value={this.state.b}
            onChange={e => {
              this.setState({ b: e.currentTarget.value });
            }}
          />
          <span>距冬至時間</span>
          <input className='width3'
            value={this.state.c}
            onChange={e => {
              this.setState({ c: e.currentTarget.value });
            }}
          />
        </div>

        <span>此前經朔：入轉</span>
        <input className='width3'
          value={this.state.d}
          onChange={e => {
            this.setState({ d: e.currentTarget.value });
          }}
        />
        <span>距冬至時間</span>
        <input className='width3'
          value={this.state.f}
          onChange={e => {
            this.setState({ f: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = bindMoonLat(this.state.a, this.state.b, this.state.c, this.state.d, this.state.f)
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
      <div className='ans table2 right'>
        <table>
          <tr>
            <th></th>
            <th>極黃緯</th>
            <th>赤緯</th>
            <th>極黃經</th>
            <th>赤經</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr style={{ whiteSpace: "pre-wrap" }}>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h3>太陰緯度</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-2'>月行陰陽</button>
        {this.result()}
      </div>
    )
  }
}