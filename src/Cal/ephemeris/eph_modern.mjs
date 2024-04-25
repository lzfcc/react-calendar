import {
  ScList,
  StemList,
  BranchList,
  WeekList,
  MansNameList,
  YuanList,
  NumList,
  MonNumList1,
  PlanetList,
} from "../parameter/constants.mjs";
import { YearGodConvert, YearColorConvert, MonColorConvert } from "./luck.mjs";
import { sunRise, twilight } from "../astronomy/pos_convert.mjs";
import CalNewm from "../newmoon/index_de.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { deci2hms } from "../time/decimal2clock.mjs";
import { R2D, lat2NS, nzh } from "../parameter/functions.mjs";
import { deg2MansModern, mansModernList, midstarModern } from "../modern/mans.mjs";
import { calPos_vsop } from "../modern/vsop_elp.mjs";
import { deltaT } from "../time/delta-t.mjs";
import { bindTopo_vsop } from "../modern/vsop_elp_bind.mjs";
/**
 * 
 * @param {*} YearStart 
 * @param {*} YearEnd 
 * @param {*} Longitude 地理經度
 * @param {*} Latitude 地理緯度
 * @returns 
 */
// export const D3 = (YearStart, YearEnd, Longitude, Latitude, h, MansSystem) => {
export default (YearStart, YearEnd, Longitude, Latitude, h, MansSystem) => {
  YearEnd = YearEnd || YearStart;
  MansSystem = MansSystem || 'Shi'
  const Main = (Y) => {
    const {
      LeapNumTerm,
      NewmUT1JdPrint: NewmUT1Jd
    } = CalNewm(Y, Y, Longitude)[0];
    /// ////
    const YearScOrder = (((Y - 3) % 60) + 60) % 60;
    const YearSc = ScList[YearScOrder];
    const YearStem = StemList.indexOf(YearSc[0]);
    const YearBranch = BranchList.indexOf(YearSc[1]);
    let Title = "";
    if (Y > 0) Title = `${Y}年歲次${YearSc}七政經緯宿度`;
    else Title = `前${1 - Y}年歲次${YearSc}七政經緯宿度`;
    const Era = `VSOP87 ELP2000 曆表`;
    const YuanYear = (((Y - 604) % 180) + 180) % 180; // 術數的元，以604甲子爲上元，60年一元，凡三元
    const YuanOrder = Math.trunc(YuanYear / 60);
    const ThreeYuanYear = YuanYear - YuanOrder * 60;
    const Yuan = `${YuanList[YuanOrder]}元${nzh.encodeS(ThreeYuanYear + 1)}年`;
    const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear);
    const YearColor = YearColorConvert(YuanYear);
    // const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建
    const ZhengMonScOrder = (YearStem * 12 - 9) % 60;
    const MonName = [];
    const MonInfo = [];
    const MonColor = [];
    const Sc = [];
    const Jd = [];
    const Week = [];
    const Pos = [];
    const Rise = [];
    const Morningstar = [];
    const Duskstar = [];
    let DayAccum = 0;
    for (let i = 1; i <= 12 + (LeapNumTerm > 0 ? 1 : 0); i++) { // 有閏就13
      let NoleapMon = i;
      if (LeapNumTerm > 0) {
        if (i >= LeapNumTerm + 1) NoleapMon = i - 1;
      }
      MonName[i] = `${MonNumList1[NoleapMon]}月`;
      if (LeapNumTerm > 0 && i === LeapNumTerm + 1)
        MonName[i] = `閏${MonNumList1[LeapNumTerm]}月`;
      MonName[i] +=
        Math.trunc(NewmUT1Jd[i]) - Math.trunc(NewmUT1Jd[i - 1]) === 29
          ? "小"
          : "大";
      const MonColorFunc = MonColorConvert(
        YuanYear,
        NoleapMon,
        ZhengMonScOrder,
      );
      MonInfo[i] = MonColorFunc.MonInfo;
      MonColor[i] = MonColorFunc.MonColor;
      (Sc[i] = []),
        (Jd[i] = []),
        (Week[i] = []),
        (Rise[i] = []),
        (Morningstar[i] = []),
        (Duskstar[i] = []),
        Pos[i] = []
      const { EclpAccumList, EquaAccumList, CecAccumList } = mansModernList(NewmUT1Jd[i - 1] + 15, MansSystem) // 取月中的宿積度表，減少計算次數
      for (
        let k = 1;
        k <= Math.trunc(NewmUT1Jd[i] - .5) - Math.trunc(NewmUT1Jd[i - 1] - .5);
        k++
      ) {
        DayAccum++;
        const DeltaT = deltaT(NewmUT1Jd[i - 1] + 15) // 本月DeltaT        
        const LocalMidnUT1Jd = Math.round(NewmUT1Jd[i - 1] + k - 1) - .5 // 儒略日半夜是0.5，所以要四捨五入再減.5
        Jd[i][k] = LocalMidnUT1Jd + .5
        const MidnTTJd = LocalMidnUT1Jd + DeltaT - Longitude / 360
        /// ///////天文曆///////////
        const { EquaLon, EquaLat, EclpLon, EclpLat, CecLon, CecLat, HoriLon, HoriLat } = bindTopo_vsop(MidnTTJd, Longitude, Latitude, h)
        const SunEclpLatNoon = calPos_vsop('Sun', MidnTTJd + .5).EquaLat
        Pos[i][k] = []
        for (let j = 0; j < 7; j++) { // 七政赤道、極黃、黃道、入宿度
          const EquaMans = deg2MansModern(EquaLon[j] * R2D, EquaAccumList).Mans;
          const CecMans = deg2MansModern(CecLon[j], CecAccumList).Mans;
          const EclpMans = deg2MansModern(EclpLon[j] * R2D, EclpAccumList).Mans;
          Pos[i][k].push(
            { [PlanetList[j] + "HoriLon"]: (HoriLon[j] * R2D).toFixed(4), [PlanetList[j] + "HoriLat"]: lat2NS(HoriLat[j] * R2D) },
            { [PlanetList[j] + "EquaLon"]: (EquaLon[j] * R2D).toFixed(4), [PlanetList[j] + "EquaLat"]: lat2NS(EquaLat[j] * R2D) },
            { [PlanetList[j] + "CecLon"]: CecLon[j].toFixed(4), [PlanetList[j] + "CecLat"]: lat2NS(CecLat[j]) },
            { [PlanetList[j] + "EclpLon"]: (EclpLon[j] * R2D).toFixed(4), [PlanetList[j] + "EclpLat"]: lat2NS(EclpLat[j] * R2D) },
            { [PlanetList[j] + "Equa"]: EquaMans, [PlanetList[j] + "Cec"]: CecMans, [PlanetList[j] + "Eclp"]: EclpMans })
        }
        const TwilightLeng = twilight(Latitude, SunEclpLatNoon * R2D);
        const { t: Rise, tSet: Set } = sunRise(Latitude, SunEclpLatNoon * R2D)
        const Morning = Rise - TwilightLeng
        const Dusk = Set + TwilightLeng
        Morningstar[i][k] = [
          {
            Morningstar: midstarModern(MidnTTJd + Morning, Longitude, EquaAccumList), Morning: deci2hms(Morning).hm, SunRise: deci2hms(Rise).hm
          },
          { SunSet: deci2hms(Set).hm, Dusk: deci2hms(Dusk).hm, Duskstar: midstarModern(MidnTTJd + Dusk, Longitude, EquaAccumList) }]
        ///////////具注曆////////////
        Sc[i][k] = ScList[jd2Date(Jd[i][k]).ScOrder];
        const MansOrder = (Jd[i][k] + 11) % 28;
        const WeekOrder = (Jd[i][k] + 0) % 7;
        const date = jd2Date(Jd[i][k]);
        Jd[i][k] += ` ${date.mm}.${date.dd} `
        Jd[i][k] += WeekList[WeekOrder] + MansNameList[MansOrder]
        Sc[i][k] = `${NumList[k]}日${Sc[i][k]}`;
      }
    }
    DayAccum = `\n凡${nzh.encodeS(DayAccum)}日　${Yuan}`;
    return {
      Era,
      Title,
      DayAccum,
      YearGod,
      YearColor,
      MonName,
      MonInfo,
      MonColor,
      Sc,
      Jd,
      Pos,
      Morningstar
    };
  };
  const result = [];
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    result.push(Main(Y));
  }
  return result;
};
// console.log(D3(2024, 2024, 116.428, 39.5))
