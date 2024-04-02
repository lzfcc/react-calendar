import Para from "../parameter/calendars.mjs";
import {
  NameList,
  ScList,
  StemList,
  BranchList,
  StemList1,
  BranchList1,
  NayinList,
  WeekList,
  WeekList1,
  MansionNameList,
  MansionAnimalNameList,
  JianchuList,
  HuangheiList,
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
  Lat2NS,
  Lon2Gong,
  moonRiseQing,
} from "../astronomy/pos_convert.mjs";

import CalNewm from "../newmoon/index.mjs";
import { mansionQing, midstarQing } from "../astronomy/mansion.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { deci2hms } from "../time/decimal2clock.mjs";
import { nzh } from "../parameter/functions.mjs";
import { sunQing, moonQing } from "../newmoon/newm_shixian.mjs";

export const D2 = (Name, YearStart, YearEnd) => {
  YearEnd = YearEnd || YearStart;
  const Main = (Name, Y) => {
    const { Solar, Sobliq, RiseLat } = Para[Name];
    const {
      LeapNumTerm,
      Sols,
      SunRoot,
      SperiRoot,
      MoonRoot,
      MapoRoot,
      NodeRoot,
      NewmSmd,
      SolsmorScOrder,
      MansionDaySolsmor,
    } = CalNewm(Name, Y)[0];
    /// ////
    const YearScOrder = (((Y - 3) % 60) + 60) % 60;
    const YearSc = ScList[YearScOrder];
    const YearStem = StemList.indexOf(YearSc[0]);
    const YearBranch = BranchList.indexOf(YearSc[1]);
    let Title = "";
    if (Y > 0) Title = `${Y}年歲次${YearSc}`;
    else Title = `前${1 - Y}年歲次${YearSc}`;
    Title += "日月經緯宿度時憲曆";
    const Era = `欽天監欽遵御製${NameList[Name]}印造時憲曆頒行天下`;
    const YuanYear = (((Y - 604) % 180) + 180) % 180; // 術數的元，以604甲子爲上元，60年一元，凡三元
    const YuanOrder = Math.trunc(YuanYear / 60);
    const ThreeYuanYear = YuanYear - YuanOrder * 60;
    const Yuan = `${YuanList[YuanOrder]}元${nzh.encodeS(ThreeYuanYear + 1)}年`;
    const YearGod = YearGodConvert(YearStem, YearBranch, YearScOrder, YuanYear);
    const YearColor = YearColorConvert(YuanYear);
    // const ZhengMonScOrder = Math.round((YearStem * 12 - 9) % 60.1) // 正月月建
    const ZhengMonScOrder = (YearStem * 12 - 9) % 60;
    const SmJd = 2086292 + (Solar * (Y - 1000)) + 1
    const MonName = [];
    const MonInfo = [];
    const MonColor = [];
    const Sc = [];
    const Jd = [];
    const Nayin = [];
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
    const MoonRise = [];
    const NodeMapo = [];
    let DayAccum = 0;
    const JieAccum = 0; // 各節積日
    const JianchuDayAccum = NewmSmd[0]; // 建除
    const JianchuOrigin = 0;
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
        Math.trunc(NewmSmd[i]) - Math.trunc(NewmSmd[i - 1]) === 29
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
        (Nayin[i] = []),
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
        (MoonRise[i] = []),
        (NodeMapo[i] = []);
      for (
        let k = 1;
        k <= Math.trunc(NewmSmd[i]) - Math.trunc(NewmSmd[i - 1]);
        k++
      ) {
        // 每月日數
        const SmdMidn = Math.trunc(NewmSmd[i - 1]) + k; // 每日夜半距冬至次日夜半日數
        // const SmdMidn = 263 // 1722-9-11八月朔 :263 廖育棟01:05
        DayAccum++; // 這個位置不能變
        /// ///////天文曆///////////
        const { Sorb, SunCorr, SunLon, SunGong, Speri } = sunQing(
          Name,
          SunRoot,
          SperiRoot,
          SmdMidn,
        );
        const { SunLon: SunLonMor } = sunQing(
          Name,
          SunRoot,
          SperiRoot,
          SmdMidn + 1,
        );
        const { MoonGong, MoonLon, MoonLat, Node, Mapo } = moonQing(
          Name,
          MoonRoot,
          NodeRoot,
          MapoRoot,
          SmdMidn,
          SunCorr,
          SunGong,
          Speri,
          Sorb,
        );
        const Func = mansionQing(Name, Y, SunGong);
        Eclp[i][k] = deg2Hms(SunLon) + Func.Eclp;
        // EclpMansion[i][k] =  // 注意：入宿度是轉換成了古度的
        const SEquaLon = LonHigh2Flat(Sobliq, SunLon);
        Equa[i][k] = deg2Hms(SEquaLon) + Func.Equa;
        // EquaMansion[i][k]
        Lat[i][k] = Lat2NS(HighLon2FlatLat(Sobliq, SunLon));
        Rise[i][k] = sunRiseQing(Sobliq, RiseLat, SunLon);
        const TwilightLeng = twilight(Sobliq, RiseLat, SunLon);
        const Func2 = midstarQing(Name, Y, SunLon, SunLonMor, Rise[i][k]);
        Morningstar[i][k] =
          `${deci2hms(Rise[i][k] - TwilightLeng).hm} ${Func2.Morningstar}`;
        Duskstar[i][k] =
          `${deci2hms(1 - Rise[i][k] + TwilightLeng).hm} ${Func2.Duskstar}`;
        Rise[i][k] =
          `${deci2hms(Rise[i][k]).hms} ${deci2hms(1 - Rise[i][k]).hm}`;
        MoonEclp[i][k] = deg2Hms(MoonLon) + mansionQing(Name, Y, MoonGong).Eclp;
        MoonEclpLat[i][k] = Lat2NS(MoonLat);
        const Func3 = eclp2Equa(Sobliq, MoonLon, MoonLat);
        MoonEqua[i][k] =
          deg2Hms(Func3.EquaLon) +
          mansionQing(Name, Y, Lon2Gong(Func3.EquaLon), true).Equa;
        MoonEquaLat[i][k] = Lat2NS(Func3.EquaLat);
        const { MoonRise: MoonRiseTmp, MoonSet: MoonSetTmp } = moonRiseQing(
          RiseLat,
          Func3.EquaLon,
          Func3.EquaLat,
          SEquaLon,
        );
        MoonRise[i][k] =
          `${deci2hms(MoonRiseTmp).hms} ${deci2hms(MoonSetTmp).hm}`;
        NodeMapo[i][k] = deg2Hms(Node) + deg2Hms(Mapo);
        /// ////////具注曆////////////
        const ScOrder = Math.trunc(SolsmorScOrder + SmdMidn - 1) % 60;
        Sc[i][k] = ScList[ScOrder];
        const JdTmp = Math.trunc(SmJd + SmdMidn)
        const JdScDif = jd2Date(JdTmp).ScOrder - ScOrder
        Jd[i][k] = JdTmp - (JdScDif > 50 ? JdScDif - 60 : (JdScDif < -50 ? JdScDif + 60 : JdScDif));
        const date = jd2Date(Jd[i][k]);
        Jd[i][k] += ` ${date.mm}.${date.dd}`;
        const MansionOrder = (MansionDaySolsmor + DayAccum - 1) % 28;
        const WeekOrder = (MansionDaySolsmor + DayAccum + 2) % 7;
        Week[i][k] =
          WeekList[WeekOrder] +
          WeekList1[WeekOrder] +
          MansionNameList[MansionOrder] +
          MansionAnimalNameList[MansionOrder];
        Sc[i][k] = `${NumList[k]}日${Sc[i][k]}`;
      }
    }
    DayAccum =
      `僞造者依律處斬有能吿捕者官給賞銀五十兩如無本監曆日印信即同私造` +
      `\n凡${nzh.encodeS(DayAccum)}日　${Yuan}`;
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
      Nayin,
      Week,
      Eclp,
      Equa,
      Lat,
      Morningstar,
      Rise,
      Duskstar,
      MoonEclp,
      MoonEclpLat,
      MoonEqua,
      MoonEquaLat,
      MoonRise,
      NodeMapo,
    };
  };
  const result = [];
  for (let Y = YearStart; Y <= YearEnd; Y++) {
    result.push(Main(Name, Y));
  }
  return result;
};
// console.log(D2('Guimao', 2001))
