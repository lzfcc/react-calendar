import React from 'react'
import BindTcorr from './AcrV'
import BindCorrEllipse from './Ellipse'
import BindEquaEclp from './Equa2Eclp'
import Deg2Mans from './Deg2Mans'
import Mans2Deg from './Mans2Deg'
import MansAccumList from './MansAccumList'
import MansAccumModernList from './MansAccumModernList'
import WhiteAccumList from './WhiteAccumList'
import BindLon2Lat from './Lon2Lat'
import StarEqua from './StarEqua'
import MoonLat from './MoonLat'
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

export default class Astronomy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <>
        <section className='modulo'>
          <h2>朓朒</h2>
          <BindTcorr />
          <BindCorrEllipse />
          <h2>宿度</h2>
          <Deg2Mans />
          <Mans2Deg />
          <MansAccumList />
          <MansAccumModernList />
          <WhiteAccumList />
          <BindEquaEclp />
          <StarEqua />
          <h2>晷漏</h2>
          <BindLon2Lat />
          <Round />
          <Round2 />
          <Round1 />
          <Hushigeyuan />
          <h2>月行</h2>
          <MoonLat />
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
      </>
    )
  }
}