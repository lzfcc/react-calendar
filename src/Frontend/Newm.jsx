import React from "react";
import { NameList } from "Cal/parameter/constants.mjs";
import MultiSelectMenu from "./MultiSelectMenu";
import MyWorker from "workers/worker_ancient.mjs?worker";

const TableRowNameMap = {
  MonthPrint: " ",
  NewmAvgScPrint: "平朔",
  NewmAvgDeciPrint: " ",
  NewmScPrint: "定朔",
  NewmDeciUT18Print: "UT1+8",
  NewmNowlineDeciPrint: "注曆",
  NewmAcrDeciPrint: "交食",
  NewmDeci3Print: "三次",
  NewmDeci2Print: "二次",
  NewmDeci1Print: "線性",
  NewmEquaPrint: "赤道",
  NewmEclpPrint: "黃道",
  SyzygyScPrint: "望",
  SyzygyNowlineDeciPrint: "注曆",
  SyzygyDeciPrint: " ",
  Term1NamePrint: "節氣",
  Term1ScPrint: "平氣",
  Term1DeciPrint: " ",
  Term1AcrScPrint: "定氣",
  Term1AcrDeciPrint: " ",
  Term1NowDeciPrint: "迭代",
  Term1EquaPrint: "赤道",
  Term1EclpPrint: "黃道",
  TermNamePrint: "節氣",
  TermScPrint: "平氣",
  TermDeciPrint: " ",
  TermAcrScPrint: "定氣",
  TermAcrDeciPrint: " ",
  TermNowDeciPrint: "迭代",
  TermEquaPrint: "赤道",
  TermEclpPrint: "黃道",
  TermDuskstarPrint: "旦昏中",
};

export default class Newm extends React.Component {
  constructor(props) {
    super(props);
    this.handleRetrieve = this.handleRetrieve.bind(this);
    this.state = {
      calendars: [],
      YearStart: "",
      YearEnd: "",
      output: "",
      showTableList: false,
    };
  }

  componentDidMount() {
    this.worker = new MyWorker();
    this.worker.addEventListener("message", ({ data }) => {
      if (data instanceof Blob) {
        // 约定：存为文件时 web worker 发送 Blob 对象
        this.setState({ output: [] });
        var fileName = `calendar_${this._getFileName()}.md`;
        var a = document.createElement("a");
        a.download = fileName;
        a.href = URL.createObjectURL(data);
        a.click();
        URL.revokeObjectURL(a.href);
        a = null;
      } else {
        // 约定：页面展示时 web worker 发送 Object 对象
        this.setState({ output: data });
      }
      this.setState({ loading: false });
    });
  }

  componentWillUnmount() {
    this.worker.terminate();
  }

  _getFileName() {
    let calString = `${this.state.calendars}_${this.state.YearStart}`;
    if (this.state.YearEnd) {
      calString += `_${this.state.YearEnd}`;
    }
    calString += "_";
    const date = new Date();
    let dateString = date.getFullYear().toString();
    [
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
    ].forEach((num) => {
      dateString = dateString + num.toString().padStart(2, "0");
    });
    return calString + dateString;
  }

  renderCalendar() {
    return (
      <span>
        <MultiSelectMenu
          Calendars={NameList}
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
        {/* {this.state.mode === '1' ? ( */}
        <span className="year-end">
          <span>—</span>
          <input
            value={this.state.YearEnd}
            onChange={(e) => {
              this.setState({ YearEnd: e.currentTarget.value });
            }}
          />
          <span>年</span>
        </span>
        {/* ) : null} */}
      </span>
    );
  }

  handleRetrieve() {
    const isAuto = (this.isAuto && this.isAuto.checked) || false;
    if (this.state.calendars.length === 0 && isAuto === false) {
      alert("Please choose a calendar");
      return;
    }
    let YearStart = parseInt(this.state.YearStart);
    let YearEnd = parseInt(this.state.YearEnd);
    if (this.state.YearStart.length === 0 && this.state.YearEnd.length === 0) {
      const date = new Date();
      const year = date.getFullYear();
      YearStart = year;
      YearEnd = year;
      this.setState({ YearStart });
      this.setState({ YearEnd });
      return;
    }
    if (isAuto) {
      if (
        YearStart < -721 ||
        YearStart > 1913 ||
        YearEnd < -721 ||
        YearEnd > 1913
      ) {
        alert("Year range of AutoChoose mode: -721 to 1913");
        return;
      }
    } else {
      if (
        YearStart < -3807 ||
        YearStart > 9999 ||
        YearEnd < -3807 ||
        YearEnd > 9999
      ) {
        // -3808爲景初曆上元
        alert("Year range: -3807 to 9999");
        return;
      }
    }
    if (Number.isNaN(YearStart) && Number.isNaN(YearEnd)) {
      alert("illegal input!");
      return;
    }
    if (Number.isNaN(YearEnd)) {
      if (this.state.YearEnd.length === 0) {
        YearEnd = YearStart;
        this.setState({ YearEnd });
      } else {
        alert("illegal end year!");
        return;
      }
    } else if (Number.isNaN(YearStart)) {
      if (this.state.YearStart.length === 0) {
        YearStart = YearEnd;
        this.setState({ YearStart });
      } else {
        alert("illegal start year!");
        return;
      }
    }
    if (YearStart > YearEnd) {
      [YearStart, YearEnd] = [YearEnd, YearStart];
      this.setState({ YearStart });
      this.setState({ YearEnd });
    }
    const callWorker = (eventName) => {
      this.setState({ loading: true });
      this.worker.postMessage({
        eventName,
        YearStart,
        YearEnd,
        isAuto,
        ...this.state,
      });
    };
    if (this.downloadRef && this.downloadRef.checked) {
      callWorker("Print");
      return;
    }
    if (this.state.calendars.length * (YearEnd - YearStart) > 200) {
      alert("內容過多，爲避免瀏覽器展示性能問題，請下載.md文件到本地");
      return;
    }
    callWorker("Newm");
    this.setState({
      showTableList: true,
    });
  }

  // renderLoading() {
  //   return this.state.loading ? (
  //     <div className="loading-view">
  //       <p className="loading-text">计算中，请稍候...</p>
  //     </div>
  //   ) : null;
  // }

  renderDownload() {
    return (
      <span>
        <input
          type="checkbox"
          name="download-file"
          ref={(ref) => {
            this.downloadRef = ref;
          }}
        />
        <label>保存爲.md文件</label>
      </span>
    );
  }

  renderAutoCal() {
    return (
      <span>
        <input
          type="checkbox"
          name="isAuto"
          ref={(ref) => {
            this.isAuto = ref;
          }}
        />
        <label>自動選擇當年曆法</label>
      </span>
    );
  }

  renderTableList() {
    // 只有当showTableList为true时才显示section
    if (!this.state.showTableList) {
      return null;
    }
    return (
      <section className="main-render">
        {(this.state.output || []).map((CalData) => {
          const yearGroup = CalData.map((calInfo) => {
            return (
              <div className="single-cal">
                <h3>{calInfo.Era}</h3>
                <p
                  style={{ whiteSpace: "pre-wrap" }}
                  dangerouslySetInnerHTML={{ __html: calInfo.YearInfo }}
                ></p>
                <table>
                  <tbody>
                    <tr>{this.RenderTableContent(calInfo)}</tr>
                  </tbody>
                </table>
              </div>
            );
          });
          return yearGroup;
        })}
      </section>
    );
  }

  RenderTableContent(calInfo) {
    return Object.entries(calInfo).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0 && TableRowNameMap[key]) {
        return (
          <tr className={key}>
            {[<th>{TableRowNameMap[key]}</th>].concat(
              value.map((x) => (
                <td dangerouslySetInnerHTML={{ __html: x }}></td>
              ))
            )}
          </tr>
        );
      }
      return null;
    });
  }

  render() {
    return (
      <>
        <div className="one-row">
          <div>
            {this.renderCalendar()}
            {this.renderAutoCal()}
          </div>
          <div>
            {this.renderInput()}
            <button onClick={this.handleRetrieve} className="button1">
              天霝〻地霝〻
            </button>
            {this.renderDownload()}
          </div>
        </div>
        {this.renderTableList()}
      </>
    );
  }
}
