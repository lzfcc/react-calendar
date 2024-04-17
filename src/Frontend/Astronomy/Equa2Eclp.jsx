import React from 'react'
import { bindEquaEclp } from '../../Cal/astronomy/bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Deg: 50,
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>距冬至度數</span>
        <input className='width3'
          value={this.state.Deg}
          onChange={e => {
            this.setState({ Deg: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Range, Print } = bindEquaEclp(this.state.Deg)
      this.setState({ outputEclp: Print, outputEclp1: Range })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.outputEclp) {
      return null
    }
    return (
      <div className='ans table2 right'>
        <p>{this.state.outputEclp1}</p>
        <table>
          <tr>
            <th></th>
            <th><bc>赤 ⇒ 黃</bc></th>
            <th>黃-赤</th>
            <th>球面三角</th>
            <th>Δ‱</th>
            <th><bc>黃 ⇒ 赤</bc></th>
            <th>赤-黃</th>
            <th>球面三角</th>
            <th>Δ‱</th>
            <th><bc>黃 ⇒ 赤緯</bc></th>
            <th>球面三角</th>
            <th>Δ</th>
          </tr>
          {(this.state.outputEclp || []).map(row => {
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
        <h3>太陽赤經 ⇌ 黃經</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>Eclp&Equa</button>
        {this.result()}
      </div>
    )
  }
}