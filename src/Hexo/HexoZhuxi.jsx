import React from 'react'
import { HexoZhuxiPrint } from '../Cal/hexo_print.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const Print1 = HexoZhuxiPrint()
      this.setState({ output: Print1 })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.output) {
      return null
    }
    return (
      <div className='ans table2 table-vertical bigger' style={{ whiteSpace: "nowrap" }}>
        <table>
          <tr>
            <th>爻</th>
            <th>本卦</th>
            <th>之卦</th>
          </tr>
          {(this.state.output || []).map(row => {
            return (
              <tr>
                <td className='RowTitle'>{row.title}</td>
                {row.data.map(d => {
                  return (<td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>)
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
        <h4>周易筮法</h4>
        <button onClick={this.handle} className='button4-3'>點之前虔誠。解卦靠自己</button>
        {this.result()}
      </div>
    )
  }
}