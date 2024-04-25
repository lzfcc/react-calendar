import React from 'react'
import { bindMoonLonLat } from '../../Cal/astronomy/bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Dif: 2,
      d: 4,
      e: 4,
      f: 54
    }
    this.handle = this.handle.bind(this)
  }
  input() {
    return (
      <span className='year-select'>
        <div><span>此前經朔：入交</span>
          <input className='width3'
            value={this.state.d}
            onChange={e => {
              this.setState({ d: e.currentTarget.value });
            }}
          />
          <span>入轉</span>
          <input className='width3'
            value={this.state.e}
            onChange={e => {
              this.setState({ e: e.currentTarget.value });
            }}
          />
          <span>距冬至時間</span>
          <input className='width3'
            value={this.state.f}
            onChange={e => {
              this.setState({ f: e.currentTarget.value });
            }}
          />
        </div>
        <span>此時距經朔時間</span>
        <input className='width3'
          value={this.state.Dif}
          onChange={e => {
            this.setState({ Dif: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = bindMoonLonLat(this.state.d, this.state.e, this.state.f, this.state.Dif)
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
          <tbody>
            <tr>
              <th></th>
              <th>極白經</th>
              <th>極黃經</th>
              {/* <th>球面三角</th> */}
              {/* <th>Δ‱</th> */}
              <th>極黃緯</th>
              {/* <th>球面三角</th> */}
              {/* <th>Δ‱</th> */}
              <th>赤經</th>
              {/* <th>球面三角</th> */}
              {/* <th>Δ‱</th> */}
              <th>赤緯</th>
              {/* <th>球面三角</th> */}
              {/* <th>Δ‱</th> */}
              <th>正交極黃經</th>
              <th>白赤交點赤經</th>
              {/* <th>球面三角</th> */}
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
          </tbody>
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