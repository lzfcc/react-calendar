import React from 'react'
import { bindPos_vsop_Print } from '../../Cal/modern/vsop_elp_bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 2421333,
      b: 116.428,
      Latitude: 39.906,
      h: 0.06
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>UT1+0儒略日</span>
        <input className='width4'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
        <span>地理經度</span>
        <input className='width3'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span>緯度</span>
        <input className='width3'
          value={this.state.Latitude}
          onChange={e => {
            this.setState({ Latitude: e.currentTarget.value });
          }}
        />
        <span>海拔</span>
        <input className='width3'
          value={this.state.h}
          onChange={e => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
        <span>km</span>
      </span>
    );
  }

  handle() {
    try {
      const Print1 = bindPos_vsop_Print(this.state.a, this.state.b, this.state.Latitude, this.state.h)
      this.setState({ Print1 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.Print1) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <table>
          <tr>
            <th></th>
            <th>視赤經</th>
            <th>視赤緯</th>
            <th>視極黃經</th>
            <th>視極黃緯</th>
            <th>視黃經</th>
            <th>視黃緯</th>
            <th>地平經</th>
            <th>地平緯</th>
          </tr>
          {(this.state.Print1 || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => {
                  return (<td style={{ whiteSpace: 'pre-wrap' }}>{d}</td>)
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
        <h3>VSOP87 ELP2000 曆表</h3>
        {this.input()}
        <button onClick={this.handle} className='button1'>七政黃赤經緯</button>
        {this.result()}
      </div>
    )
  }
}