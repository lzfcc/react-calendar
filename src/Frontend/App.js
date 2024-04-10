import React from "react";
import Newm from "./Newm";
import Modern from "./Modern";
import Ephemeris from "./Ephemeris";
import Congruence from "./Congruence";
import Equation from "./Equation";
import Astronomy from "./Astronomy";
import Time from "./Time";
import Guqin from "./Guqin";
import Hexagram from "./Hexagram";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.tabs = [
      { title: "朔閏表", Component: Newm },
      { tilte: "曆書", Component: Ephemeris },
      { title: "現代曆表", Component: Modern },
      { title: "同餘", Component: Congruence },
      { title: "招差", Component: Equation },
      { title: "天文", Component: Astronomy },
      { title: "時間", Component: Time },
      { title: "琴律", Component: Guqin },
      { title: "筮占", Component: Hexagram },
    ];
    this.state = {
      activeTab: 0,
    };
  }
  // 保持其他tab的数据
  onTabClick = (index) => {
    if (this.state.activeTab !== index) {
      this.setState({
        activeTab: index,
        // 不重置output和loading
      });
    }
  };

  renderTabs() {
    return (
      <span className="section-select-container">
        {this.tabs.map(({ title }, index) => (
          <span
            key={index}
            className={
              "section-select" +
              (this.state.activeTab === index ? " active" : "")
            }
            onClick={() => this.onTabClick(index)}
          >
            {title}
          </span>
        ))}
      </span>
    );
  }
  renderTabContent() {
    const { activeTab } = this.state;
    const tabComponents = this.tabs.map(({ Component }, index) => (
      <div style={{ display: activeTab === index ? "block" : "none" }}>
        <Component />
      </div>
    ));
    return <div>{tabComponents}</div>;
  }
  render() {
    return (
      <div className="App">
        {this.renderTabs()}
        {this.renderTabContent()}
      </div>
    );
  }
}
