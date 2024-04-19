import React from "react";
import { MansSystemList } from "Cal/parameter/constants.mjs";
import SingleSelectMenu from "../SingleSelectMenu";
import MyWorker from "workers/worker_modern.mjs?worker";

export default class Day extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      YearStart: "",
      Longitude: 116.428,
      Latitude: 39.906,
      h: 0.06,
      MansSystem: "Shi",
      output: null,
      loading: false,
      showMonth: 0,
      showDate: 0,
      md: "",
    };
  }
  componentDidMount() {
    this.worker = new MyWorker();
    this.worker.addEventListener("message", ({ data }) => {
      this.setState({ output: data, loading: false });
    });
  }

  componentWillUnmount() {
    this.worker.terminate();
  }
  // GPT：
  renderYearColorTable(yearColor) {
    return (
      <table>
        <tbody>
          {yearColor.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                const [key, value] = Object.entries(cell)[0];
                return (
                  <td key={colIndex} className={key}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  renderDayTableList() {
    const { output } = this.state;
    if (!output) {
      return null;
    }

    const {
      MonName,
      MonInfo,
      MonColor,
      DayData,
      Era,
      Title,
      DayAccum,
      YearGod,
      YearColor,
    } = output;
    const list = DayData.slice(1);

    if (!list.length) {
      return null;
    }

    return (
      <section className="day-render">
        <div className="daytitle-wrap">
          <h2>
            <span className="daytitle-1">{Era}</span>
            <br />
            {Title}
          </h2>
          <p className="DayAccum">{DayAccum}</p>
          <p>{YearGod}</p>
          {YearColor && (
            <div className="YearColor">
              {this.renderYearColorTable(YearColor)}
            </div>
          )}
        </div>
        <hr />
        {list.map((info, index) => (
          <div className="single-cal" key={index}>
            <h3>{MonName[index + 1]}</h3>
            <p>{MonInfo[index + 1]}</p>
            {MonColor[index + 1] && (
              <span className="YearColor">
                {this.renderYearColorTable(MonColor[index + 1])}
              </span>
            )}
            <div>{this.RenderDayTableContent(index + 1, info)}</div>
          </div>
        ))}
      </section>
    );
  }

  renderDayRow(startIndex, endIndex, month, info) {
    const dayCells = [];
    for (let k = startIndex; k <= endIndex; k++) {
      dayCells.push(
        <td key={`${month}-${k}`} className="day-table-cell">
          {this.renderDayDetail(info, k)}
        </td>
      );
    }
    return (
      <tr key={`row-${startIndex}`}>
        {this.renderSideColumn()}
        {dayCells}
        {this.renderSideColumn()}
      </tr>
    );
  }

  renderSideColumn() {
    return (
      <td style={{ minWidth: "1.5em" }}>
        <p className="Sc">&nbsp;</p>
        <p>&nbsp;</p>
        <p>日</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>月</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>土</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>木</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>火</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>金</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>水</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>旦</p>
        <p>昏</p>
      </td>
    );
  }

  RenderDayTableContent(month, info) {
    const COL = 10;
    const rows = [];
    const infoLength = info.length;
    for (let k = 1; k < infoLength; k += COL) {
      // Calculate the end index but ensure it does not exceed the info array length
      const endIndex = Math.min(k + COL - 1, infoLength - 1);
      rows.push(this.renderDayRow(k, endIndex, month, info));
    }
    return (
      <div className="day-table">
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
  // GPT
  renderDayDetail(info, day) {
    const filteredEntries = Object.entries(info[day]).filter(
      ([key, value]) => key !== "MonColor" && value !== undefined // 这里添加了对 undefined 的检查
    );

    return (
      <div>
        {filteredEntries.map(([key, value]) => {
          if (Array.isArray(value)) {
            // 对于数组中的每个对象，我们创建一个 <p> 标签
            const paragraphs = value.map((obj, index) => {
              // 仅当 obj 不是 null 或 undefined 时，我们才处理它
              if (obj) {
                const spans = Object.entries(obj)
                  .filter(([_, val]) => val !== 0 && val !== undefined)
                  .map(([subKey, subValue], index, array) => (
                    <React.Fragment key={subKey}>
                      <span className={subKey}>{`${subValue}`}</span>
                      {index !== array.length - 1 && ' '}
                    </React.Fragment>
                  ));

                if (spans.length === 0) return null;

                return (
                  <p key={`paragraph-${key}-${index}`} className={key}>
                    {spans}
                  </p>
                );
              }
              return null;
            });

            return paragraphs.filter(Boolean);
          }

          // 如果 value 不是数组且不是 undefined，直接显示
          return (
            <p key={key} className={key}>
              <span className={key}>{value}</span>
            </p>
          );
        })}
      </div>
    );
  }

  handleRetrieve() {
    let YearStart = parseInt(this.state.YearStart);
    if (this.state.YearStart.length === 0) {
      const date = new Date();
      YearStart = date.getFullYear();
      this.setState({ YearStart });
      return;
    }
    if (YearStart < -2000 || YearStart > 2500) {
      alert("year range: -2000 to 2500");
      return;
    }
    if (Number.isNaN(YearStart)) {
      alert("illegal input!");
      return;
    }
    const Longitude = this.state.Longitude;
    const Latitude = this.state.Latitude;
    const h = this.state.h;
    const MansSystem = this.state.MansSystem;
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        ...this.state,
        YearStart,
        Longitude,
        Latitude,
        h,
        MansSystem,
      });
    };
    callWorker("Eph");
  }

  renderInput() {
    return (
      <span className="year-select">
        <input
          value={this.state.YearStart}
          onChange={(e) => {
            this.setState({ YearStart: e.currentTarget.value });
          }}
        />
        <span>年</span>
        <span> 地理經度</span>
        <input
          className="width3"
          value={this.state.Longitude}
          onChange={(e) => {
            this.setState({ Longitude: e.currentTarget.value });
          }}
        />
        <span>緯度</span>
        <input
          className="width3"
          value={this.state.Latitude}
          onChange={(e) => {
            this.setState({ Latitude: e.currentTarget.value });
          }}
        />
        <span>海拔</span>
        <input
          className="width2"
          value={this.state.h}
          onChange={(e) => {
            this.setState({ h: e.currentTarget.value });
          }}
        />
        <span>km 宿度體系</span>
      </span>
    );
  }

  renderCalendar() {
    const Calendars = MansSystemList;
    return (
      <span>
        <SingleSelectMenu
          Calendars={Calendars}
          onSelect={(selected) => {
            this.setState({ calendars: selected });
          }}
        />
      </span>
    );
  }
  render() {
    return (
      <>
        <h2>VSOP87 ELP2000 年曆</h2>
        {this.renderInput()}
        {this.renderCalendar()}
        <button onClick={this.handleRetrieve} className="button2">
          七政黃赤經緯
        </button>
        <p>
          <span className="Hori">灰色：地平座標</span>&nbsp;
          <span className="SunEqua">紅色：赤道</span>&nbsp;
          <span className="SunCeclp">黑色：極黃</span>&nbsp;
          <span className="SunEclp">黃色：黃道</span>&nbsp;
          <span className="Morningstar">
            綠色：晨昏矇影、昏旦中星、日出日入
          </span>
        </p>
        <article>
          <ul>
            <li>南京 [N32.061°, E118.791°, 100m] 雞鳴山北極閣</li>
            <li>長安 [N34.282°, E108.964°, 405m] 假設在大明宮南門</li>
            <li>陽城縣 [N34.404°, E113.141°, 265m] 登封告成鎭周公測景臺</li>
            <li>
              洛陽靈臺 [N34.696°, E112.626°, 154m] 偃师县岗上村与大郊寨之間
            </li>
            <li>浚儀縣岳臺 [N34.813°, E114.295°, 75m] 開封演武莊</li>
            <li>大都 [N39.906, E116.428, 60m] 建國門觀象臺</li>
          </ul>
        </article>
        {this.renderDayTableList()}
      </>
    );
  }
}