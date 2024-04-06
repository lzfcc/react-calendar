import React from 'react'

const TableRowNameMap = {
  MonthPrint: ' ',
  NewmScPrint: '定朔',
  NewmMmddPrint: '公曆',
  NewmDeciUT18Print: 'UT1',
  NewmEquaPrint: '赤道',
  NewmEclpPrint: '黃道',
  SyzygyScPrint: '定望',
  SyzygyMmddPrint: '公曆',
  SyzygyDeciPrint: 'UT1',
  Term1NamePrint: '節氣',
  Term1AcrScPrint: '定氣',
  Term1AcrMmddPrint: '公曆',
  Term1AcrDeciPrint: 'UT1',
  Term1EquaPrint: '赤道',
  Term1EclpPrint: '黃道',
  TermNamePrint: '節氣',
  TermAcrScPrint: '定氣',
  TermAcrMmddPrint: '公曆',
  TermAcrDeciPrint: 'UT1',
  TermEquaPrint: '赤道',
  TermEclpPrint: '黃道',
  showTableList: false,
}
export default class Newm extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: '',
      YearEnd: '',
      output: '',
      Longitude: 116.428,
    };
  }

  componentDidMount() {
    this.worker = new Worker('worker_modern.min.js');
    this.worker.addEventListener('message', ({ data }) => {
      if (data instanceof Blob) { // 约定：存为文件时 web worker 发送 Blob 对象
        this.setState({ output: [] });
        var fileName = `calendar_${this._getFileName()}.md`;
        var a = document.createElement('a');
        a.download = fileName;
        a.href = URL.createObjectURL(data);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
      } else { // 约定：页面展示时 web worker 发送 Object 对象
        this.setState({ output: data });
      }
      this.setState({ loading: false });
    })
  }


  componentWillUnmount() {
    this.worker.terminate()
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
        <span className='year-end'>
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={e => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年&nbsp;&nbsp;</span>
        </span>
        <span>地理經度</span>
        <input className='width3'
          value={this.state.Longitude}
          onChange={e => {
            this.setState({ Longitude: e.currentTarget.value });
          }}
        />
      </span>
    );
  }

  handleRetrieve() {
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    const Longitude = parseFloat(this.state.Longitude)
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      const date = new Date();
      const year = date.getFullYear()
      YearStart = year
      YearEnd = year
      this.setState({ YearStart })
      this.setState({ YearEnd })
      return;
    }
    if (YearStart < -2499 || YearStart > 2499 || YearEnd < -2499 || YearEnd > 2499) {
      alert('Year range: -2499 to 2499');
      return;
    }
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert('illegal input!');
      return;
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd })
      } else {
        alert('illegal end year!');
        return;
      }
    } else if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart })
      } else {
        alert('illegal start year!');
        return;
      }
    }
    if (YearStart > YearEnd) {
      [YearStart, YearEnd] = [YearEnd, YearStart]
      this.setState({ YearStart })
      this.setState({ YearEnd })
    }
    if (YearEnd - YearStart > 200) {
      alert('內容過多，爲避免瀏覽器展示性能問題，請減少年數');
      return
    }
    const callWorker = eventName => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        YearStart,
        YearEnd,
        Longitude,
        ...this.state
      })
    }
    callWorker("Newm")
    this.setState({
      showTableList: true
    });
  }

  renderTableList() {
    // 只有当showTableList为true时才显示section
    if (!this.state.showTableList) {
      return null;
    }
    return (
      <section className='main-render'>
        {(this.state.output || []).map(CalData => {
          const yearGroup = CalData.map(calInfo => {
            return (
              <div className='single-cal'>
                <h3>{calInfo.Era}</h3>
                <p style={{ whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: calInfo.YearInfo }}></p>
                <table>
                  <tbody>
                    <tr>
                      {this.RenderTableContent(calInfo)}
                    </tr>
                  </tbody>
                </table>
              </div>
            )
          })
          return yearGroup
        })}
      </section>
    );
  }

  RenderTableContent(calInfo) {
    return Object.entries(calInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return <tr className={key}>{
          [<th>{TableRowNameMap[key]}</th>].concat(value.map(x => (<td dangerouslySetInnerHTML={{ __html: x }}></td>)))
        }</tr>
      }
      return null
    })
  }

  render() {
    return (
      <>
        <div className='calendar-select'>
          <h2>DE440/1 朔閏表</h2>
          {this.renderInput()}
          <button onClick={this.handleRetrieve} className='button1'>密合天行</button>
        </div>
        {this.renderTableList()}
      </>
    )
  }
}
