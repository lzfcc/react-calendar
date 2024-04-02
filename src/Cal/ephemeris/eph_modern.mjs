import Para from "../parameter/calendars.mjs";
import {
  NameList,
  ScList,
  StemList,
  BranchList,
  WeekList,
  WeekList1,
  MansionNameList,
  MansionAnimalNameList,
  YuanList,
  NumList,
  MonNumList1,
} from "../parameter/constants.mjs";
import { YearGodConvert, YearColorConvert, MonColorConvert } from "./luck.mjs";
import {
  eclp2Equa,
  LonHigh2Flat,
  HighLon2FlatLat,
  sunRiseQing,
  twilight,
  deg2Hms,
  Lon2Gong,
} from "../astronomy/pos_convert.mjs";

import CalNewm from "../newmoon/index_de.mjs";
import { midstarQing } from "../astronomy/mansion.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { deci2hms } from "../time/decimal2clock.mjs";
import { R2D, nzh } from "../parameter/functions.mjs";
import { mansionModern } from "../modern/mansion.mjs";
import { bindPos_vsop } from "../modern/vsop_elp.mjs";
import { sunRise } from "../astronomy/pos_convert_modern.mjs";
const Lat2NS = (X) => (X > 0 ? "N" : "S") + Math.abs(X).toFixed(4);
/**
 * 
 * @param {*} YearStart 
 * @param {*} YearEnd 
 * @param {*} Longitude 地理經度
 * @param {*} Latitude 地理緯度
 * @returns 
 */
// export const D3= (YearStart, YearEnd, Longitude, Latitude) => {
export default (YearStart, YearEnd, Longitude, Latitude) => {
  YearEnd = YearEnd || YearStart;
  const Main = (Y) => {
    const {
      LeapNumTerm,
      NewmJdPrint: NewmJd
    } = CalNewm(Y)[0];
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
    const Equa = [];
    const Eclp = [];
    const Rise = [];
    const Morningstar = [];
    const Lat = [];
    const Duskstar = [];
    const MoonEclp = [];
    const MoonEclpLat = [];
    const MoonEqua = [];
    const MoonEquaLat = [];
    const SaturnEclp = [], SaturnEqua = [], JupiterEclp = [], JupiterEqua = [], MarsEclp = [], MarsEqua = [], VenusEclp = [], VenusEqua = [], MercuryEclp = [], MercuryEqua = []
    let DayAccum = 0;
    for (let i = 1; i <= 12 + (LeapNumTerm > 0 ? 1 : 0); i++) {
      // 有閏就13
      let NoleapMon = i;
      if (LeapNumTerm > 0) {
        if (i >= LeapNumTerm + 1) NoleapMon = i - 1;
      }
      MonName[i] = `${MonNumList1[NoleapMon]}月`;
      if (LeapNumTerm > 0 && i === LeapNumTerm + 1)
        MonName[i] = `閏${MonNumList1[LeapNumTerm]}月`;
      MonName[i] +=
        Math.trunc(NewmJd[i]) - Math.trunc(NewmJd[i - 1]) === 29
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
        (Eclp[i] = []),
        (Equa[i] = []),
        (Rise[i] = []),
        (Morningstar[i] = []),
        (Lat[i] = []),
        (Duskstar[i] = []),
        (MoonEclp[i] = []),
        (MoonEclpLat[i] = []),
        (MoonEqua[i] = []),
        (MoonEquaLat[i] = []),
        SaturnEclp[i] = [],
        SaturnEqua[i] = [],
        JupiterEclp[i] = [],
        JupiterEqua[i] = [],
        MarsEclp[i] = [],
        MarsEqua[i] = [],
        VenusEclp[i] = [],
        VenusEqua[i] = [],
        MercuryEclp[i] = [],
        MercuryEqua[i] = []
      for (
        let k = 1;
        k <= Math.trunc(NewmJd[i]) - Math.trunc(NewmJd[i - 1]);
        k++
      ) {
        DayAccum++; // 這個位置不能變
        Jd[i][k] = Math.trunc(NewmJd[i]) + k - 1
        /// ///////天文曆///////////
        const { EquaLon, EquaLat, EclpLon, EclpLat, CeclpLon, CeclpLat, Obliq } = bindPos_vsop(Jd[i][k])
        // const PlanetList = ['Sun', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Venus', 'Mercury']
        Eclp[i][k] = CeclpLon[0].toFixed(4) + ' ' + Lat2NS(CeclpLat[0])
        Equa[i][k] = (EquaLon[0] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[0] * R2D)
        Rise[i][k] = sunRise(Obliq * R2D, Latitude, EclpLon[0] * R2D)
        // const TwilightLeng = twilight(Obliq * R2D, Latitude, EclpLon[0] * R2D);
        MoonEclp[i][k] = CeclpLon[1].toFixed(4) + ' ' + Lat2NS(CeclpLat[1])
        MoonEqua[i][k] = (EquaLon[1] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[1] * R2D)
        SaturnEclp[i][k] = CeclpLon[2].toFixed(4) + ' ' + Lat2NS(CeclpLat[2])
        SaturnEqua[i][k] = (EquaLon[2] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[2] * R2D)
        JupiterEclp[i][k] = CeclpLon[3].toFixed(4) + ' ' + Lat2NS(CeclpLat[3])
        JupiterEqua[i][k] = (EquaLon[3] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[3] * R2D)
        MarsEclp[i][k] = CeclpLon[4].toFixed(4) + ' ' + Lat2NS(CeclpLat[4])
        MarsEqua[i][k] = (EquaLon[4] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[4] * R2D)
        VenusEclp[i][k] = CeclpLon[5].toFixed(4) + ' ' + Lat2NS(CeclpLat[5])
        VenusEqua[i][k] = (EquaLon[5] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[5] * R2D)
        MercuryEclp[i][k] = CeclpLon[6].toFixed(4) + ' ' + Lat2NS(CeclpLat[6])
        MercuryEqua[i][k] = (EquaLon[6] * R2D).toFixed(4) + ' ' + Lat2NS(EquaLat[6] * R2D)
        /// ////////具注曆////////////
        Sc[i][k] = ScList[jd2Date(Jd[i][k]).ScOrder];
        const MansionOrder = (Jd[i][k] + 0) % 28;
        const WeekOrder = (Jd[i][k] + 0) % 7;
        const date = jd2Date(Jd[i][k]);
        Jd[i][k] += ` ${date.mm}.${date.dd} `
        Jd[i][k] += WeekList[WeekOrder] + MansionNameList[MansionOrder]
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
      Eclp,
      Equa,
      // Morningstar,
      // Rise,
      // Duskstar,
      MoonEclp,
      MoonEqua,
      SaturnEclp, SaturnEqua, JupiterEclp, JupiterEqua, MarsEclp, MarsEqua, VenusEclp, VenusEqua, MercuryEclp, MercuryEqua
    };
  };
  const result = [];
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    result.push(Main(Y));
  }
  return result;
};
// console.log(D3(2001, 2001, 116.428, 39.5))
