import React from 'react'
import { FretPitch } from '../Cal/guqin'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      b: '1',
      n: '0'
    }
    this.handle = this.handle.bind(this)
  }

  input() {
    return (
      <span className='year-select'>
        <span>弦法</span>
        <input
          className='width1'
          value={this.state.b}
          onChange={e => {
            this.setState({ b: e.currentTarget.value });
          }}
        />
        <span> 宮弦</span>
        <input
          className='width1'
          value={this.state.n}
          onChange={e => {
            this.setState({ n: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handle() {
    try {
      const { ZhunPrint, HuiPrint } = FretPitch(this.state.b, this.state.n)
      this.setState({ output1: ZhunPrint, output2: HuiPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output1) {
      return null
    }
    return (
      <div className='ans table2 rowline' style={{ whiteSpace: "nowrap" }}>
        <h3>準法律</h3>
        <table>
          <tr>
            <th></th>
            <th>散</th>
            <th>卜卜</th>
            <th>卜</th>
            <th>13</th>
            <th>12</th>
            <th>11</th>
            <th>10</th>
            <th>9</th>
            <th>8</th>
            <th>7</th>
            <th>6</th>
            <th>5</th>
            <th>4</th>
            <th>3</th>
            <th>2</th>
            <th>1</th>
            <th>卜</th>
          </tr>
          {(this.state.output1 || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
              </tr>
            )
          })}
        </table>
        <h3>徽法律</h3>
        <table>
          <tr>
            <th></th>
            <th>散</th>
            <th>卜卜</th>
            <th>卜</th>
            <th>13</th>
            <th>12</th>
            <th>11</th>
            <th>10</th>
            <th>9</th>
            <th>8</th>
            <th>7</th>
            <th>6</th>
            <th>5</th>
            <th>4</th>
            <th>3</th>
            <th>2</th>
            <th>1</th>
            <th>卜</th>
          </tr>
          {(this.state.output2 || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => <td dangerouslySetInnerHTML={{ __html: d }}></td>)}
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
        <h3>徽位音</h3>
        <p className='note'></p>
        {this.input()}
        <button onClick={this.handle} className='button4-1'>算算算</button><span className='Deci64'>n/d</span>
        {this.result()}
      </div>
    )
  }
}