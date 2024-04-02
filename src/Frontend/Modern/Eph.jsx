import React from 'react'

export default class Day extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: '',
      Longitude: 116.428,
      Latitude: 39.906,
      output: null,
      loading: false,
      showMonth: 0,
      showDate: 0,
      md: ''
    };
  }
  componentDidMount() {
    this.worker = new Worker('worker_modern.min.js');
    this.worker.addEventListener('message', ({ data }) => {
      this.setState({ output: data, loading: false });
    });
  }

  renderDayTableList() {
    if (!this.state.output) {
      return null
    }
    const MonName = this.state.output.MonName
    const MonInfo = this.state.output.MonInfo
    const MonColor = this.state.output.MonColor
    const list = this.state.output.DayData.slice(1)
    // console.log(this.state.output.Era)
    if (!list.length) {
      return null
    }
    list.forEach((item, index) => {
      item.id = index
    })
    return (
      <section className='day-render' style={{ whiteSpace: "pre-wrap" }}>
        <div className='daytitle-wrap'>
          <h2><span className='daytitle-1'>{this.state.output.Era}</span><br />
            {this.state.output.Title}
          </h2>
          <p className='DayAccum'>{this.state.output.DayAccum}</p>
          <p>{this.state.output.YearGod}</p>
          <div className='YearColor'>
            <table>
              {(this.state.output.YearColor || []).map(row => {
                return (
                  <tr>
                    {row.map(d => {
                      return <td dangerouslySetInnerHTML={{ __html: d }}></td>
                    })}
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        <hr />
        {list.map((info, index) => {
          return (
            <div className="single-cal">
              <h3>{MonName[index + 1]}</h3>
              <p dangerouslySetInnerHTML={{ __html: MonInfo[index + 1] }}></p>
              <span className='YearColor'>
                <table>
                  {(MonColor[index + 1] || []).map(row => {
                    return (
                      <tr>
                        {row.map(d => {
                          return <td dangerouslySetInnerHTML={{ __html: d }}></td>
                        })}
                      </tr>
                    );
                  })}
                </table>
              </span>
              <div>
                {this.RenderDayTableContent(index + 1, info)}
              </div>
            </div>
          );
        })}
      </section>
    );
  }

  RenderDayTableContent(month, info) {
    const COL = 10
    const rows = []
    for (let k = 1; k < info.length; k++) {
      const r = Math.floor((k - 1) / COL)
      if (!rows[r]) {
        rows[r] = []
      }
      rows[r].push(
        (
          <td
            key={month + '-' + k}
            className="day-table-cell"
          >
            {this.renderDayDetail(info, k)}
          </td>
        )
      )
    }
    return (
      <div className='day-table'>
        <table>
          {rows.map(row => (
            <tr>
              <td style={{minWidth: '1.5em'}}><div>
                <p class="Sc">&nbsp;</p>
                <p>&nbsp;</p>
                <p>日</p>
                <p>&nbsp;</p>
                <p>月</p>
                <p>&nbsp;</p>
                <p>土</p>
                <p>&nbsp;</p>
                <p>木</p>
                <p>&nbsp;</p>
                <p>火</p>
                <p>&nbsp;</p>
                <p>金</p>
                <p>&nbsp;</p>
                <p>水</p>
                <p>&nbsp;</p>
              </div></td>
              {row}
              <td style={{ minWidth: '1.5em' }}><div>
                <p class="Sc">&nbsp;</p>
                <p>&nbsp;</p>
                <p>日</p>
                <p>&nbsp;</p>
                <p>月</p>
                <p>&nbsp;</p>
                <p>土</p>
                <p>&nbsp;</p>
                <p>木</p>
                <p>&nbsp;</p>
                <p>火</p>
                <p>&nbsp;</p>
                <p>金</p>
                <p>&nbsp;</p>
                <p>水</p>
                <p>&nbsp;</p>
              </div></td></tr>
          ))}
        </table>
      </div>
    )
  }

  renderDayDetail(info, day) {
    // if (this.state.showMonth !== month || this.state.showDate !== day) {
    //   return null
    // }
    return (
      <div>
        {
          Object.entries(info[day]).map(([key, value]) => {
            if ({ key } === 'MonColor') { } else {
              return (
                /* {TableDayRowNameMap[key]}:  */
                <p className={key} dangerouslySetInnerHTML={{ __html: value }}></p>
              )
            }
          })
        }
      </div>
    )
  }

  handleRetrieve() {
    let YearStart = parseInt(this.state.YearStart);
    if (this.state.YearStart.length === 0) {
      const date = new Date();
      YearStart = date.getFullYear()
      this.setState({ YearStart })
      return;
    }
    if (YearStart < -2000 || YearStart > 2500) {
      alert('year range: -2000 to 2500');
      return
    }
    if (Number.isNaN(YearStart)) {
      alert('illegal input!');
      return;
    }
    const Longitude = this.state.Longitude
    const Latitude = this.state.Latitude
    const callWorker = eventName => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        ...this.state,
        YearStart,
        Longitude,
        Latitude
      })
    }
    callWorker("Eph")
  }

  renderInput() {
    return (
      <span className='year-select'>
        <input
          value={this.state.YearStart}
          onChange={e => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        <span>年</span>
        <span> 地理經度</span>
        <input className='width3'
          value={this.state.Longitude}
          onChange={e => {
            this.setState({ Longitude: e.currentTarget.value });
          }}
        />
        <span>緯度</span>
        <input className='width3'
          value={this.state.Latitude}
          onChange={e => {
            this.setState({ Latitude: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  render() {
    return (
      <>
        <h2>VSOP87 ELP2000 曆書</h2>
        {this.renderInput()}        
        <button onClick={this.handleRetrieve} className='button2'>七政黃赤經緯</button>
        <p>各星上行爲極黃經緯，下行爲赤道。注意，是極黃經而非黃經</p>
        {this.renderDayTableList()}
      </>
    )
  }
}
