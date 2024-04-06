import { HushigeyuanMoon } from "../equation/geometry.mjs";
import { Interpolate1 } from "../equation/sn.mjs";
import { AutoMoonAvgV, AutoNodeCycle, AutoSolar } from "../parameter/auto_consts.mjs";
import Para from "../parameter/calendars.mjs";
import { AutoTcorr } from "./acrv.mjs";
import { autoEquaEclp } from "./equa_eclp.mjs";

const MoonLonTable = (Sd, NodeAccumRaw, Name) => {
  /// ////赤白轉換//////
  const { Solar } = Para[Name];
  let { Sidereal } = Para[Name];
  const Quadrant = AutoNodeCycle(Name) / 4;
  const NodeAccum = NodeAccumRaw; // % (Node / 2)
  // 求交點：1、確定平交入朔、平交入轉，2、根據月亮改正計算月亮運動到升交點的時間，卽正交日辰，3、求正交加時黃道宿度，卽交點黃經
  const LonRaw = AutoMoonAvgV(Name) * NodeAccum; // 以月平行度乘之
  let Lon = LonRaw % Quadrant;
  if ((LonRaw >= Quadrant && LonRaw < Quadrant * 2) || LonRaw >= Quadrant * 3) {
    // (LonRaw >= Quadrant)
    Lon = Quadrant - Lon;
  }
  Sidereal = Sidereal || Solar;
  Sd -= NodeAccum;
  const SdHalf = Sd % (Solar / 2);
  const EclpLon = (Sd + LonRaw) % Sidereal;
  let WhiteLon = 0;
  let Range = [];
  if (Name === "Huangji") {
    // 麟德沒有
    Range = [
      0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2.94, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
    ]; // 《中國古代曆法》頁60
  } else if (["Dayan", "Xuanming", "Qintian", "Yingtian"].includes(Name)) {
    Range = [0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0.94, 5, 5, 5, 5, 5, 5, 5, 5, 5];
  }
  let LonDifDifInitial = 0;
  let LonDifDifChange = 0;
  let EclpWhiteDif = 0;
  const Smallquadrant = 5.07; // Solar / 72// 欽天8節72限
  if (Name === "Huangji") {
    LonDifDifInitial = 11 / 45; // ⋯⋯四度爲限，初十一，每限損一，以終於一
    LonDifDifChange = -1 / 45;
  } else if (["Dayan", "Xuanming"].includes(Name)) {
    LonDifDifInitial = 12 / 24;
    LonDifDifChange = -1 / 24;
  } else if (Name === "Qintian") {
    LonDifDifInitial = 40 / 72;
    LonDifDifChange = -5 / 72;
  } else if (Name === "Yingtian") {
    LonDifDifInitial = 12 / 20.2;
    LonDifDifChange = -1.5 / 20.2;
  }
  const length = Range.length - 2;
  const RangeAccum = Range.slice();
  for (let i = 1; i <= length + 1; i++) {
    RangeAccum[i] += RangeAccum[i - 1];
  }
  const LonDifDif = [];
  LonDifDif[1] = LonDifDifInitial;
  for (let i = 2; i <= length / 2; i++) {
    LonDifDif[i] = LonDifDif[i - 1] + LonDifDifChange;
  }
  LonDifDif[length / 2 + 1] = 0;
  LonDifDif[length / 2 + 2] = LonDifDif[length / 2];
  for (let i = length / 2 + 3; i <= length + 1; i++) {
    LonDifDif[i] = LonDifDif[i - 1] - LonDifDifChange;
  }
  const LonDifAccum = [];
  LonDifAccum[0] = 0;
  for (let i = 1; i <= length / 2 + 1; i++) {
    LonDifAccum[i] = LonDifAccum[i - 1] + LonDifDif[i];
    LonDifAccum[i] = parseFloat(LonDifAccum[i].toPrecision(14));
  }
  for (let i = length / 2 + 2; i <= length + 1; i++) {
    LonDifAccum[i] = LonDifAccum[i - 1] - LonDifDif[i];
    LonDifAccum[i] = parseFloat(LonDifAccum[i].toPrecision(14));
  }
  LonDifAccum[length + 1] = 0;
  let LonOrder = 0;
  for (let j = 1; j <= Range.length - 2; j++) {
    if (RangeAccum[j] <= Lon && Lon < RangeAccum[j + 1]) {
      LonOrder = j;
    }
  }
  EclpWhiteDif =
    LonDifAccum[LonOrder] +
    ((LonDifAccum[LonOrder + 1] - LonDifAccum[LonOrder]) *
      (Lon - RangeAccum[LonOrder])) /
    (RangeAccum[LonOrder + 1] - RangeAccum[LonOrder]); // 一次內插
  if (Name !== "Huangji") EclpWhiteDif /= 2;
  let EquaWhiteDif = 0;
  if (["Dayan", "Xuanming"].includes(Name)) {
    EquaWhiteDif = SdHalf / (Solar / 72) / 18;
  } else if (Name === "Qintian") {
    const OriginXian = Math.abs(SdHalf - Solar / 4) / Smallquadrant; // 限數
    // EclpWhiteDif = (Lon - RangeAccum[LonOrder]) * (Smallquadrant / 2) * OriginXian / 1296 // 這個用公式來算黃白差，沒寫對
    EquaWhiteDif =
      (Lon - RangeAccum[LonOrder]) *
      (Smallquadrant / 8) *
      (1 - OriginXian / 324);
  } else if (Name === "Yingtian") {
    const Hou = Math.trunc(SdHalf / (Solar / 72)) / 18;
    EquaWhiteDif = (Lon - RangeAccum[LonOrder]) * (0.5 - (5 * Hou) / 3636);
  }
  let EquaLon = 0;
  // 大衍：（黃白差）距半交前後各九限，以差數爲減；距正交前後各九限，以差數爲加
  // if (LonRaw >= Quadrant && LonRaw < Quadrant * 3) {}
  const sign =
    (LonRaw >= Quadrant && LonRaw < 2 * Quadrant) || LonRaw >= 3 * Quadrant
      ? -1
      : 1;
  EclpWhiteDif *= sign;
  EquaWhiteDif *= sign;
  WhiteLon = EclpLon + EclpWhiteDif;
  EquaLon = EquaWhiteDif ? WhiteLon + EquaWhiteDif : 0;
  return { EclpLon, WhiteLon, EquaLon, EclpWhiteDif, EquaWhiteDif };
};
// console.log(MoonLonTable(55.25, 11.22, 'Qianxiang').EclpLon)
// console.log(MoonLonTable(45, 3, 'Qintian'))

export const MoonLatTable = (NodeAccum, Name) => {
  const { Type, Node, MoonLatAccumList } = Para[Name];
  const { MoonLatDifList } = Para[Name];
  /// ////預處理陰陽曆////////
  let Portion = 10;
  if (Type <= 4) Portion = 12;
  else if (Name === "Dayan") Portion = 120;
  else if (Name === "Wuji")
    Portion = 50 / 3; // 五紀正元找不到比例，瞎填
  else if (Name === "Tsrengyuan") Portion = 219 / 4;
  const NodeAccumHalf = NodeAccum % (Node / 2);
  const NodeAccumHalfInt = Math.trunc(NodeAccumHalf);
  const Yinyang = NodeAccum > Node / 2 ? 1 : -1;
  let Lat = 0;
  if (Type < 6) {
    Lat =
      Yinyang *
      (MoonLatAccumList[NodeAccumHalfInt] +
        ((NodeAccumHalf - NodeAccumHalfInt) *
          MoonLatDifList[NodeAccumHalfInt]) /
        Portion);
  } else if (Type === 6 || ["Wuji", "Tsrengyuan"].includes(Name)) {
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
  } else if (Name === "Dayan") {
    // 大衍的入交度數另有算式，我直接用月平行速來算 // 三次差：前半段 Δ = 171,-24,-8 後半段 Δ = -75,-40,8// 曲安京《曆法》頁251
    const MoonAvgVd = AutoMoonAvgV(Name);
    const LonRaw = NodeAccumHalf * MoonAvgVd;
    const Cycle = AutoNodeCycle(Name);
    const l = 15; // Cycle / 24 // 一象限15度
    const Lon = (LonRaw * 360) / Cycle;
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


// 《數》頁361 白道度是以黃道度、正交黃經的二元函數
export const MoonLonFormula = (NodeEclpLon, MoonNodeDifRev, Name) => {
  // SunEclpLon, NodeAccum,  // 該日距冬至黃道度，入交日。不知是否應該加上日躔
  const Solar = AutoSolar(Name);
  const NodeCycle = AutoNodeCycle(Name);
  const Quadrant = NodeCycle / 4;
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  // const Node50 = Node / 2
  // const NodeEclpLonRev = Math.abs(NodeEclpLon % Solar50 - Solar / 4) // 去二分度。黃白差在二分爲0
  const NodeEclpLonHalf = NodeEclpLon % Solar50;
  const NodeEclpLonRev = Solar25 - Math.abs(NodeEclpLonHalf - Solar25); // 去二至度
  // if (['Chongtian', 'Mingtian', 'Guantian'].includes(Name)) {
  //     if (Name === 'Chongtian') { // 半交後正交前-，正交後半交前+
  //         EclpWhiteDif = MoonEclpLonRev * (125 - MoonEclpLonRev) / 2400
  //     } else if (Name === 'Mingtian') {
  //         EclpWhiteDif = MoonEclpLonRev * (111.37 - MoonEclpLonRev) / 2000
  //     } else {
  //         EclpWhiteDif = MoonEclpLonRev * (400 - 3 * MoonEclpLonRev) / 8000
  //     }
  //     EquaWhiteDif = EclpWhiteDif * NodeEclpLonRev / 90
  // } else if (Name === 'Jiyuan') { // 正交在二至，黃白差大
  //     EclpWhiteDif = MoonEclpLonRev * (101 - MoonEclpLonRev) / 2000
  //     if (NodeAccum <= Node50 && NodeEclpLon < Solar50) {
  //         EclpWhiteDif *= 1.125
  //     } else {
  //         EclpWhiteDif *= .875
  //     }
  //     EquaWhiteDif = EclpWhiteDif * NodeEclpLonRev / Quadrant // 同名：赤白=黃赤+黃白，異名：赤白=黃赤-黃白 ？？
  // }
  // 《數》頁359
  let EclpWhiteDif =
    Math.abs(autoEquaEclp(MoonNodeDifRev, Name).Equa2EclpDif) / 2; // autoEquaEclp(MoonEclpLonRev, Name)
  if (Name === "Jiyuan") {
    if (NodeEclpLon < Solar50) EclpWhiteDif *= 1.125;
    else EclpWhiteDif *= 0.875;
  }
  EclpWhiteDif *= NodeEclpLonRev / Quadrant;
  return EclpWhiteDif;
};
// console.log(MoonLonFormula(91, 92, 'Jiyuan').EclpWhiteDif)

export const MoonLatFormula = (NodeAccum, Name, AnomaAccum, Sd) => {
  // 《中國古代曆法》頁146,陳美東《中國古代月亮極黃緯計算法》；《數》頁410
  const { Node } = Para[Name];
  const Cycle = AutoNodeCycle(Name);
  let MoonAvgVd = AutoMoonAvgV(Name); // 大衍：15*NodeAccum，0,1,...11 。其他都是13
  if (Name === "Qintian") MoonAvgVd = 1;
  const Cycle50 = Cycle / 2;
  const Cycle25 = Cycle / 4;
  const Cycle125 = Cycle / 8;
  const Lon = NodeAccum * MoonAvgVd;
  const LonHalf = Lon % Cycle50;
  const LonHalfRev = Cycle25 - Math.abs(LonHalf - Cycle25);
  let Lat = 0;
  // 崇玄「以四百一乘朔望加時入交常日⋯⋯得定朔望入交定積度分」，也就是說應該不用加入NodeAccumCorr
  // 崇玄崇天是反減半交，觀天紀元是反減交中度。但經過試驗，全部都是反減交中度
  if (Name === "Chongxuan") {
    const f1 = ((Cycle50 - LonHalfRev) * LonHalfRev) / (10000 / 7.3);
    const f2 = ((Cycle25 - LonHalfRev) * LonHalfRev) / 5600;
    const f3 = (Cycle25 - LonHalfRev) ** 2 / 11500;
    if (LonHalfRev < 30) Lat = f1 - f2;
    else Lat = f1 - f3;
  } else if (Name === "Qintian") {
    NodeAccum += AutoTcorr(AnomaAccum, Sd, Name, NodeAccum).NodeAccumCorrA; // 欽天用入交定日
    const NodeAccumHalf = NodeAccum % Cycle50;
    Lat = ((Node / 2 - NodeAccumHalf) * NodeAccumHalf) / (556 / 72);
  } else if (Name === "Chongtian") {
    const f1 = ((1010 - 5 * LonHalfRev) * LonHalfRev) / 8400;
    const f2 = ((Cycle125 - LonHalfRev) * LonHalfRev) / 4000; // 這兩個是一樣的
    const f3 = ((Cycle25 - LonHalfRev) * (LonHalfRev - Cycle25 / 2)) / 4000;
    if (LonHalfRev < Cycle125) Lat = f1 - f2;
    else Lat = f1 + f3;
  } else if (Name === "Guantian") {
    const f1 = ((Cycle50 - LonHalfRev) * LonHalfRev) / 1380;
    const f2 = LonHalfRev / 500;
    const f3 = (LonHalfRev - Cycle25) / 500;
    if (LonHalfRev < Cycle125) Lat = f1 - f2;
    else Lat = f1 + f3;
  } else if (Name === "Jiyuan") {
    const tmp = LonHalfRev - ((Cycle25 - LonHalfRev) * LonHalfRev) / 500;
    Lat = ((Cycle50 - tmp) * tmp) / 1375;
  }
  if (Lon < Cycle50) Lat = -Lat; // 調用需要注意：此處統一先陽曆後陰曆
  const Lat1 = 91.311 - Lat;
  return { Lat, Lat1 };
};
// console.log(MoonLatFormula(15, 'Jiyuan'))

export const autoMoonPos = (NodeAccum, MoonWhiteLon, Name) => {
  let { Type, Solar, SolarRaw, Sidereal, Node } = Para[Name];
  Solar = Solar || SolarRaw;
  Sidereal = Sidereal || Solar;
  const MoonAvgVd = AutoMoonAvgV(Name);
  const Quadrant = Type === 11 ? Sidereal / 4 : AutoNodeCycle(Name) / 4;
  // 正交月黃經。《數》頁351
  // const tmp2 = Node - NewmNodeAccumPrint[i - 1] // 平交入朔
  // const NodeAnomaAccum = (AnomaAccumNight + tmp2) % Anoma // 每日夜半平交入轉
  const tmp3 = Node - NodeAccum; // 距後日
  const tmp4 = tmp3 * MoonAvgVd; // 距後度
  // let NodeSdDay = Sd + tmp3 // 每日夜半平交日辰，我定義的：夜半的下個正交距離冬至日數。這算出來又是做什麼的？？
  const NodeEclp = (MoonWhiteLon + tmp4) % Sidereal; // 正交距冬至度數 // 算出來好迷啊，莫名其妙
  // const NodeSdMoonTcorr = AutoTcorr(NodeAnomaAccum, Sd, Name, NodeAccum).MoonTcorr // 遲加疾減
  // NodeSdDay = (NodeSdDay + NodeSdMoonTcorr) % Solar // 正交日辰=平交日辰+月亮改正
  const MoonNodeDif = MoonWhiteLon - NodeEclp;
  const MoonNodeDifHalf = MoonNodeDif % (Quadrant * 2);
  const MoonNodeDifQuar = MoonNodeDif % Quadrant; // 所入初末限：置黃道宿積度，滿交象度（90多那個）去之，在半交象已下爲初限
  const MoonNodeDifRev =
    Quadrant / 2 - Math.abs(Quadrant / 2 - MoonNodeDifQuar);
  let EclpWhiteDif = 0;
  let EquaWhiteDif = 0;
  let EquaLat = 0;
  let EquaLon = 0;
  let EclpLon = 0;
  let EclpLat = 0
  if (Type === 6) {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Huangji");
  } else if (Name === "Qintian") {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Qintian");
  } else if (Type === 7 || Name === "Chongxuan") {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Dayan");
  } else if (["Yingtian", "Qianyuan", "Yitian"].includes(Name)) {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Yingtian");
  } else if (["Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Guantian");
  } else if (["Chongtian", "Mingtian"].includes(Name)) {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, Name);
  } else if (Type === 9 || Type === 10) {
    EclpWhiteDif = MoonLonFormula(NodeEclp, MoonNodeDifRev, "Jiyuan");
  } else if (Type === 11) {
    const Func = HushigeyuanMoon(NodeEclp, MoonNodeDif);
    EquaWhiteDif = Func.EquaWhiteDif;
    EquaLat = Func.EquaLat;
    EquaLon = Func.EquaLon;
    EclpLon = Func.WhiteLon;
  }
  const sign1 = MoonNodeDifHalf > Quadrant ? -1 : 1; // 距半交後正交前，以差數爲減；距正交後、半交前，以差數爲加
  EclpWhiteDif *= sign1;
  if (Type < 11) {
    EclpLon = MoonWhiteLon + EclpWhiteDif;
  }
  let MoonLat = {};
  if (Type < 11) {
    if (Type <= 3) {
      MoonLat = MoonLatTable(NodeAccum, "Qianxiang");
    } else if (Name === "Yuanjia") {
      MoonLat = MoonLatTable(NodeAccum, Name);
    } else if (Type === 4) {
      MoonLat = MoonLatTable(NodeAccum, "Daming");
    } else if (Type === 6) {
      MoonLat = MoonLatTable(NodeAccum, "Huangji");
    } else if (["Qintian", "Xuanming", "Zhide", "Dayan"].includes(Name)) {
      MoonLat = MoonLatTable(NodeAccum, "Dayan");
    } else if (Type === 7) {
      MoonLat = MoonLatTable(NodeAccum, Name);
    } else if (["Chongxuan", "Yingtian", "Qianyuan", "Yitian"].includes(Name)) {
      MoonLat = MoonLatFormula(NodeAccum, "Chongxuan");
    } else if (["Chongtian"].includes(Name)) {
      MoonLat = MoonLatFormula(NodeAccum, Name);
    } else if (["Guantian", "Mingtian", "Fengyuan", "Zhantian"].includes(Name)) {
      MoonLat = MoonLatFormula(NodeAccum, "Guantian");
    } else if (Type === 9 || Type === 10) {
      MoonLat = MoonLatFormula(NodeAccum, "Jiyuan");
    }
    EquaLat = MoonLat.EquaLat;
    EclpLat = MoonLat.Lat;
  }
  return { NodeEclp, EclpLon, EclpWhiteDif, EquaWhiteDif, EquaLon, EquaLat, EclpLat };
};
// console.log(autoMoonPos(234, 45, 4.11, 'Dayan'))
