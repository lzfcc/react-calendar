import React from 'react'
import { bindMansion2Deg } from '../../Cal/astronomy/bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: '張5.9142',
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>宿度</span>
        <input className='width3'
          value={this.state.a}
          onChange={e => {
            this.setState({ a: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const Print = bindMansion2Deg(this.state.a)
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
      <div className='ans table2'>
        <table>
          <tr>
            <th></th>
            <th>赤道</th>
            <th>黃道</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr>
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
        {this.input()}
        <button onClick={this.handle} className='button4-6'>mansion2deg</button>
        {this.result()}
      </div>
    )
  }
}