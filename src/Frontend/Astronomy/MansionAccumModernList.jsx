import React from 'react'
import MenuSelect from '../MenuSelect'
import { NameMansionList } from '../../Cal/parameter/constants.mjs'
import { bindMansionAccumModernList } from '../../Cal/astronomy/bind.mjs'

export default class Converter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendars: '',
      Jd: 2188944,
    }
    this.handle = this.handle.bind(this)
  }

  handle() {
    try {
      const { EclpAccumPrint, EquaAccumPrint, CeclpAccumPrint, SolsEclpPrint, SolsEquaPrint, SolsCeclpPrint } = bindMansionAccumModernList(this.state.calendars, this.state.Jd)
      this.setState({ EclpAccumPrint, EquaAccumPrint, CeclpAccumPrint, SolsEclpPrint, SolsEquaPrint, SolsCeclpPrint })
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
        <h3>赤道宿鈐</h3>
        <p>冬至日躔赤道 {(this.state.SolsEquaPrint)}</p >
        <table>
          {this.state.EquaAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>
                })}
              </tr>
            );
          })}
        </table>
        <h3>極黃宿鈐</h3>
        <p>冬至日躔極黃 {(this.state.SolsCeclpPrint)}</p>
        <table>
          {this.state.CeclpAccumPrint.map(row => {
            return (
              <tr>
                {row.map(d => {
                  return <td style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: d }}></td>
                })}
              </tr>
            );
          })}
        </table>
        <h3>黃道宿鈐</h3>
        <p>冬至日躔黃道 {(this.state.SolsEclpPrint)}</p>
        <table>
          {this.state.EclpAccumPrint.map(row => {
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
    let cals = NameMansionList
    return (
      <span className='calendar-select'>
        <MenuSelect
          calMap={cals}
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
        <span>儒略日</span>
        <input className='width4'
          value={this.state.Jd}
          onChange={e => {
            this.setState({ Jd: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  render() {
    return (
      <div>
        {this.renderCalendar()}
        {this.renderInput()}
        <button onClick={this.handle} className='button4-6'>現代黃赤宿鈐</button>
        {this.result()}
      </div>
    )
  }
}