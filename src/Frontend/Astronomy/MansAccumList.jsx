import React from 'react'
import { NameDayList } from '../../Cal/parameter/constants.mjs'
import { bindMansAccumList } from '../../Cal/astronomy/bind.mjs'
import SingleSelectMenu from '../SingleSelectMenu'
import Para from "Cal/parameter/calendars.mjs"

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendars: '',
      Year: 1281,
    }
    this.handle = this.handle.bind(this)
  }

  renderTitle() {
    const Name = this.state.calendars;
    const { Type } = Para[Name]
    let Title;
    if (Type === 13) {
      Title = "黃道"
    } else {
      Title = "極黃"
    }
    return Title;
  }

  handle() {
    try {
      const { EclpAccumPrint, EquaAccumPrint, SolsEclpPrint, SolsEquaPrint } = bindMansAccumList(this.state.calendars, this.state.Year)
      this.setState({ EclpAccumPrint, EquaAccumPrint, SolsEclpPrint, SolsEquaPrint })
    } catch (e) {
      alert(e.message)
    }
  }

  result() {
    if (!this.state.EclpAccumPrint) {
      return null
    }
    return (
      <div className='ans table2'>
        <h3>{this.renderTitle()}宿鈐</h3>
        <p>冬至日躔{this.renderTitle()} {(this.state.SolsEclpPrint)}</p>
        <table>
          {this.state.EclpAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }}>{d}</td>
                })}
              </tr>
            );
          })}
        </table>
        <h3>赤道宿鈐</h3>
        <p>冬至日躔赤道 {(this.state.SolsEquaPrint)}</p >
        <table>
          {this.state.EquaAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }}>{d}</td>
                })}
              </tr>
            );
          })}
        </table>
      </div>
    )
  }

  renderCalendar() {
    const Calendars = NameDayList
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
        <span>年</span>
      </span>
    );
  }

  render() {
    return (
      <div className='one-row'>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handle} className='button4-6'>黃赤宿鈐</button>
        {this.result()}
      </div>
    )
  }
}