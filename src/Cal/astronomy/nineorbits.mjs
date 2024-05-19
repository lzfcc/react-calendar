import Para from "../parameter/calendars.mjs";
import { AutoMoonAvgV } from "../parameter/auto_consts.mjs";

/**
 * 月行九道Type >= 7 && Type <= 10 《數理》p343「凡合朔所交⋯⋯」指合朔之前的升交或降交點
 * @param {*} NodeAccum 合朔入交
 * @param {*} NewmSd 合朔距冬至時間
 * @param {*} Name
 * @returns
 */
export const nineOrbits = (NodeAccum, NewmSd, Name) => {
  const { SolarRaw, Node, LunarRaw } = Para[Name];
  let { Solar, Lunar } = Para[Name];
  Lunar = Lunar || LunarRaw;
  Solar = Solar || SolarRaw;
  const NodeHalf = Node / 2;
  const Limit = (Lunar - Node) / 2; // 望差
  const HalfTermLeng = Solar / 24;
  const NodeGong =
    (NewmSd - (NodeAccum % NodeHalf) * AutoMoonAvgV(Name) + Solar) % Solar; // 正交黃道度
  // OrbColor 黃0青1白2黑3朱4
  let OrbColor = 0;
  if (NodeGong < 3 * HalfTermLeng || NodeGong >= 21 * HalfTermLeng) {
    // 冬
    if (NodeAccum > NodeHalf) {
      OrbColor = 1;
    } else {
      OrbColor = 2;
    }
  } else if (NodeGong >= 3 * HalfTermLeng && NodeGong < 9 * HalfTermLeng) {
    // 春
    if (NodeAccum > NodeHalf) {
      OrbColor = 3;
    } else {
      OrbColor = 4;
    }
  } else if (NodeGong >= 9 * HalfTermLeng && NodeGong < 15 * HalfTermLeng) {
    // 夏
    if (NodeAccum > NodeHalf) {
      OrbColor = 2;
    } else {
      OrbColor = 1;
    }
  } else {
    // 秋
    if (NodeAccum > NodeHalf) {
      OrbColor = 4;
    } else {
      OrbColor = 3;
    }
  }
  if (
    (NodeAccum > NodeHalf - Limit && NodeAccum < NodeHalf) ||
    NodeAccum < Limit ||
    (NodeAccum > NodeHalf && NodeAccum < NodeHalf + Limit) ||
    NodeAccum > Node - Limit
  ) {
    OrbColor = 0;
  }
  return OrbColor;
};

const Exhaustion = () => {
  // 大同歲實365.2469 設在0.015-.018之間。365.262566
  let Sidereal = 365.2579;
  let Print = "";
  while (Sidereal < 365.2689) {
    Sidereal = +(Sidereal + 0.000001).toFixed(6);
    const Solar = 365 + 9681 / 39616;
    const Accum = Solar * 1025699;
    const Deg = (121.2599 + Accum) % Sidereal;
    // const DuskstarDeg = (Deg + .225 * Sidereal + .7) % Sidereal
    if (Deg >= 87 && Deg < 87.9) {
      // if (DuskstarDeg >= 183.2599 && DuskstarDeg < 184.2499) {
      Print += "," + Sidereal; // + ':' + Deg}
      // }
    }
    return Print;
  }
};
// console.log(Exhaustion())
