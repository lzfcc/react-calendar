import React from 'react'
import { HexoZhuxiBPrint } from '../../Cal/hexagram/print.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const Print1 = HexoZhuxiBPrint()
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
        <p>獨立算得兩卦，陰陽變了的作為變爻</p>
        <table>
          <tbody>
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
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4>周易筮法B</h4>
        <button onClick={this.handle} className='button4-3'>以兩卦定變爻</button>
        {this.result()}
      </div>
    )
  }
}