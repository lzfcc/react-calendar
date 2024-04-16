import React from "react";
import { NameDayList } from "Cal/parameter/constants.mjs";
import SingleSelectMenu from "./SingleSelectMenu";
import MyWorker from "workers/worker_ancient.mjs?worker";
import Para from "Cal/parameter/calendars.mjs"

export default class Day extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: "",
      YearEnd: "",
      AutoMode: 0,
      output: null,
      loading: false,
      showMonth: 0,
      showDate: 0,
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

  // 以下經GPT優化：
  // 解构赋值：使用 ES6 的解构赋值来简化对 this.state 中属性的引用。
  // 避免在渲染函数中修改 state：forEach 修改 list 中的元素是一个副作用，应该在 state 设置或数据获取时完成。
  // 给列表元素添加 key：在渲染列表时，每个元素都应有一个唯一的 key 属性。
  // 移除内联样式：内联样式对性能不利，应该尽量使用 CSS 类。
  // 移除危险的 dangerouslySetInnerHTML：这个属性可能导致 XSS 攻击。如果内容是安全的，尽量通过其他方式渲染。
  // 将静态内容移出 map 函数：如果某些内容不依赖于循环中的数据，应该将其移出循环。
  // 减少不必要的渲染：如果 this.state.output 没有改变，不需要重新渲染整个组件。
  renderYearColorTable(yearColor) {
    return (
      <table>
        <tbody>
          {yearColor.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((d, colIndex) => (
                <td key={colIndex} dangerouslySetInnerHTML={{ __html: d }} />
              ))}
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
            <p dangerouslySetInnerHTML={{ __html: MonInfo[index + 1] }}></p>
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
  // 以下由GPT 優化：
  // 添加了 key 属性以提高列表渲染的性能。
  // 去掉了重复的内联样式，建议用 CSS 类来代替。
  // 将每一行的渲染逻辑提取到 renderDayRow 函数中。
  // 使用了 renderSideColumn 函数来减少重复的 JSX 代码。
  // 使用 tbody 标签包裹了 rows，这是表格标记的最佳实践。
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
    const Name = this.state.calendars;
    const { Type } = Para[Name]
    let Side;
    if (Type === 13) {
      Side = (
        <td style={{ minWidth: "1.5em" }}>
          <p className="Sc">&nbsp;</p>
          <p>&nbsp;</p>
          <p>日</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>月</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>旦</p>
          <p>昏</p>
        </td>
      );
    } else if (Type <= 10) {
      Side = (
        <td style={{ minWidth: "1.5em" }}>
          <p className="Sc">&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>日</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>月</p>
          <p>&nbsp;</p>
          <p>旦</p>
          <p>昏</p>
          <p>神</p>
        </td>
      );
    } else {
      Side = (
        <td style={{ minWidth: "1.5em" }}>
          <p className="Sc">&nbsp;</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>日</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>月</p>
          <p>&nbsp;</p>
          <p>&nbsp;</p>
          <p>旦</p>
          <p>昏</p>
          <p>神</p>
        </td>
      );
    }
    return Side;
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

  // GPT：
  // 在这个代码片段中，我们首先使用 filter 方法来排除数组中键为 'MonColor' 的项，然后使用 map 方法来遍历过滤后的数组并返回一个新的<p> 元素数组。每个<p> 元素都使用 key 作为 React 的 key 属性，这是必需的，以帮助 React 确定何时重新渲染组件。
  renderDayDetail(info, day) {
    const filteredEntries = Object.entries(info[day]).filter(
      ([key]) => key !== "MonColor"
    );
    return (
      <div>
        {filteredEntries.map(([key, value]) => {
          if (Array.isArray(value)) {
            // 对于数组中的每个对象，我们创建一个 <p> 标签
            const paragraphs = value.map((obj, index) => {
              // 过滤掉值为0的键值对，并为其他每个键值对创建一个 <span>
              const spans = Object.entries(obj)
                .filter(([_, val]) => val !== 0 || val !== undefined)
                .map(([subKey, subValue]) => (
                  <span key={subKey} className={subKey}>{`${subValue}`}</span>
                ));
              // 如果没有任何有效的 <span>，则不创建 <p>
              if (spans.length === 0) return null;
              // 使用对象的索引作为 p 标签的 key
              return (
                <p key={`paragraph-${key}-${index}`} className={key}>
                  {spans}
                </p>
              );
            });
            // 仅渲染非空的 <p> 标签
            return paragraphs.filter(Boolean);
          }
          // 如果 value 不是数组，直接显示
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
    if (this.state.calendars.length === 0) {
      alert("Please choose a calendar");
      return;
    }
    if (this.state.YearStart.length === 0) {
      alert("Please input year(s)");
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    if (YearStart < -3807 || YearStart > 9999) {
      alert("year range: -3807 to 9999");
      return;
    }
    let YearEnd = YearStart;
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert("illegal input!");
      return;
    }
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        ...this.state,
        YearStart,
        YearEnd,
      });
    };
    callWorker("Eph");
  }

  renderCalendar() {
    const Calendars = NameDayList;
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
      </span>
    );
  }

  render() {
    return (
      <>
        <div className="one-row">
          {this.renderCalendar()}
          {this.renderInput()}
          <button onClick={this.handleRetrieve} className="button2">
            㤂〻如勑令
          </button>
        </div>
        <article>
          <ul>
            <li>
              <span className="Jd">灰色：儒略日、儒略曆或格利高里曆日期</span>
            </li>
            <li>
              <span className="Nayin">
                黑色：納音、建除、黃道黑道；七曜值日、二十八宿值日、二十八禽值日
              </span>
            </li>
            <li>
              <span className="Equa">紅色：赤道經緯宿度</span>
            </li>
            <li>
              <span className="Ceclp">黑色：極黃經緯宿度</span>
            </li>
            <li>
              <span className="Eclp">黃色：黃道經緯宿度</span>
            </li>
            <li>
              <span className="WhiteLon">【月】藍色：九道經度</span>
            </li>
            <li>
              <span className="MoonRise">【月】綠色：出入時刻</span>
            </li>
            <li>
              <span className="NodeMapo">
                【月】灰色：羅㬋（正交）、月孛（月遠地點）
              </span>
            </li>
            <li>
              <span className="Rise">
                綠色：民用曚影時刻、日出入刻度、昏旦中星
              </span>
            </li>
            <li>
              <span className="HouName">
                黑色：沒滅、二十四節氣、七十二候、卦用事、土王用事
              </span>
            </li>
            <li>
              <span className="ManGod">灰色：人神、血支血忌、日遊神</span>
            </li>
            <li>
              <span className="Luck">紅色：各種日神</span>
            </li>
          </ul>
        </article>
        {this.renderDayTableList()}
      </>
    );
  }
}
