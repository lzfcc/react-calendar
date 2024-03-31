import React from 'react'
import BindTcorr from './AcrV'
import BindCorrEllipse from './Ellipse'
import BindEquaEclp from './Equa2Eclp'
import Deg2Mansion from './Deg2Mansion'
import Mansion2Deg from './Mansion2Deg'
import MansionAccumList from './MansionAccumList'
import MansionAccumModernList from './MansionAccumModernList'
import BindLon2Lat from './Lon2Lat'
import StarEqua from './StarEqua'
import MoonLon from './MoonLon'
import Const from './Const'
import SunEclipse from './SunEclipse'
import MoonEclipse from './MoonEclipse'
import Node2Cycle from './Node'
import Cycle2Node from './EcliRange'
import Regression from './Regression'
import Round from './Round'
import Round1 from './Round1'
import Round2 from './Round2'
import Hushigeyuan from './Hushigeyuan'
import SolarChange from './SolarChange'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import gfm from 'remark-gfm'
import md1 from '../note/astronomy.md';

export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      md: ''
    };
  }
  UNSAFE_componentWillMount() {
    fetch(md1)
      .then(res => res.text())
      .then(text => this.setState({ md: text }))
  }
  render() {
    const { md } = this.state
    return (
      <>
        <section className='modulo'>
          <h2>朓朒</h2>
          <BindTcorr />
          <BindCorrEllipse />
          <h2>宿度</h2>
          <Deg2Mansion />
          <p></p>
          <Mansion2Deg />
          <MansionAccumList />
          <MansionAccumModernList />
          <BindEquaEclp />
          <StarEqua />
          <h2>晷漏</h2>
          <BindLon2Lat />
          <Round />
          <p></p>
          <Round2 />
          <p></p>
          <Round1 />
          <Hushigeyuan />
          <h2>月行</h2>
          <MoonLon />
          <h2>交食</h2>
          <SunEclipse />
          <MoonEclipse />
          <Cycle2Node />
          <Node2Cycle />
          <Regression />
          <h2>現代天文計算</h2>
          <Const />
          <SolarChange />
        </section>
        <hr />
        <article>
          <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} children={md} />
        </article>
      </>
    )
  }
}