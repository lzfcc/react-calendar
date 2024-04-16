import { Hushigeyuan, RoundL2H } from '../equation/geometry.mjs';
import { Interpolate1 } from '../equation/sn.mjs';
import { AutoMoonAvgV, nodeQuar } from '../parameter/auto_consts.mjs';
import Para from '../parameter/calendars.mjs';
import { AutoDifAccum, AutoTcorr } from './acrv.mjs';
import { equa2EclpPoly } from './equa_eclp.mjs';
import { deg2Mansion, mansion2Deg, solsMansion } from './mansion.mjs';

/**
 * 黃白差、赤白差。大衍欽天應天的黃赤差極大值是黃白差的兩倍。大衍Max黃白差=1.5。
 * @param {*} Sd
 * @param {*} NodeAccumRaw
 * @param {*} Name
 * @returns
 */
const MoonLonTable = (Node1EclpGong, NodeDif, Name) => {
  const { Solar, Type, Sidereal } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  const Xian = Name === 'Qintian' ? Sidereal / 72 : 5; // 欽天黃道8節72限。是交點週期還是黃道周長？
  const NodeOcta = nodeQuar / 2;
  const NodeQuar3 = 3 * NodeQuar;
  const NodeHalf = NodeQuar * 2;
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  const Solar75 = Solar * 0.75;
  const NodeDifHalf = NodeDif % NodeHalf;
  const NodeDifQuar = NodeDif % NodeQuar;
  const Node1EclpGongHalf = Node1EclpGong % Solar50; // 計去冬夏至以來度數
  let NodeDifRev = NodeDifHalf;
  if (
    (NodeDifRev >= NodeQuar && NodeDifRev < NodeHalf)
    || NodeDifRev >= NodeQuar3
  ) {
    NodeDifRev = NodeQuar * 2 - NodeDifRev;
  }
  const NodeDifQuarRev = NodeDifQuar < NodeQuar / 2 ? NodeDifQuar : NodeQuar - NodeDifQuar;
  // let Range = [];
  // if (Type === 6) { // 麟德沒有
  //   Range = [
  //     0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2.94, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  //   ]; // 《中國古代曆法》頁60
  // } else {
  //   Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0.94, 5, 5, 5, 5, 5, 5, 5, 5, 5]; // 0.94:一度弱. 大衍：「終於半交，其去黃道六度」「更從四起，每限增一，終於十二，復與日軌相會。」
  // }
  // const XianAccum = Range.slice(); // 表中的黃道度
  // for (let i = 1; i <= Len + 1; i++) {
  //   XianAccum[i] += XianAccum[i - 1];
  // }

  let XianAccum = [];
  // 《古代曆法》改成一度弱，但大衍、應天都是一度強或一度少強，不太可能同時錯，欽天也是黃道分為八節九限。照理說應該用363.3，為什麼古曆都用回歸年？
  if (Type === 6) {
    XianAccum = [
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 47.31, 51.31, 55.31, 59.31,
      63.31, 67.31, 71.31, 75.31, 79.31, 83.31, 87.31, 91.31,
    ];
  } else if (Name === 'Qintian') {
    // 欽天沒有多餘的依平，直接平分
    XianAccum = [
      0, 5.072840277777778, 10.145680555555556, 15.218520833333333,
      20.29136111111111, 25.36420138888889, 30.437041666666666,
      35.509881944444444, 40.58272222222222, 45.6555625, 50.72840277777778,
      55.80124305555556, 60.87408333333333, 65.94692361111112,
      71.01976388888889, 76.09260416666667, 81.16544444444445,
      86.23828472222222, 91.311125,
    ];
  } else {
    XianAccum = [
      0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 46.31, 51.31, 56.31, 61.31, 66.31,
      71.31, 76.31, 81.31, 86.31, 91.31,
    ];
  }
  let XianDifInitial = 0;
  let XianDifChange = 0;
  if (Type === 6) {
    XianDifInitial = 11 / 45; // ⋯⋯四度爲限，初十一，每限損一，以終於一
    XianDifChange = -1 / 45;
  } else if (Name === 'Qintian') {
    XianDifInitial = 40 / 72;
    XianDifChange = -5 / 72;
  } else if (Type === 7 || Name === 'Chongxuan') {
    XianDifInitial = 12 / 48;
    XianDifChange = -1 / 48;
  } else if (Name === 'Yingtian') {
    XianDifInitial = 12 / 40.4; // 《中國古代曆法》p59：分母20.2
    XianDifChange = -1.5 / 40.4;
  } else if (Name === 'Qianyuan') {
    XianDifInitial = 9 / 33.6;
    XianDifChange = -1 / 33.6;
  } else if (Name === 'Yitian') {
    XianDifInitial = 107 / 404;
    XianDifChange = -10 / 404;
  }
  // 造表法：
  const Len = XianAccum.length - 1;
  const LenHalf = Math.floor(Len / 2);
  let XianDif = [];
  XianDif[0] = 0;
  XianDif[1] = XianDifInitial;
  for (let i = 1; i < LenHalf; i++) {
    XianDif[i + 1] = XianDif[i] + XianDifChange;
  }
  XianDif = [...XianDif, 0, ...XianDif.reverse()];
  let XianDifAccum = [];
  XianDifAccum[0] = XianDif[0];
  for (let i = 1; i < LenHalf + 1; i++) {
    XianDifAccum[i] = XianDifAccum[i - 1] + XianDif[i];
  }
  XianDifAccum = [...XianDifAccum, ...XianDifAccum.reverse()];
  let XianOrder = 0;
  for (let j = 0; j < Len + 1; j++) {
    if (XianAccum[j] <= NodeDifRev && NodeDifRev < XianAccum[j + 1]) {
      XianOrder = j + 1;
      break;
    }
  }
  // 大衍黃白差，欽天等的汎差
  const EclpWhiteDifRaw =
    XianDifAccum[XianOrder - 1] +
    ((XianDifAccum[XianOrder] - XianDifAccum[XianOrder - 1]) *
      (NodeDifRev - XianAccum[XianOrder - 1])) /
    (XianAccum[XianOrder] - XianAccum[XianOrder - 1]); // 線性內插
  // 公式法
  // const EclpWhiteDifRaw = equa2EclpPoly(Name, NodeDifQuarRev, true).Equa2EclpDif / 2;
  // 赤白差
  return 0 // sign1 * EclpWhiteDif + sign2 * EquaWhiteDif;
};

/**
 * 《數》頁361 白道度是以黃道度、正交黃經爲自變量的二元函數
 * @param {*} Node1EclpGong 正交距冬至定積度
 * @param {*} NodeDif 距正交黃道度數
 * @param {*} Name
 * @returns
 */
const eclp2WhiteDif = (Node1EclpGong, NodeDif, Name) => {
  const { Solar, Type } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  const NodeHalf = NodeQuar * 2;
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  const Solar75 = Solar * 0.75;
  const Xian = Name === 'Qintian' ? Solar / 72 : 5; // 欽天黃道8節72限
  const NodeDifQuar = NodeDif % NodeQuar;
  const NodeDifHalf = NodeDif % NodeHalf;
  const NodeDifRev = NodeDifQuar < NodeQuar / 2 ? NodeDifQuar : NodeQuar - NodeDifQuar;
  const Node1EclpGongHalf = Node1EclpGong % Solar50; // 崇天：計去冬夏至以來度數
  const Node1EclpGongEquinox = Math.abs(Node1EclpGongHalf - Solar25); // 紀元：正交距二分度數
  let EquaWhiteDif = 0; // 月行與赤道差數
  let sign1 = 1; // 黃白差符號
  let sign2 = 1; // 赤白差符號
  const EclpWhiteDifRaw = equa2EclpPoly(Name, NodeDifRev).Equa2EclpDif / 2; // 月行與黃道差數
  let EclpWhiteDif = EclpWhiteDifRaw
  // 【曲安京】紀元曆相比以前的改進：劃分月道與黃赤道的相對位置。【我】其實紀元應該是接續了應天的思路
  if (['Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) { // ⚠️太詭異了
    if (NodeDif >= NodeOcta * 3 && NodeDif < NodeOcta * 5) { // 降交點（欽天應天稱正交）前後各九限
      if (Node1EclpGong >= Solar50) { // 冬至之後——交點退行，所以方向是反的
        sign1 = -1;
      }
    } else if (NodeDif >= NodeOcta * 7 || NodeDif < NodeOcta) { // 升交點前後各九限
      if (Node1EclpGong < Solar50) {
        sign1 = -1;
      }
    } // 半交前後各九限
    else if (Node1EclpGong < Solar25 || Node1EclpGong >= Solar75) { // 春分之後——也是反的
      if (NodeDif < NodeHalf) { // 入黃道內
        sign1 = -1;
      }
    } else { // 秋分之後
      if (NodeDif > NodeHalf) { // 出黃道外
        sign1 = -1;
      }
    }
    let XianNum = 0;
    if (
      (NodeDif >= NodeOcta && NodeDif < NodeOcta * 3)
      || (NodeDif >= NodeOcta * 5 && NodeDif < NodeOcta * 7)
    ) { // 半交前後
      XianNum = Math.abs(Node1EclpGongHalf - Solar25) / Xian; // 距二分之宿限數
    } else {
      XianNum = (Solar25 - Math.abs(Solar25 - Node1EclpGongHalf)) / Xian; // 距二至之宿限數
    }
    EclpWhiteDif = EclpWhiteDifRaw * XianNum / 18;
    if (Name === 'Qintian') {
      EquaWhiteDif = EclpWhiteDifRaw / 4 - EclpWhiteDif;
    } else if (Name === 'Yingtian') {
      const a = sign1 === 1 ? 0.9 : 0.7;
      EquaWhiteDif = ((EclpWhiteDifRaw * 2) / 10) * a - EclpWhiteDif; // 「遇減，身外除三；遇加，身外除一。」什麼意思啊？？這個是我猜的
    } else if (['Qianyuan', 'Yitian'].includes(Name)) {
      EquaWhiteDif = (EclpWhiteDifRaw * 2) / 10 - EclpWhiteDif; // 「二曆皆不身外爲法」
    }
    // sign2 = NodeDif < NodeOcta || NodeDif > NodeOcta * 7 || (NodeDif > NodeOcta * 3 && NodeDif < NodeOcta * 5) ? 1 : -1
    sign2 = NodeDifHalf < NodeQuar ? 1 : -1; // 改成和公式法曆法一樣。這幾曆的赤白差符號和大衍的黃白差符號一樣
  } else if (Type === 6 || Type === 7 || Name === 'Chongxuan') {
    EquaWhiteDif = (Node1EclpGongHalf / (Solar / 72) / 18) * EclpWhiteDif; // 大衍：「計去冬至夏至以來候數，乘黃道所差，十八而一」其實應該是整數
    // 大衍：（黃白差）距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加
    // sign1 = NodeDif < NodeOcta || NodeDif > NodeOcta * 7 || (NodeDif > NodeOcta * 3 && NodeDif < NodeOcta * 5) ? 1 : -1 // 距半交前后各九限，以差数为减；距正交前后各九限，以差数爲加
    sign1 = NodeDifHalf < NodeQuar ? 1 : -1; // 改成和公式法曆法一樣
    // 大衍：「距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加」
    const isYinSun = Node1EclpGong > Solar25 && Node1EclpGong < Solar75 ? 1 : -1;
    const isYinMoon = NodeDif < NodeHalf ? 1 : -1;
    sign2 = sign1 * isYinSun * isYinMoon; // 赤白差符號
  } else if (Type === 9 || Type === 10) {
    if (Node1EclpGong > Solar50) {
      // 同名黃白差較大
      EclpWhiteDif = EclpWhiteDifRaw * 1.125; // 月行與黃道定差      
      EquaWhiteDif = (Node1EclpGongEquinox * EclpWhiteDif) / Solar25;
      sign1 = NodeDifHalf < NodeQuar ? 1 : -1;
    } else {
      EclpWhiteDif = EclpWhiteDifRaw * 0.875; // 月行與黃道定差
      EquaWhiteDif = (Node1EclpGongEquinox * EclpWhiteDif) / Solar25;
      sign1 = NodeDifHalf > NodeQuar ? 1 : -1; // 黃白差符號
    }
    sign2 = -sign1;
  } else { // 崇天明天觀天占天
    EquaWhiteDif = (EclpWhiteDif * Node1EclpGongHalf) / 90; // 月行與赤道差數。大衍曆用候數，所以常數是18，宋曆改用度數，所以是90
    sign1 = NodeDifHalf < NodeQuar ? 1 : -1; // 黃白差符號
    const isYinSun = Node1EclpGong > Solar25 && Node1EclpGong < Solar75 ? 1 : -1;
    const isYinMoon = NodeDif < NodeHalf ? 1 : -1;
    sign2 = sign1 * isYinSun * isYinMoon; // 赤白差符號
  }
  return sign1 * EclpWhiteDif + sign2 * EquaWhiteDif;
};
// console.log(eclp2WhiteDif(91, 92, 'Jiyuan').EclpWhiteDif)
const moonLonJiudao = (Node1EclpGong, NewmEclpGong, Name, Y) => {
  let { Solar, SolarRaw, Sidereal } = Para[Name];
  Solar = Solar || SolarRaw;
  Sidereal = Sidereal || Solar;
  const WhiteAccumList = [];
  const { EclpAccumList, SolsEclpDeg } = solsMansion(Name, Y);
  const Node1EclpDeg = (Node1EclpGong + SolsEclpDeg) % Sidereal; // 正交加時黃道宿積度
  const { Name: Node1MansionName, MansDeg: Node1EclpMansionDeg } = deg2Mansion(Node1EclpDeg, EclpAccumList);
  for (let i = 0; i < EclpAccumList.length; i++) {
    const MansionNodeDif_Eclp = (EclpAccumList[i] - Node1EclpDeg + Sidereal) % Sidereal; // 每宿距交
    WhiteAccumList[i] = EclpAccumList[i] + eclp2WhiteDif(Node1EclpGong, MansionNodeDif_Eclp, Name);
  }
  const adj = WhiteAccumList[0] - Sidereal;
  for (let i = 0; i < WhiteAccumList.length; i++) {
    WhiteAccumList[i] = (WhiteAccumList[i] - adj + Sidereal) % Sidereal;
  }
  WhiteAccumList[28] = Sidereal;
  const Node1WhiteMansionDeg = Node1EclpMansionDeg + eclp2WhiteDif(Node1EclpGong, Node1EclpMansionDeg, Name); // 正交九道宿度
  const Node1WhiteDeg = mansion2Deg(
    Node1MansionName + Node1WhiteMansionDeg,
    WhiteAccumList,
  );
  const NewmNode1_EclpDif = (NewmEclpGong - Node1EclpGong + Sidereal) % Sidereal
  const NewmNode1_WhiteDif = NewmNode1_EclpDif + eclp2WhiteDif(Node1EclpGong, NewmNode1_EclpDif, Name)
  const NewmWhiteDeg = Node1WhiteDeg + NewmNode1_WhiteDif
  return { WhiteAccumList, NewmWhiteDeg };
}

export const MoonLatTable = (NodeAccum, Name) => {
  const { Type, Node, MoonLatAccumList } = Para[Name];
  const { MoonLatDifList } = Para[Name];
  /// 預處理陰陽曆////////
  let Portion = 10;
  if (Type <= 4) Portion = 12;
  else if (Name === 'Dayan') Portion = 120;
  else if (Name === 'Wuji') Portion = 50 / 3; // 五紀正元找不到比例，瞎填
  else if (Name === 'Tsrengyuan') Portion = 219 / 4;
  const NodeAccumHalf = NodeAccum % (Node / 2);
  const NodeAccumHalfInt = Math.trunc(NodeAccumHalf);
  const Yinyang = NodeAccum > Node / 2 ? 1 : -1;
  let Lat = 0;
  if (Type < 6) {
    Lat = Yinyang * (MoonLatAccumList[NodeAccumHalfInt] + ((NodeAccumHalf - NodeAccumHalfInt) * MoonLatDifList[NodeAccumHalfInt]) / Portion);
  } else if (Type === 6 || ['Wuji', 'Tsrengyuan'].includes(Name)) {
    // 二次
    let Initial = [
      MoonLatAccumList[NodeAccumHalfInt],
      MoonLatAccumList[NodeAccumHalfInt + 1],
      MoonLatAccumList[NodeAccumHalfInt + 2],
    ];
    let n = 1 + NodeAccumHalf - NodeAccumHalfInt;
    if (NodeAccumHalf >= 12) {
      Initial = [
        MoonLatAccumList[NodeAccumHalfInt - 2],
        MoonLatAccumList[NodeAccumHalfInt - 1],
        MoonLatAccumList[NodeAccumHalfInt],
      ];
      n = 3 + NodeAccumHalf - NodeAccumHalfInt;
    }
    Lat = (Yinyang * Interpolate1(n, Initial)) / Portion;
  } else if (Name === 'Dayan') {
    // 大衍的入交度數另有算式，我直接用月平行速來算 // 三次差：前半段 Δ = 171,-24,-8 後半段 Δ = -75,-40,8// 曲安京《曆法》頁251
    const MoonAvgVd = AutoMoonAvgV(Name);
    const LonRaw = NodeAccumHalf * MoonAvgVd;
    const NodeCycle = nodeQuar(Name) * 4;
    const l = 15; // NodeCycle / 24 // 一象限15度
    const Lon = (LonRaw * 360) / NodeCycle;
    const k = Math.trunc(Lon / l); // 本爻
    const Frac = Lon - k * l;
    // const D1 = MoonLatDifList[k + 1] - MoonLatDifList[k] // 前差
    // const D2 = MoonLatDifList[k + 2] - MoonLatDifList[k + 1] // 後差
    // const Dif1 = D2 - D1 // 中差
    let End = (3 * MoonLatDifList[k] + MoonLatDifList[k + 2]) / (4 * l); // 本爻末率、後爻初率
    let Start = (3 * MoonLatDifList[k - 1] + MoonLatDifList[k + 1]) / (4 * l); // 本爻初率
    if (!Start) {
      // 其四象初爻無初率，上爻無末率，皆倍本爻加減率，十五而一。所得，各以初、末率減之，皆互得其率
      // 但問題是，即便如此，上爻依然不行，因為沒有MoonLatDifList[11 + 1]，我暫且只好補一個上去
      Start = (MoonLatDifList[k] * 2) / l - End;
    } else if (!End) {
      End = (MoonLatDifList[k] * 2) / l - Start;
    }
    const D = (Lon < 90 ? -1 : 1) * Math.abs((End - Start) / l); // 度差
    const G1 = Start + D / 2; // 定初率。「以加減初率（少象減之，老象加之）」
    const Gn = G1 + (Frac - 1) * D; // 「以度差累加減之（少象以差減，老象以差加）」
    const G = ((G1 + Gn) * Frac) / 2;
    Lat = (Yinyang * (MoonLatAccumList[k] + G)) / Portion;
  }
  const Lat1 = 91.31 - Lat;
  return { Lat, Lat1 };
};
// 大衍：《中國古代曆法》頁530
// console.log(MoonLatTable(10, 'Dayan'))

export const MoonLatFormula = (NodeAccum, Name, AnomaAccum, Sd) => {
  // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》；《數》頁410
  const { Node } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  let MoonAvgVd = AutoMoonAvgV(Name); // 大衍：15*NodeAccum，0,1,...11 。其他都是13
  if (Name === 'Qintian') MoonAvgVd = 1;
  const NodeHalf = NodeQuar * 2;
  const NodeOcta = NodeQuar / 2;
  const Lon = NodeAccum * MoonAvgVd;
  const LonHalf = Lon % NodeHalf;
  const LonHalfRev = NodeQuar - Math.abs(LonHalf - NodeQuar);
  let Lat = 0;
  // 崇玄「以四百一乘朔望加時入交常日⋯⋯得定朔望入交定積度分」，也就是說應該不用加入NodeAccumCorr
  // 崇玄崇天是反減半交，觀天紀元是反減交中度。但經過試驗，全部都是反減交中度
  if (Name === 'Chongxuan') {
    const f1 = ((NodeHalf - LonHalfRev) * LonHalfRev) / (10000 / 7.3);
    const f2 = ((NodeQuar - LonHalfRev) * LonHalfRev) / 5600;
    const f3 = (NodeQuar - LonHalfRev) ** 2 / 11500;
    if (LonHalfRev < 30) Lat = f1 - f2;
    else Lat = f1 - f3;
  } else if (Name === 'Qintian') {
    NodeAccum += AutoTcorr(AnomaAccum, Sd, Name, NodeAccum).NodeAccumCorrA; // 欽天用入交定日
    const NodeAccumHalf = NodeAccum % NodeHalf;
    Lat = ((Node / 2 - NodeAccumHalf) * NodeAccumHalf) / (556 / 72);
  } else if (Name === 'Chongtian') {
    const f1 = ((1010 - 5 * LonHalfRev) * LonHalfRev) / 8400;
    const f2 = ((NodeOcta - LonHalfRev) * LonHalfRev) / 4000; // 這兩個是一樣的
    const f3 = ((NodeQuar - LonHalfRev) * (LonHalfRev - NodeQuar / 2)) / 4000;
    if (LonHalfRev < NodeOcta) Lat = f1 - f2;
    else Lat = f1 + f3;
  } else if (Name === 'Guantian') {
    const f1 = ((NodeHalf - LonHalfRev) * LonHalfRev) / 1380;
    const f2 = LonHalfRev / 500;
    const f3 = (LonHalfRev - NodeQuar) / 500;
    if (LonHalfRev < NodeOcta) Lat = f1 - f2;
    else Lat = f1 + f3;
  } else if (Name === 'Jiyuan') {
    const tmp = LonHalfRev - ((NodeQuar - LonHalfRev) * LonHalfRev) / 500;
    Lat = ((NodeHalf - tmp) * tmp) / 1375;
  }
  if (Lon < NodeHalf) Lat = -Lat; // 調用需要注意：此處統一先陽曆後陰曆
  const Lat1 = 91.311 - Lat;
  return { Lat, Lat1 };
};
// console.log(MoonLatFormula(15, 'Jiyuan'))

/**
 * 曲安京《授時曆的白赤道座標變換法》、《數理天文學》5.5、《中國古代曆法》頁127
 * 授時放棄了九道術的黃白轉換，改從白赤轉換入手。
 * @param {*} Node1EclpGong 黃白交點距冬至黃道度數
 * @param {*} NewmEclpGong 定朔距冬至黃道度數。如果是定朔，就是太陽距冬至實行度，因為定朔日月同度
 * @param {*} Y 年份
 * @param {*} isNewm 是否是朔，如果是就算白道宿鈐
 * @returns
 */
const moonLonLatShoushi = (Node1EclpGong, NewmEclpGong, Y, isNewm) => {
  const Sidereal = 365.2575
  const Solar = 365.2425;
  const Solar50 = Solar / 2;
  const Solar25 = Solar / 4;
  const Solar75 = Solar * 0.75;
  const SolarSext = 60.875; // Solar / 6 周天六之一是天球半徑
  const SolarOcta = Solar / 8;
  const Sobliq = 23.9; // 黃赤大距
  const k = 14.66; // 正交極數：二至白赤正交與黃白正交的距離WhEq_WhEc_DifMax。推導見p368
  /// 白赤交點距二分度數
  const Node1EclpHalf = Node1EclpGong % Solar50;
  const Node1EclpHalfRev = Node1EclpHalf < Solar25 ? Node1EclpHalf : Solar50 - Node1EclpHalf; // 求正交在二至後初末限：置冬至距正交積度及分，在半歲周已下，為冬至後；已上，去之，爲夏至後。其二至後，在象限已下，爲初限，已上，減去半歲周，爲末限
  const sign1 = Node1EclpHalf < Solar25 ? -1 : 1; // 初限減，末限加
  const sign2 = Node1EclpGong < Solar50 ? 1 : -1; // 月離黃道正交在冬至後宿度爲減（夏至到冬至-），夏至後宿度爲加（冬至到夏至+）
  const d = (Node1EclpHalfRev * k) / Solar25; // 定差EH
  const WhEqLon1 = k - d; // 距差BH：白赤交點赤經。實際上分成二分，只不過使用上沒什麼區別
  const WhEqGong = sign1 * WhEqLon1 + (Node1EclpGong < Solar50 ? Solar25 : Solar75); // 白赤交點距冬至赤道度
  const WhEqObliqMax = Sobliq + (sign2 * d * 25) / 61; // 赤白大距「赤道正交後半交白道出入赤道內外度」. k*25/61=6
  // const Theta1 = WhEqObliqMax / SolarSext; // 定差，在黃赤道率表中有用。注意，有兩個「定差」
  let EquaLat = 0
  /// ///// 月赤緯
  const MoonWhEqLon = (NewmEclpGong - WhEqGong + Solar) % Solar; // 每日月離赤道交後HM. 這種情況，左手右手不影響
  const MoonWhEqLonHalf = MoonWhEqLon % Solar50;
  const HM = MoonWhEqLonHalf < Solar25 ? MoonWhEqLonHalf : Solar50 - MoonWhEqLonHalf; // 每日月離赤道交後初末限
  const MK = Solar25 - HM; // 白道積
  const UK = RoundL2H(MK); // 矢「每日積差」
  EquaLat = (WhEqObliqMax * (SolarSext - UK)) / SolarSext; // 與《數理》p383核驗無誤
  /// 白赤差
  const WhiteAccumList = [];
  let NewmWhiteDeg = 0
  if (isNewm) {
    const { EquaAccumList, SolsEquaDeg } = solsMansion('Shoushi', Y);
    const sign3 = WhEqGong < Solar50 ? 1 : -1; // 交在冬至後名減，夏至後名加——暫定用左手法則
    const equa2WhiteDif = X => {
      const XHalf = X % Solar50;
      const XQuar = X % Solar25;
      const XQuarRev = XQuar < SolarOcta
        ? XQuar
        : Solar25 - XQuar; // 大統「月道與赤道正交後積度 并入初末限」赤道二十八宿到白赤交點半交的距離，半「氣象限（Solar25）」以內
      const Dingxian = 98 + (sign3 * 24 * d) / k; // 定限度
      const sign4 = XHalf < Solar25 ? -1 : 1; // 正交中交後為加，半交後為減——這裏暫定用左手法則
      return sign4 * Math.abs((Dingxian - XQuarRev) * XQuarRev) / 1000;
    }
    const WhEq_EquaDeg = SolsEquaDeg + WhEqGong;
    for (let i = 0; i < EquaAccumList.length; i++) {
      const Mans_WhEq_Dif = (EquaAccumList[i] - WhEq_EquaDeg + Sidereal) % Sidereal; // 「正交後積度」
      WhiteAccumList[i] = Mans_WhEq_Dif + equa2WhiteDif(Mans_WhEq_Dif);
    }
    const adj = WhiteAccumList[0] - Sidereal;
    for (let i = 0; i < WhiteAccumList.length; i++) {
      WhiteAccumList[i] = (WhiteAccumList[i] - adj + Sidereal) % Sidereal;
    }
    WhiteAccumList[28] = Sidereal;
    const NewmEquaGong = Hushigeyuan(NewmEclpGong).Eclp2Equa
    const Newm_WhEq_EquaDif = (NewmEquaGong - WhEqGong + Sidereal) % Sidereal
    const Newm_WhEq_WhiteDif = Newm_WhEq_EquaDif + equa2WhiteDif(Newm_WhEq_EquaDif)
    const { Name: WhEq_MansName, MansDeg: WhEq_EquaMansDeg } = deg2Mansion(WhEq_EquaDeg, EquaAccumList) // 白赤正交宿度
    const WhEq_WhiteMansDeg = WhEq_EquaMansDeg + equa2WhiteDif(WhEq_EquaMansDeg)
    const WhEq_WhiteDeg = mansion2Deg(WhEq_MansName + WhEq_WhiteMansDeg, WhiteAccumList) // 正交宿度赤轉白，授時曆沒有，我覺得按道理應該有
    NewmWhiteDeg = WhEq_WhiteDeg + Newm_WhEq_WhiteDif // 定朔白道宿積度
  }
  return { WhiteAccumList, NewmWhiteDeg, EquaLat };
};
// console.log(moonLonLatShoushi(45.65625 + 91.3125, 70, 1280));

/**
 * * 《數理》p349 中国古代的历法家认为，以黄白道交点，半交点为节点，将周天划分为四个象限，节点处的黄白道差为0，并且在每个象限内的黄白道差星镜面对称。我们可以根据公式(5-15)判断，这个认识是不对的，仅仅这一点，就决定了九道术自身不可弥补的缺陷。
 * 1、根據平交入朔（月亮平行至升交點的時間）、經朔入轉求平交入轉，2、求月亮改正，得月亮運動到升交點的時刻，3、根據平交入朔得到升交點黃經，即正交加時月離黃道宿度
 * @param {*} NodeAccum 此時入交
 * @param {*} Sd 此時距冬至日數
 * @param {*} NewmEclpGong 合朔距冬至實行度
 * @param {*} Name
 * @param {*} Y 年份
 * @param {*} isNewm 是合朔的話計算白道宿鈐
 * @returns
 */
export const moonLonLat = (
  NodeAccum,
  Sd,
  NewmEclpGong,
  Name,
  Y,
  isNewm,
) => {
  let { Type, Solar, SolarRaw, Sidereal, Node } = Para[Name];
  Solar = Solar || SolarRaw;
  Sidereal = Sidereal || Solar;
  NewmEclpGong = NewmEclpGong || Sd + AutoDifAccum(0, Sd, Name).SunDifAccum
  const MoonAvgVd = AutoMoonAvgV(Name);
  const T_Node1Dif_Avg = Node - NodeAccum; // 朔後平交日分：朔之後的正交
  const S_Node1Dif = T_Node1Dif_Avg * MoonAvgVd;
  // const NodeAnomaAccum = (AnomaAccum + T_Node1Dif_Avg) % Anoma // 某後平交入轉=某後平交（=交終-某入交）+某入轉
  // const T_Node1Dif = T_Node1Dif_Avg + AutoTcorr(NodeAnomaAccum, 0, Name).MoonTcorr // （朔後）正交日分。授時：遲加疾減之——方向和定朔改正一樣（盈遲爲加，縮疾爲減）。紀元：與定朔日辰相距，即所在月日——加上改正之後就能直接與定朔相比較
  const Node1EclpGong = (Sd + S_Node1Dif) % Sidereal; // 授時：正交距冬至定積度
  let WhiteAccumList = [];
  let EclpLat = 0, EquaLat = 0, NewmWhiteDeg = 0
  if (Type === 11) {
    const Func = moonLonLatShoushi(Node1EclpGong, NewmEclpGong, Y, isNewm);
    WhiteAccumList = Func.WhiteAccumList
    NewmWhiteDeg = Func.NewmWhiteDeg
    EquaLat = Func.EquaLat
  } else {
    if (isNewm === true && Type >= 6) {
      const Func = moonLonJiudao(Node1EclpGong, NewmEclpGong, Name, Y)
      WhiteAccumList = Func.WhiteAccumList
      NewmWhiteDeg = Func.NewmWhiteDeg
    }
    if (Type <= 3) {
      EclpLat = MoonLatTable(NodeAccum, 'Qianxiang').Lat;
    } else if (Name === 'Yuanjia') {
      EclpLat = MoonLatTable(NodeAccum, Name).Lat;
    } else if (Type === 4) {
      EclpLat = MoonLatTable(NodeAccum, 'Daming').Lat;
    } else if (Type === 6) {
      EclpLat = MoonLatTable(NodeAccum, 'Huangji').Lat;
    } else if (['Qintian', 'Xuanming', 'Zhide', 'Dayan'].includes(Name)) {
      EclpLat = MoonLatTable(NodeAccum, 'Dayan').Lat;
    } else if (Type === 7) {
      EclpLat = MoonLatTable(NodeAccum, Name).Lat;
    } else if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
      EclpLat = MoonLatFormula(NodeAccum, 'Chongxuan').Lat;
    } else if (['Chongtian'].includes(Name)) {
      EclpLat = MoonLatFormula(NodeAccum, Name).Lat;
    } else if (
      ['Guantian', 'Mingtian', 'Fengyuan', 'Zhantian'].includes(Name)
    ) {
      EclpLat = MoonLatFormula(NodeAccum, 'Guantian').Lat;
    } else if (Type === 9 || Type === 10) {
      EclpLat = MoonLatFormula(NodeAccum, 'Jiyuan').Lat;
    }
  }
  return { WhiteAccumList, NewmWhiteDeg, EclpLat, EquaLat };
};
// console.log(moonLonLat(8, 13, 156, 40, 'Wuji', 1200, true))
// console.log(moonLonLat(7, 13, 156, 40, 'Chongtian', 1200))
// console.log(moonLonLat(7, 13, 156, 40, 'Dayan', 1200))
// console.log(moonLonLat(7, 13, 156, 40, 'Qintian', 1200))
