import React from 'react'
import Newm from './Newm'
import Modern from './Modern'
import Ephemeris from './Ephemeris'
import Congruence from './Congruence'
import Equation from './Equation'
import Astronomy from './Astronomy'
import Time from './Time'
import Guqin from './Guqin'
import Hexagram from './Hexagram'
import Intro from './Intro'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.tabTitles = ['朔閏表', '曆書', '現代曆表', '同餘', '招差', '天文', '時間', '琴律', '筮占', '簡介']
    this.state = {
      activeTab: 9,
      tabsData: {
        0: { output: '', loading: false }, // 初始状态为每个tab
        1: { output: '', loading: false },
        2: { output: '', loading: false },
        3: { output: '', loading: false },
        4: { output: '', loading: false },
        5: { output: '', loading: false },
        6: { output: '', loading: false },
        7: { output: '', loading: false },
        8: { output: '', loading: false },
        9: { output: '', loading: false },
      },
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
  }

  renderTabs() {
    return (
      <span className="section-select-container">
        {this.tabTitles.map((title, index) => (
          <span
            key={index}
            className={"section-select" + (this.state.activeTab === index ? ' active' : '')}
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
    return (
      <div>
        <div style={{ display: activeTab === 0 ? 'block' : 'none' }}>
          <Newm />
        </div>        
        <div style={{ display: activeTab === 1 ? 'block' : 'none' }}>
          <Ephemeris />
        </div>
        <div style={{ display: activeTab === 2 ? 'block' : 'none' }}>
          <Modern />
        </div>
        <div style={{ display: activeTab === 3 ? 'block' : 'none' }}>
          <Congruence />
        </div>
        <div style={{ display: activeTab === 4 ? 'block' : 'none' }}>
          <Equation />
        </div>
        <div style={{ display: activeTab === 5 ? 'block' : 'none' }}>
          <Astronomy />
        </div>
        <div style={{ display: activeTab === 6 ? 'block' : 'none' }}>
          <Time />
        </div>
        <div style={{ display: activeTab === 7 ? 'block' : 'none' }}>
          <Guqin />
        </div>
        <div style={{ display: activeTab === 8 ? 'block' : 'none' }}>
          <Hexagram />
        </div>
        <div style={{ display: activeTab === 9 ? 'block' : 'none' }}>
          <Intro />
        </div>

      </div>
    );
  }
  render() {
    return (
      <div className='App'>
        {this.renderTabs()}
        {this.renderTabContent()}
      </div>
    );
  }
}
