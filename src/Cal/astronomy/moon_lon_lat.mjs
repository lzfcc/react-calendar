import { Hushigeyuan, RoundL2H } from '../equation/geometry.mjs';
import { Interpolate1 } from '../equation/sn.mjs';
import { AutoMoonAvgV, nodeQuar } from '../parameter/auto_consts.mjs';
import Para from '../parameter/calendars.mjs';
import { AutoDifAccum, anojour, AutoTcorr } from './acrv.mjs';
import { equa2EclpPoly } from './equa_eclp.mjs';
import { deg2Mans, mans2Deg, solsMans } from './mans.mjs';

/**
 * 黃白差、赤白差。大衍欽天應天的黃赤差極大值是黃白差的兩倍。大衍Max黃白差=1.5。
 * @param {*} NodeEclpGong
 * @param {*} NewmNodeDif
 * @param {*} Name
 * @returns
 */
const MoonLonTable = (NodeEclpGong, NewmNodeDif, Name) => {
  const { Solar, Type, Sidereal } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  const Xian = Name === 'Qintian' ? Sidereal / 72 : 5; // 欽天黃道8節72限。是交點週期還是黃道周長？
  const NodeOcta = nodeQuar / 2;
  const NodeQuar3 = 3 * NodeQuar;
  const NodeHalf = NodeQuar * 2;
  const SolarQuar = Solar / 4;
  const SolarHalf = Solar / 2;
  const SolarQuar3 = Solar * 0.75;
  const NodeDifHalf = NewmNodeDif % NodeHalf;
  const NodeDifQuar = NewmNodeDif % NodeQuar;
  const NodeEclpGongHalf = NodeEclpGong % SolarHalf; // 計去冬夏至以來度數
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
  // const EclpWhiteDifRaw = equa2EclpPoly(NodeDifQuarRev,Name, true).Equa2EclpDif / 2;
  // 赤白差
  return 0 // sign1 * EclpWhiteDif + sign2 * EquaWhiteDif;
};

/**
 * 《數》頁361 白道度是以黃道度、正交黃經爲自變量的二元函數
 * @param {*} NodeEclpGong 正交距冬至定積度
 * @param {*} NewmNodeDif 距正交黃道度數
 * @param {*} Name
 * @returns
 */
const eclp2WhiteDif = (NodeEclpGong, NewmNodeDif, Name) => {
  const { Solar, Type } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  const NodeHalf = NodeQuar * 2;
  const NodeOcta = NodeQuar / 2;
  const NodeOcta3 = NodeOcta * 3;
  const SolarQuar = Solar / 4;
  const SolarHalf = Solar / 2;
  const SolarQuar3 = Solar * 0.75;
  const Xian = Name === 'Qintian' ? Solar / 72 : 5; // 欽天黃道8節72限
  const NodeDifQuar = NewmNodeDif % NodeQuar;
  const NodeDifHalf = NewmNodeDif % NodeHalf;
  const NodeDifRev = NodeDifQuar < NodeOcta ? NodeDifQuar : NodeQuar - NodeDifQuar; // 到正半交的前後距離。紀元：置黃道宿積度，滿交象度去之，在半交象已下爲初限；已上者，以減交象度，餘爲入末限。
  // 判斷在正交前後還是半交前後
  let OfBoundary = 1 // 交點前後1，半交前後-1
  if (NodeDifHalf >= NodeOcta && NodeOcta < NodeOcta * 3) {
    OfBoundary = -1
  }
  // 往前到交點或半交是1，往後是-1（右手）
  let ToBoundary = -1
  if (NodeDifQuar < NodeOcta) {
    ToBoundary = 1
  }
  const NodeEclpGongHalf = NodeEclpGong % SolarHalf; // 崇天：計去冬夏至以來度數
  let EquaWhiteDif = 0; // 月行與赤道差數
  let sign1 = 1; // 黃白差符號
  let sign2 = 1; // 赤白差符號
  const NodeEquiDif = Math.abs(SolarQuar - NodeEclpGongHalf) // 距二分度數
  const NodeSolsDif = SolarQuar - NodeEquiDif // 距二至度數
  const EclpWhiteDifRaw = equa2EclpPoly(NodeDifRev, Name).Equa2EclpDif / 2; // 月行與黃道差數（汎差）
  const isYinSun = NodeEclpGong > SolarQuar && NodeEclpGong < SolarQuar3 ? 1 : -1; // 日行陰陽
  const isYinMoon = NewmNodeDif < NodeHalf ? 1 : -1; // 月行陰陽
  let EclpWhiteDif = EclpWhiteDifRaw
  let Dif1 = 0, Dif2 = 0
  if (['Qintian', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
    // sign1我重新整理了一遍思路
    if (NewmNodeDif < NodeOcta || NewmNodeDif >= NodeOcta * 7) { // 在正交前後各九限
      if (NodeEclpGong < SolarHalf) {
        sign1 = -1
      }
    } else if (NewmNodeDif >= NodeOcta && NewmNodeDif < NodeOcta3) { // 在陽半交
      if (NodeEclpGong < SolarQuar || NodeEclpGong >= SolarQuar3) { // 秋分之宿後出黃道外
        sign1 = -1
      }
    } else if (NewmNodeDif >= NodeOcta3 || NewmNodeDif < NodeOcta * 5) { // 在中交
      if (NodeEclpGong >= SolarHalf) {
        sign1 = -1
      }
    } else { // 在陰半交
      if (NodeEclpGong >= SolarQuar && NodeEclpGong < SolarQuar3) { // 春分之宿後入黃道內
        sign1 = -1
      }
    }
    sign2 = OfBoundary // 和大衍的sign1一樣
    if (NodeDifHalf >= NodeOcta && NodeDifHalf < NodeOcta * 3) { // 半交前後，距二分之宿限數
      EclpWhiteDif = EclpWhiteDifRaw * NodeEquiDif / Xian / 18
    } else { // 正交中交前後，距二至之宿限數
      EclpWhiteDif = EclpWhiteDifRaw * NodeSolsDif / Xian / 18
    }
    if (Name === 'Qintian') {
      EquaWhiteDif = EclpWhiteDifRaw / 4 - EclpWhiteDif;
    } else if (Name === 'Yingtian') {
      const a = sign1 === 1 ? 0.9 : 0.7;
      EquaWhiteDif = EclpWhiteDifRaw * 2 / 10 * a - EclpWhiteDif; // 「遇減，身外除三；遇加，身外除一。」什麼意思啊？？這個是我猜的
    } else if (['Qianyuan', 'Yitian'].includes(Name)) {
      EquaWhiteDif = EclpWhiteDifRaw * 2 / 10 - EclpWhiteDif; // 「二曆皆不身外爲法」
    }
    Dif1 = ToBoundary * sign1 * EclpWhiteDif;
    Dif2 = ToBoundary * sign2 * EquaWhiteDif;
  } else if (Type >= 6 & Type <= 8) { // 大衍、崇玄曆按大衍，崇天明天觀天    
    EquaWhiteDif = NodeSolsDif * EclpWhiteDif / Xian / 18; // 距二至之宿限數. 大衍：「計去冬至夏至以來候數，乘黃道所差，十八而一」按照欽天，其實應該是距離二至的距離。大衍曆用候數，所以常數是18，宋曆改用度數，所以是90=Xian*18。崇天：計去冬夏至以來度數，乘黃道所差，九十而一——和大衍一樣
    // sign1 = NodeDifHalf < NodeQuar ? 1 : -1; // 此處為公式法的思路，至後減分後加。最後也是只乘sign1，不乘ToBoundary
    sign1 = OfBoundary // 大衍：距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加    
    sign2 = sign1 * isYinSun * isYinMoon; // 赤白差符號。其在同名，以差數爲加者加之，減者減之；若在異名，以差數爲加者減之，減者加之
    Dif1 = ToBoundary * sign1 * EclpWhiteDif;
    Dif2 = ToBoundary * sign2 * EquaWhiteDif;
  } else if (Type === 9 || Type === 10) { // 紀元
    if (NodeEclpGong > SolarHalf) { // 夏至後同名黃白差較大
      EclpWhiteDif = EclpWhiteDifRaw * 1.125; // 月行與黃道定差      
      sign1 = NodeDifHalf < NodeQuar ? 1 : -1;
    } else {
      EclpWhiteDif = EclpWhiteDifRaw * 0.875; // 月行與黃道定差
      sign1 = NodeDifHalf > NodeQuar ? 1 : -1;
    }
    EquaWhiteDif = (NodeEquiDif * EclpWhiteDif) / SolarQuar; // 夏至後距秋分度數
    sign2 = -sign1;
    Dif1 = sign1 * EclpWhiteDif;
    Dif2 = sign2 * EquaWhiteDif;
  }
  return Dif1 + Dif2
};
// console.log(eclp2WhiteDif(55, 92, 'Dayan'))
// console.log(eclp2WhiteDif(55, 92, 'Qintian'))
// console.log(eclp2WhiteDif(55, 92, 'Jiyuan'))

const moonJiudaoFormula = (NodeEclpGong, NewmEclpGong, Name, Y) => {
  let { Solar, SolarRaw, Sidereal } = Para[Name];
  Solar = Solar || SolarRaw;
  Sidereal = Sidereal || Solar;
  const WhiteAccumList = [];
  const { EclpAccumList, SolsEclpDeg } = solsMans(Name, Y);
  const NodeEclpDeg = (NodeEclpGong + SolsEclpDeg) % Sidereal; // 正交加時黃道宿積度
  const { Name: NodeMansName, MansDeg: NodeEclpMansDeg } = deg2Mans(NodeEclpDeg, EclpAccumList);
  for (let i = 0; i < EclpAccumList.length; i++) {
    const MansNodeDif_Eclp = (EclpAccumList[i] - NodeEclpDeg + Sidereal) % Sidereal; // 每宿距交
    WhiteAccumList[i] = EclpAccumList[i] + eclp2WhiteDif(NodeEclpGong, MansNodeDif_Eclp, Name);
  }
  const adj = WhiteAccumList[0] - Sidereal;
  for (let i = 0; i < WhiteAccumList.length; i++) {
    WhiteAccumList[i] = (WhiteAccumList[i] - adj + Sidereal) % Sidereal;
  }
  WhiteAccumList[28] = Sidereal;
  const NodeWhiteMansDeg = NodeEclpMansDeg + eclp2WhiteDif(NodeEclpGong, NodeEclpMansDeg, Name); // 正交九道宿度
  const NodeWhiteDeg = mans2Deg(
    NodeMansName + NodeWhiteMansDeg,
    WhiteAccumList,
  );
  const NewmNode_EclpDif = (NewmEclpGong - NodeEclpGong + Sidereal) % Sidereal
  const NewmNode_WhiteDif = NewmNode_EclpDif + eclp2WhiteDif(NodeEclpGong, NewmNode_EclpDif, Name)
  const NewmWhiteDeg = (NodeWhiteDeg + NewmNode_WhiteDif) % Sidereal
  return { WhiteAccumList, NewmWhiteDeg };
}

/**
 * * 《數理》p349 中国古代的历法家认为，以黄白道交点，半交点为节点，将周天划分为四个象限，节点处的黄白道差为0，并且在每个象限内的黄白道差星镜面对称。我们可以根据公式(5-15)判断，这个认识是不对的，仅仅这一点，就决定了九道术自身不可弥补的缺陷。
 * @param {*} AvgNewmNodeAccum 經朔入交
 * @param {*} AvgNewmAnoAccum 經朔入轉
 * @param {*} AvgNewmSd 經朔距冬至日數
 * @param {*} NewmEclpGong 定朔距冬至實行度
 * @param {*} Name
 * @param {*} Y 年份
 * @returns
 */
export const moonJiudao = (
  AvgNewmNodeAccum,
  AvgNewmAnoAccum,
  AvgNewmSd,
  NewmEclpGong,
  Name,
  Y,
) => {
  let { Type, Solar, SolarRaw, Sidereal, Node } = Para[Name];
  Solar = Solar || SolarRaw;
  Sidereal = Sidereal || Solar;
  if (Type <= 5) {
    return
  }
  const MoonAvgVd = AutoMoonAvgV(Name);
  const T_NewmNodeDif_Avg = Node - AvgNewmNodeAccum; // 朔後平交日分：朔之後的正交
  const S_NewmNodeDif = T_NewmNodeDif_Avg * MoonAvgVd;
  const S_NodeDif = AvgNewmNodeAccum * MoonAvgVd; // 朔前正交
  // const NodeAnoAccum = (AvgNewmAnoAccum + T_NewmNodeDif_Avg) % Anoma // 某後平交入轉=某後平交（=交終-某入交）+某入轉
  // const T_NewmNodeDif = T_NewmNodeDif_Avg + AutoTcorr(NodeAnoAccum, 0, Name).MoonTcorr // （朔後）正交日分。授時：遲加疾減之——方向和定朔改正一樣（盈遲爲加，縮疾爲減）。紀元：與定朔日辰相距，即所在月日——加上改正之後就能直接與定朔相比較
  const Node1EclpGong = (AvgNewmSd + S_NewmNodeDif) % Sidereal;
  let NodeEclp = Node1EclpGong // 崇天以後的
  if (Name === "Qintian") { // 欽天都要先加一個日躔改正
    const AcrNewmNodeAccum = AvgNewmNodeAccum + AutoTcorr(AvgNewmAnoAccum, AvgNewmSd, Name).Tcorr
    NodeEclp = (NewmEclpGong - MoonAvgVd * AcrNewmNodeAccum + Solar) % Solar
  } else if (Type === 6 || Type === 7) { // 大衍
    const AvgNodeEclpGong = AvgNewmSd - S_NodeDif; // 朔前平交
    NodeEclp = (AvgNodeEclpGong + AutoDifAccum(undefined, AvgNodeEclpGong, Name).SunDifAccum + Solar) % Solar
  } else if (Name === "Yingtian" || Name === "Qianyuan") {
    const AcrNewmNodeAccum = AvgNewmNodeAccum + AutoTcorr(AvgNewmAnoAccum, undefined, Name).MoonTcorr
    NodeEclp = (NewmEclpGong - MoonAvgVd * AcrNewmNodeAccum + Solar) % Solar
  } else if (Name === "Yitian") {
    const AcrNewmAnoAccum = AvgNewmAnoAccum + AutoTcorr(AvgNewmAnoAccum, undefined, Name).MoonTcorr
    const AcrNewmAnojour = anojour(AcrNewmAnoAccum, Name).Anojour
    if (AvgNewmNodeAccum < Node / 2) { // 儀天用距離最近的正交
      const NodeAnojour = anojour(AvgNewmAnoAccum - AvgNewmNodeAccum, Name).Anojour // 「正交曆積度」。但是儀天沒有說怎麼求，按道理應該是這樣
      NodeEclp = (NewmEclpGong - (AcrNewmAnojour - NodeAnojour) + Solar) % Solar
    } else {
      const Node1Anojour = anojour(AvgNewmAnoAccum + Node - AvgNewmNodeAccum, Name).Anojour
      NodeEclp = (NewmEclpGong + (Node1Anojour - AcrNewmAnojour)) % Solar
    }
  }
  const { WhiteAccumList, NewmWhiteDeg } = moonJiudaoFormula(NodeEclp, NewmEclpGong, Name, Y)
  return { WhiteAccumList, NewmWhiteDeg };
};

export const MoonLatTable = (NodeAccum, Name) => {
  const { Type, Node, MoonLatAccumList } = Para[Name];
  const { MoonLatDifList } = Para[Name];
  /// 預處理陰陽曆////////
  let Portion = 10;
  if (Type <= 4) Portion = 12;
  else if (Name === 'Dayan') Portion = 120;
  else if (Name === 'Wuji') Portion = 50 / 3; // 交率交數61、777，去交度乘數十一，除數千一百六十五
  else if (Name === 'Tsrengyuan') Portion = 219 / 4; // 交率交數61、777，去交度乘數十一，除數九百四十五
  const NodeAccumHalf = NodeAccum % (Node / 2);
  const NodeAccumHalfInt = Math.trunc(NodeAccumHalf);
  let Lat = 0;
  if (Type <= 4) {
    Lat = MoonLatAccumList[NodeAccumHalfInt] + ((NodeAccumHalf - NodeAccumHalfInt) * MoonLatDifList[NodeAccumHalfInt]) / Portion;
  } else if (Type === 6 || ['Wuji', 'Tsrengyuan'].includes(Name)) { // 二次
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
    Lat =  Interpolate1(n, Initial) / Portion;
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
    Lat =  (MoonLatAccumList[k] + G) / Portion;
  }
  if (Lon < NodeHalf) Lat = -Lat;
  return Lat;
};
// 大衍：《中國古代曆法》頁530
// console.log(MoonLatTable(10, 'Dayan'))

/**
 *  《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》；《數》頁410
 * @param {*} NodeAccum 紀元：以經朔入交汎日加減日月時間改正，得定朔入交汎日。乘月平行速，得入交積度。加減定朔月亮遲疾，得入交定積度。
 * @param {*} Name 
 * @param {*} AnoAccum 
 * @param {*} Sd 
 * @returns 
 */
const MoonLatFormula = (NodeAccum, Name) => {
  const { Node } = Para[Name];
  const NodeQuar = nodeQuar(Name);
  let MoonAvgVd = AutoMoonAvgV(Name); // 大衍：15*NodeAccum，0,1,...11 。其他都是13
  if (Name === 'Qintian') MoonAvgVd = 1;
  const NodeHalf = NodeQuar * 2;
  const NodeOcta = NodeQuar / 2;
  const Lon = NodeAccum * MoonAvgVd
  const LonHalf = Lon % NodeHalf;
  const LonHalfRev = NodeQuar - Math.abs(LonHalf - NodeQuar);
  let Lat = 0;
  // 崇玄崇天是反減半交，觀天紀元是反減交中度。但經過試驗，全部都是反減交中度
  if (Name === 'Chongxuan') {
    const f1 = ((NodeHalf - LonHalfRev) * LonHalfRev) / (10000 / 7.3);
    const f2 = ((NodeQuar - LonHalfRev) * LonHalfRev) / 5600;
    const f3 = (NodeQuar - LonHalfRev) ** 2 / 11500;
    if (LonHalfRev < 30) Lat = f1 - f2;
    else Lat = f1 - f3;
  } else if (Name === 'Qintian') {
    const NodeAccumHalf = NodeAccum % (Node / 2);
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
  if (Lon < NodeHalf) Lat = -Lat;
  return Lat
};
// console.log(MoonLatFormula(15, 'Jiyuan'))

/**
 * 古曆求月亮黃緯
 * @param {*} NodeAccum 此時入交汎日
 * @param {*} AnoAccum 此時入轉
 * @param {*} Sd 此時距冬至時間
 * @param {*} Name 
 * @returns 
 */
export const moonEclpLat = (NodeAccum, AnoAccum, Sd, Name) => {
  const { Type } = Para[Name];
  if (Sd) { // 算定朔望
    NodeAccum += AutoTcorr(AnoAccum, Sd, Name, NodeAccum).NodeAccumCorrA
  } else { // 算其他任意時刻
    NodeAccum += AutoTcorr(AnoAccum, undefined, Name).MoonTcorr // 紀元的算法看起來跟之前不一樣，其實是一樣的
  }
  let EclpLat = 0
  if (Type <= 3) {
    EclpLat = MoonLatTable(NodeAccum, 'Qianxiang');
  } else if (Name === 'Yuanjia') {
    EclpLat = MoonLatTable(NodeAccum, Name);
  } else if (Type === 4) {
    EclpLat = MoonLatTable(NodeAccum, 'Daming');
  } else if (Type === 6) {
    EclpLat = MoonLatTable(NodeAccum, 'Huangji');
  } else if (['Xuanming', 'Zhide'].includes(Name)) {
    EclpLat = MoonLatTable(NodeAccum, 'Dayan');
  } else if (Name === "Qintian") {
    EclpLat = MoonLatFormula(NodeAccum, Name);
  } else if (Type === 7) {
    EclpLat = MoonLatTable(NodeAccum, Name);
  } else if (['Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
    EclpLat = MoonLatFormula(NodeAccum, 'Chongxuan');
  } else if (['Chongtian'].includes(Name)) {
    EclpLat = MoonLatFormula(NodeAccum, Name);
  } else if (
    ['Guantian', 'Mingtian', 'Fengyuan', 'Zhantian'].includes(Name)
  ) {
    EclpLat = MoonLatFormula(NodeAccum, 'Guantian');
  } else if (Type === 9 || Type === 10) {
    EclpLat = MoonLatFormula(NodeAccum, 'Jiyuan');
  }
  return EclpLat
}
// console.log(moonEclpLat(8.3139682, 0.5482519901, 0, "Qianxiang")) // 《古代曆法計算法》p161：206建安十一年八月乙未朔，經朔入陰陽曆8+(2472+410/2209)/7874=8.3139682，月黃緯 5 + (((781 + 12748 / 16129) / 2209 + 3167) / 7874 + 9) / 12=5.78352123陽曆黃道南。// 入交8.280673，去黃道5.7831486。入轉程序沒問題，入交差了0.03日

/**
 * 曲安京《授時曆的白赤道座標變換法》、《數理天文學》5.5、《中國古代曆法》頁127
 * 授時放棄了九道術的黃白轉換，改從白赤轉換入手。
 * @param {*} AvgNewmNodeAccum 經朔入交
 * @param {*} AvgNewmSd 經朔距冬至
 * @param {*} NewmEclpGong 定朔距冬至黃道度數。如果是定朔，就是太陽距冬至實行度，因為定朔日月同度
 * @param {*} Y 年份。有Y才求九道宿鈐
 * @param {*} NowNewm_WhiteDif 此時月亮距離合朔的實行度。有NowNewm_WhiteDif才求月緯
 * @returns
 */
export const moonShoushi = (AvgNewmNodeAccum, AvgNewmSd, NewmEclpGong, Y, NowNewm_WhiteDif) => {
  const Sidereal = 365.2575
  const SiderealHalf = 182.62875
  const SiderealQuar = 91.314375
  const SolarHalf = 182.62125;
  const SolarQuar = 91.310625;
  const SolarOcta = 45.6553125;
  const SiderealSext = 60.875; // 周天六之一是會圓術天球半徑
  const Sobliq = 23.9; // 黃赤大距
  const k = 14.66; // 正交極數：二至白赤正交與黃白正交的距離WhEq_WhEc_DifMax。推導見p368
  const MoonAvgVd = 13.36875
  const Node = 27.212224
  const T_NewmNodeDif_Avg = Node - AvgNewmNodeAccum; // 朔後平交日分：經朔之後的正交
  const S_NewmNodeDif = T_NewmNodeDif_Avg * MoonAvgVd;
  const Node1EclpGong = (AvgNewmSd + S_NewmNodeDif) % Sidereal; // 授時：正交距冬至定積度
  /// 白赤交點距二分度數
  const Node1EclpHalf = Node1EclpGong % SolarHalf;
  const Node1EclpHalfRev = Node1EclpHalf < SolarQuar ? Node1EclpHalf : SolarHalf - Node1EclpHalf; // 求正交在二至後初末限：置冬至距正交積度及分，在半歲周已下，為冬至後；已上，去之，爲夏至後。其二至後，在象限已下，爲初限，已上，減去半歲周，爲末限
  const sign1 = Node1EclpHalf < SolarQuar ? 1 : -1; // 初限加，末限減
  const sign2 = Node1EclpGong < SolarHalf ? -1 : 1; // 月離黃道正交在冬至後宿度爲減，夏至後宿度爲加——右手
  const d = (Node1EclpHalfRev * k) / SolarQuar; // 定差EH
  const WhEqEquinoxDif = k - d; // 距差BH：白赤交點距二分距離
  const WhEqGong = sign1 * -sign2 * WhEqEquinoxDif + SolarQuar; // 白赤交點距冬至赤道度。以距差加減春秋二正赤道宿度，爲月離赤道正交宿度。冬至後，初限加末限減，視春正；夏至後，初限減末限加，視秋正
  const Dingxian = 98 + (sign2 * 24 * d) / k; // 定限度。交在冬至後名減，夏至後名加——右手
  /// 白赤差  
  const equa2WhiteDif = X => {
    const XHalf = X % SolarHalf;
    const XQuar = X % SolarQuar;
    const XQuarRev = XQuar < SolarOcta
      ? XQuar
      : SolarQuar - XQuar; // 大統「月道與赤道正交後積度 并入初末限」赤道二十八宿到白赤交點半交的距離，半「氣象限（Solar25）」以內
    const sign3 = XHalf < SolarQuar ? 1 : -1; // 正交中交後為加，半交後為減
    return sign3 * Math.abs((Dingxian - XQuarRev) * XQuarRev) / 1000;
  }
  const NewmEquaGong = Hushigeyuan(NewmEclpGong).Eclp2Equa
  const Newm_WhEq_EquaDif = (NewmEquaGong - WhEqGong + Sidereal) % Sidereal
  const Newm_WhEq_WhiteDif = Newm_WhEq_EquaDif + equa2WhiteDif(Newm_WhEq_EquaDif)
  /// 九道宿鈐
  const WhiteAccumList = [];
  let NewmWhiteDeg = 0
  if (Y !== undefined) { // 如果有Y就是朔，就要求九道宿鈐
    const { EquaAccumList, SolsEquaDeg } = solsMans('Shoushi', Y);
    const WhEq_EquaDeg = (SolsEquaDeg + WhEqGong) % Sidereal;
    for (let i = 0; i < EquaAccumList.length; i++) {
      const Mans_WhEq_Dif = (EquaAccumList[i] - WhEq_EquaDeg + Sidereal) % Sidereal; // 「正交後積度」
      WhiteAccumList[i] = Mans_WhEq_Dif + equa2WhiteDif(Mans_WhEq_Dif);
    }
    const adj = WhiteAccumList[0] - Sidereal;
    for (let i = 0; i < WhiteAccumList.length; i++) {
      WhiteAccumList[i] = (WhiteAccumList[i] - adj + Sidereal) % Sidereal;
    }
    WhiteAccumList[28] = Sidereal;
    const { Name: WhEq_MansName, MansDeg: WhEq_EquaMansDeg } = deg2Mans(WhEq_EquaDeg, EquaAccumList) // 白赤正交宿度
    const WhEq_WhiteMansDeg = WhEq_EquaMansDeg + equa2WhiteDif(WhEq_EquaMansDeg)
    const WhEq_WhiteDeg = mans2Deg(WhEq_MansName + WhEq_WhiteMansDeg, WhiteAccumList) // 正交宿度赤轉白，授時曆沒有，我覺得按道理應該有
    NewmWhiteDeg = (WhEq_WhiteDeg + Newm_WhEq_WhiteDif) % Sidereal // 定朔白道宿積度
  }
  /// 月赤緯
  let EquaLat = 0
  if (NowNewm_WhiteDif) {
    const WhEqObliqMax = Sobliq + sign2 * d * 25 / 61; // 白赤大距「赤道正交後半交白道出入赤道內外度」. k*25/61=6。視月離黄道正交在冬至後宿度爲減，夏至後宿度爲加
    const NowWhEq_WhiteDif = (Newm_WhEq_WhiteDif + NowNewm_WhiteDif) % Sidereal // 每日月離赤道交後。原文沒有說怎麼求的，我覺得按道理是這樣
    const NowWhEq_WhiteDifHalf = NowWhEq_WhiteDif % SiderealHalf;
    const HM = NowWhEq_WhiteDifHalf < SiderealQuar ? NowWhEq_WhiteDifHalf : SiderealHalf - NowWhEq_WhiteDifHalf; // 每日月離赤道交後初末限
    const MK = SiderealQuar - HM; // 白道積
    const UK = RoundL2H(MK); // 矢「每日積差」
    // const Theta1 = WhEqObliqMax / SiderealSext; // 定差。注意，有兩個「定差」。下一步：「餘以定差乘之」
    EquaLat = (NowWhEq_WhiteDif < SiderealHalf ? 1 : -1) * (WhEqObliqMax * (SiderealSext - UK)) / SiderealSext; // 與《數理》p383核驗無誤。每日月離赤道內外度。內減外加象限，爲每日月離白道去極度
  }
  return { WhiteAccumList, NewmWhiteDeg, EquaLat };
};
// console.log(moonShoushi(45.65625 + 91.3125, 70, 1280, 0));
