import React from 'react'
import { bindStarEclp2Equa } from '../Cal/astronomy_bind'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      Sobliq: 23.5,
      Lon: 10,
      Lat: 9
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>黃赤交角</span>
        <input className='width3'
          value={this.state.Sobliq}
          onChange={e => {
            this.setState({ Sobliq: e.currentTarget.value });
          }}
        />
        <span> 經度</span>
        <input className='width2'
          value={this.state.Lon}
          onChange={e => {
            this.setState({ Lon: e.currentTarget.value });
          }}
        />
        <span> 緯度</span>
        <input className='width2'
          value={this.state.Lat}
          onChange={e => {
            this.setState({ Lat: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { Print, Print2, DifMax } = bindStarEclp2Equa(this.state.Sobliq, this.state.Lon, this.state.Lat)
      this.setState({ Print, Print2, DifMax })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.Print) {
      return null
    }
    return (
      <div className='ans table2'>
        <table>
          <tr>
            <th></th>
            <th>經度°</th>
            <th>Δ黃經</th>
            <th>緯度°</th>
            <th>Δ黃緯</th>
          </tr>
          {(this.state.Print || []).map(row => {
            return (
              <tr>
                <th>{row.title}</th>
                {row.data.map(d => {
                  return (<td>{d}</td>)
                })}
              </tr>
            )
          })}
        </table>
        <p>{this.state.DifMax}</p>
        <table>
          <tr>
            <th></th>
            <th>經度°</th>
            <th>Δ赤經</th>
            <th>緯度°</th>
            <th>Δ赤緯</th>
          </tr>
          {(this.state.Print2 || []).map(row => {
            return (
              <tr>
                <th>{row.title}</th>
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
        <h3>黃道、赤道 ⇒ 極黃經</h3>
        {this.input()}
        <button onClick={this.handle} className='button4-6'>Convert</button>
        {this.result()}
      </div>
    )
  }
}