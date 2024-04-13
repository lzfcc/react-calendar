import React from 'react'
import { NameJiudaoList } from '../../Cal/parameter/constants.mjs'
import { bindWhiteAccumList } from '../../Cal/astronomy/bind.mjs'
import SingleSelectMenu from '../SingleSelectMenu'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendars: '',
      Year: 1281,
      NodeAccum: 10,
      Sd: 50,
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const WhiteAccumPrint = bindWhiteAccumList(this.state.calendars, this.state.Year, this.state.NodeAccum, this.state.Sd)
      this.setState({ WhiteAccumPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.WhiteAccumPrint) {
      return null
    }
    return (
      <div className='ans table2'>
        <h3>九道宿鈐</h3>
        <table>
          {this.state.WhiteAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>
                })}
              </tr>
            );
          })}
        </table>
      </div>
    )
  }

  renderCalendar() {
    const Calendars = NameJiudaoList
    return (
      <span>
        <SingleSelectMenu
          Calendars={Calendars}
          onSelect={selected => {
            this.setState({ calendars: selected })
          }}
        />
      </span>
    );
  }

  renderInput() {
    return (
      <span className='year-select'>
        <input
          value={this.state.Year}
          onChange={e => {
            this.setState({ Year: e.currentTarget.value });
          }}
        />
        <span>年 入交日數</span>
        <input className='width3'
          value={this.state.NodeAccum}
          onChange={e => {
            this.setState({ NodeAccum: e.currentTarget.value });
          }}
        />
        <span>距冬至日數</span>
        <input className='width3'
          value={this.state.Sd}
          onChange={e => {
            this.setState({ Sd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  render() {
    return (
      <div className='one-row'>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handle} className='button4-6'>九道宿鈐</button>
        {this.result()}
      </div>
    )
  }
}