// 可參考廖育棟的時憲曆日月氣朔網站 http://ytliu.epizy.com/Shixian/index_chinese.html ，有一分很漂亮的公式說明。
import { ScList } from "../parameter/constants.mjs";
import { deltaT } from "../time/delta-t.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { D2R, pi, pi2, abs, r2dfix } from "../parameter/functions.mjs";
import { calPos_vsop } from "../modern/vsop_elp.mjs";

export const N5 = (Y) => {
  const EpoSolsJd = 2451534.749; // 取癸卯曆1999年12月22日平冬至時間儒略日
  // const EpoSolsJd = 2086292.4148
  const ChouConst = 15.68; // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
  const CloseOriginAd = 2000;
  // const CloseOriginAd = 1000
  const Solar = 365.2422;
  const Lunar = 29.530588853;
  const TermLeng = Solar / 12;
  const OriginAccum = (Y - CloseOriginAd) * Solar; // 中積
  const AvgSolsJd = EpoSolsJd + OriginAccum;
  const ChouSd = (Lunar - (OriginAccum % Lunar) + ChouConst) % Lunar; // 首朔
  const main = (isNewm, LeapNumTerm) => {
    const AcrJd = [];
    const UT18Sc = [];
    const UT18Deci = [];
    const NowDeci = [];
    const Eclp = [];
    const Equa = [];
    const AcrTermJd = [];
    const TermAcrSc = [];
    const TermAcrDeci = [];
    const TermEqua = [];
    const Term1AcrSc = [];
    const Term1AcrDeci = [];
    const Term1Equa = [];
    // 西曆推朔望的思路和古曆不一樣，需要求得平朔望當日子正日月實行，兩者相較，得實朔望與平朔望是否在同一日，確定實朔望在哪一天，再算當日與次日子正實行，求得實朔望泛時。
    for (let i = 0; i <= 14; i++) {
      /// ///// 平朔望
      const AvgSd = ChouSd + (i + (isNewm ? 0 : 0.5)) * Lunar; // 各月平朔望到冬至次日子正日分
      const AvgJd = AvgSd + AvgSolsJd;
      const delta = (Jd) => {
        const Sun = calPos_vsop("Sun", Jd);
        const Moon = calPos_vsop("Moon", Jd);
        let a = Sun.Lon - Moon.Lon - (isNewm ? 0 : pi);
        const b = Moon.Lon1 - Sun.Lon1;
        if (a < (-7 / 4) * pi) a += pi2;
        return a / b;
      };
      let D = delta(AvgJd);
      AcrJd[i] = AvgJd;
      while (abs(D) > 1e-5) {
        // 1e-8循環三次，1e-5兩次，1e-3一次。（上行的初始Delta除外）
        AcrJd[i] += D;
        D = delta(AcrJd[i]);
      }
      const UT18Jd = AcrJd[i] - deltaT(Y) + 8 / 24;
      const UT18JdDate = jd2Date(UT18Jd);
      UT18Sc[i] = ScList[UT18JdDate.ScOrder];
      UT18Deci[i] = UT18JdDate.hms;
      const FuncEclp = calPos_vsop("Sun", AcrJd[i]);
      Eclp[i] = r2dfix(FuncEclp.Lon);
      Equa[i] = r2dfix(FuncEclp.EquaLon);
      /// ///// 節氣
      if (isNewm) {
        // 中氣
        const TermLon = D2R * (((2 * i + 2) * 15 + 270) % 360);
        const AvgTermSd = (i + 1) * TermLeng;
        const AvgTermJd = AvgTermSd + AvgSolsJd;
        const delta = (Jd) => {
          const Sun = calPos_vsop("Sun", Jd);
          let a = TermLon - Sun.Lon;
          if (a < (-7 / 4) * pi) a += pi2;
          const b = Sun.Lon1;
          return a / b;
        };
        let D = delta(AvgTermJd);
        AcrTermJd[i] = AvgTermJd;
        while (abs(D) > 1e-5) {
          AcrTermJd[i] += D;
          D = delta(AcrTermJd[i]);
        }
        const UT18TermJd = AcrTermJd[i] + 8 / 24 - deltaT(Y);
        const UT18TermJdDate = jd2Date(UT18TermJd);
        TermAcrSc[i] = ScList[UT18TermJdDate.ScOrder];
        TermAcrDeci[i] = UT18TermJdDate.hms;
        const FuncTermEclp = calPos_vsop("Sun", AcrTermJd[i]);
        TermEqua[i] = r2dfix(FuncTermEclp.EquaLon);
        // 節氣
        const Term1Lon = D2R * (((2 * i + 1) * 15 + 270) % 360);
        const AvgTerm1Sd = (i + 0.5) * TermLeng;
        const AvgTerm1Jd = AvgTerm1Sd + AvgSolsJd;
        const delta1 = (Jd) => {
          const Sun = calPos_vsop("Sun", Jd);
          let a = Term1Lon - Sun.Lon;
          if (a < (-7 / 4) * pi) a += pi2;
          const b = Sun.Lon1;
          return a / b;
        };
        let D1 = delta1(AvgTerm1Jd);
        let AcrTerm1Jd = AvgTerm1Jd;
        while (abs(D1) > 1e-5) {
          AcrTerm1Jd += D1;
          D1 = delta1(AcrTerm1Jd);
        }
        const UT18Term1Jd = AcrTerm1Jd + 8 / 24 - deltaT(Y);
        const UT18Term1JdDate = jd2Date(UT18Term1Jd);
        Term1AcrSc[i] = ScList[UT18Term1JdDate.ScOrder];
        Term1AcrDeci[i] = UT18TermJdDate.hms;
        const FuncTerm1Eclp = calPos_vsop("Sun", AcrTerm1Jd);
        Term1Equa[i] = r2dfix(FuncTerm1Eclp.EquaLon);
      }
    }
    /// ///// 置閏
    LeapNumTerm = LeapNumTerm || 0;
    if (isNewm) {
      for (let i = 1; i <= 12; i++) {
        if (
          Math.trunc(AcrTermJd[i]) < Math.trunc(AcrJd[i + 1]) &&
          Math.trunc(AcrTermJd[i + 1]) >= Math.trunc(AcrJd[i + 2])
        ) {
          LeapNumTerm = i; // 閏Leap月，第Leap+1月爲閏月
          break;
        }
      }
    }
    return {
      AcrJd,
      UT18Sc,
      UT18Deci,
      NowDeci,
      Eclp,
      Equa,
      TermAcrSc,
      TermAcrDeci,
      TermEqua, // TermEclp,
      Term1AcrSc,
      Term1AcrDeci,
      Term1Equa, // Term1Eclp,
      LeapNumTerm,
    };
  };
  const {
    AcrJd: NewmJd,
    UT18Sc: NewmSc,
    UT18Deci: NewmDeci,
    Equa: NewmEqua,
    Eclp: NewmEclp,
    TermAcrSc,
    TermAcrDeci,
    TermEqua, // TermEclp,Term1Eclp,
    Term1AcrSc,
    Term1AcrDeci,
    Term1Equa,
    LeapNumTerm,
  } = main(true);
  const { UT18Sc: SyzygySc, UT18Deci: SyzygyDeci } = main(false, LeapNumTerm);
  return {
    NewmSc,
    NewmDeci,
    NewmEqua,
    NewmEclp,
    SyzygySc,
    SyzygyDeci,
    TermAcrSc,
    TermAcrDeci,
    TermEqua, // TermEclp,Term1Eclp
    Term1AcrSc,
    Term1AcrDeci,
    Term1Equa,
    LeapNumTerm,
    /// / 曆書用
    NewmJd,
    AvgSolsJd,
  };
};
// console.log(N5(2024))
