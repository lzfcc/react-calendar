import React from 'react'
import { bindPos_vsop_Print } from '../../Cal/modern/vsop_elp.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 2421333,
      b: 116.428
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>UT1儒略日</span>
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
      </span>
    );
  }

  handle() {
    try {
      const Print1 = bindPos_vsop_Print(this.state.a, this.state.b)
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
            <th>赤經</th>
            <th>赤緯</th>
            <th>極黃經</th>
            <th>極黃緯</th>
            <th>黃經</th>
            <th>黃緯</th>
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