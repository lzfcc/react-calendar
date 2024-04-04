import Para from "../parameter/calendars.mjs";
import {
  Equa2EclpTable,
  MoonLatTable,
  latTable1,
  riseTable1,
  latRiseTable2,
  latRiseTable3,
  dialTable1,
  dialTable2,
  dialTable3,
} from "./table.mjs";
import {
  Equa2EclpFormula,
  latFormula,
  dialFormula,
  riseFormula,
} from "./formula.mjs";
import { Hushigeyuan, HushigeyuanMoon } from "../equation/geometry.mjs";
import { AutoDifAccum, AutoTcorr } from "./acrv.mjs";
import { AutoMoonAvgV, AutoNodeCycle, AutoSolar } from "../parameter/auto_consts.mjs";

export const autoEquaEclp = (Gong, Name) => {
  // 輸入度數而非距冬至時間 // 只有公式法的才有黃轉赤。表格的是直接取符號相反
  const { Type, Sidereal, Solar, SolarRaw } = Para[Name];
  Gong %= Sidereal || Solar || SolarRaw;
  let Func = {};
  if (Type <= 7 || ["Yingtian", "Qianyuan", "Yitian"].includes(Name)) {
    if (["Yisi", "LindeB", "Shenlong"].includes(Name))
      Func = Equa2EclpTable(Gong, "Linde");
    else Func = Equa2EclpTable(Gong, Name);
  } else {
    if (Type === 9 || Type === 10) Func = Equa2EclpFormula(Gong, "Jiyuan");
    else if (Type === 11) Func = Hushigeyuan(Gong);
    else Func = Equa2EclpFormula(Gong, Name); // (Name === 'Dayan' || Type === 8)
  }
  const { Equa2Eclp, Eclp2Equa, Equa2EclpDif, Eclp2EquaDif } = Func;
  return {
    Equa2Eclp: +Equa2Eclp.toFixed(10),
    Equa2EclpDif: +Equa2EclpDif.toFixed(10),
    Eclp2Equa: +Eclp2Equa.toFixed(10),
    Eclp2EquaDif: +Eclp2EquaDif.toFixed(10),
  };
};
/**
 * 藤豔輝<v>紀元曆日食算法及精度分析</v>距離冬至 31.816049 日，紀元日出 2126.2566/7290 = 29.1667572，我之前是直接用黃經，是 29.227518，差了 1 天多，改用距冬至日數，加上日躔，29.1664，密合。
 * 陈美东《中国古代昼夜漏刻长度的计算法》「该文中所示二十四节气(平气)太阳黄经的算式，在本文中适用东汉四分历、景初历、元嘉历、大明历、皇极历、大业历、戊寅历、应天历、乾元历和仪天历等十种历法。而该文中所示二十四节气(定气)太阳黄经的算式，则适用于本文中的麟德历、大衍历、宣明历、崇玄历、崇天历、明天历、观天历和纪元历等八种历法
 * 陈美東《崇玄儀天崇天三曆晷長計算法及三次差內插法的應用》。1、距二至的整數日，2、算上二至中前後分的修正值。我現在直接用正午到二至的距離。之所以那麼麻煩，應該是因爲整數好算一些，實在迷惑。冬至到夏至，盈縮改正爲負，入盈曆，實行日小於平行日。因此自變量不應該是黃經，而是達到實行度所需日數！
魏晉的黃道去極，是根據節氣來的，日書就不調用了。崇玄赤轉赤緯，「昏後夜半日數」，晷長：「日中入二至加時以來日數」。紀元「午中日行積度」
崇天的漏刻、赤緯跟《中國古代晝夜漏刻長度的計算法》一致
 * Lon2LatTable1 自然都是平行
 * Lon2LatTable2。Type === 7 || ['Yingtian', 'Qianyuan']會在子函數用定氣算，所以不加改正
 * Lon2LatFormula。紀元的曲線和現代公式擬合得很好，幾乎重合。因此自變量是黃道實行度。唯獨儀天是距二至的時間，不能加改正
 * Hushigeyuan 實行
 * dialFormula 都是實行度，儀天也是
 * 陳美東誤差：四分.7，麟德.13，大衍.06，宣明.45，崇玄.09，儀天.45，崇天明天觀天.23 .20 .21，紀元.11，大明.12，授時.11。我testLon2Lat：後漢四分：0.7918, 麟德：0.0874, 大衍：0.0448, 宣明：0.3109, 崇玄：0.1009, 應天：0.3115, 乾元：0.3120, 儀天：0.3088, 崇天：0.0536, 明天：0.0539, 觀天：0.0541, 紀元：0.0089, 重修大明：0.0058, 授時：0.0148,
 * @param {*} Sd 距冬至時間
 * @param {*} SolsDeci 冬至小分
 * @param {*} isBare true：不加太陽改正
 * @param {*} Name 曆法名
 * @returns 
 */
export const autoLat = (Sd, Name, isBare) => {
  const { Type } = Para[Name];
  let Corr = 0;
  let Lat = 0;
  if (isBare !== true) {
    if (
      [
        "Linde",
        "Yisi",
        "LindeB",
        "Shenlong",
        "Chongxuan",
        "Qintian",
        "Chongtian",
        "Mingtian",
        "Guantian",
        "Fengyuan",
        "Zhantian",
        "Jiyuan",
      ].includes(Name) ||
      Type === 11
    ) {
      Corr = AutoDifAccum(0, Sd, Name).SunDifAccum;
    }
  }
  const X = Sd + Corr;
  if (Type <= 4 || Name === "Huangji") Lat = latTable1(X, "Easthan");
  else if (["Linde", "Yisi", "LindeB", "Shenlong"].includes(Name)) {
    Lat = latRiseTable2(X, "Linde").Lat;
  } else if (Type === 6) {
    Lat = latRiseTable2(X, Name).Lat;
  } else if (Type === 10) {
    Lat = latRiseTable2(X, "Daming3").Lat;
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Lat = latRiseTable3(X, "Dayan").Lat;
  } else if (["Xuanming", "Yingtian", "Qianyuan"].includes(Name)) {
    Lat = latRiseTable3(X, Name).Lat;
  } else if (Type === 8 || Name === "Qintian") {
    // 北宋latFormula用實行
    Lat = latFormula(X, Name);
  } else if (Type === 9) {
    Lat = latFormula(X, "Jiyuan");
  } else if (Type === 11) {
    Lat = Hushigeyuan(X, Name).Lat;
  }
  return Lat;
};

export const autoRise = (Sd, SolsDeci, Name) => {
  const { Type } = Para[Name];
  let { Solar, SolarRaw } = Para[Name];
  Solar = Solar || SolarRaw;
  let Corr = 0;
  let Plus = 0;
  let Rise = 0;
  let SdNoon = (Math.trunc(Sd + SolsDeci) - SolsDeci + Solar + 0.5) % Solar; // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
  if (Type <= 4)
    Plus = -1.5; // 非常詭異
  else if (Type === 11) Plus = -0.5; // 授時「置所求日晨前夜半黃道積度」
  SdNoon += Plus;
  if (
    [
      "Linde",
      "Yisi",
      "LindeB",
      "Shenlong",
      "Chongxuan",
      "Qintian",
      "Chongtian",
      "Mingtian",
      "Guantian",
      "Fengyuan",
      "Zhantian",
      "Jiyuan",
    ].includes(Name) ||
    Type === 11
  ) {
    Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum;
  }
  const X = SdNoon + Corr;
  if (["Daming", "Yukuo"].includes(Name)) {
    Rise = riseTable1(X, "Daming");
  } else if (["Daye", "Zhangmengbin", "Liuxiaosun"].includes(Name)) {
    Rise = riseTable1(X, "Daye");
  } else if (Type <= 3) {
    Rise = riseTable1(X, "Easthan");
  } else if (Type === 4) {
    Rise = riseTable1(X, Name);
  } else if (["Linde", "Yisi", "LindeB", "Shenlong"].includes(Name)) {
    Rise = latRiseTable2(X, "Linde").Rise;
  } else if (Type === 6) {
    Rise = latRiseTable2(X, Name).Rise;
  } else if (Type === 10) {
    Rise = latRiseTable2(X, "Daming3").Rise;
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Rise = latRiseTable3(X, "Dayan").Rise;
  } else if (["Xuanming", "Yingtian", "Qianyuan"].includes(Name)) {
    Rise = latRiseTable3(X, Name).Rise;
  } else if (Type === 8 || Name === "Qintian") {
    // 北宋latFormula用實行
    Rise = riseFormula(latFormula(X, Name), SdNoon, Name);
  } else if (Type === 9) {
    Rise = riseFormula(latFormula(X, "Jiyuan"), SdNoon, "Jiyuan");
  } else if (Type === 11) {
    Rise = Hushigeyuan(X, Name).Rise;
  }
  return Rise;
};
export const autoDial = (Sd, SolsDeci, Name) => {
  const { Type } = Para[Name];
  let { Solar, SolarRaw } = Para[Name];
  Solar = Solar || SolarRaw;
  let Corr = 0;
  let Plus = 0;
  let Dial = 0;
  let SdNoon = (Math.trunc(Sd + SolsDeci) - SolsDeci + Solar + 0.5) % Solar; // 所求日晨前夜半 // 這樣處理後算出來的緯度只是當日的情況，不能計算任意時刻
  if (Type <= 4)
    Plus = -1.5; // 非常詭異
  else if (Type === 11) Plus = -0.5; // 授時「置所求日晨前夜半黃道積度」
  SdNoon += Plus;
  if (
    [
      "Linde",
      "Yisi",
      "LindeB",
      "Shenlong",
      "Chongxuan",
      "Qintian",
      "Yitian",
      "Chongtian",
      "Mingtian",
      "Guantian",
      "Fengyuan",
      "Zhantian",
      "Jiyuan",
    ].includes(Name) ||
    Type === 11
  ) {
    Corr = AutoDifAccum(0, SdNoon, Name).SunDifAccum;
  }
  const X = SdNoon - Corr; // 這要反著來
  if (["Daming", "Yukuo"].includes(Name)) {
    Dial = dialTable1(X, "Daming");
  } else if (["Daye", "Zhangmengbin", "Liuxiaosun"].includes(Name)) {
    Dial = dialTable1(X, "Daye");
  } else if (Type <= 3) {
    Dial = dialTable1(X, "Easthan");
  } else if (Type === 4) {
    Dial = dialTable1(X, Name);
  } else if (["Linde", "Yisi", "LindeB", "Shenlong"].includes(Name)) {
    Dial = dialTable2(X, "Linde");
  } else if (Type === 6) {
    Dial = dialTable2(X, Name);
  } else if (["Dayan", "Zhide", "Wuji", "Tsrengyuan"].includes(Name)) {
    Dial = dialTable3(latRiseTable3(X, "Dayan").Lat1);
  } else if (
    ["Xuanming", "Yingtian", "Qianyuan"].includes(Name) &&
    Name !== "Qintian"
  ) {
    Dial = dialTable3(latRiseTable3(X, Name).Lat1);
  } else if ((Type >= 8 && Type <= 10) || Name === "Qintian") {
    if (Type === 8 || Name === "Qintian") {
      // 北宋Lon2LatFormula用實行
      Dial = dialFormula(X, Name, SolsDeci);
    } else if (Type >= 9) {
      Dial = dialFormula(X, "Jiyuan");
    }
  }
  return Dial;
};

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

export const autoMoonLon = (NodeAccum, MoonWhiteLon, Name) => {
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
    EclpLat = MoonLat.Lat; // MoonEquaLat - autoLat(SunEclpLon, .5, Name)
  }
  return { NodeEclp, EclpLon, EclpWhiteDif, EquaWhiteDif, EquaLon, EquaLat, EclpLat };
};
// console.log(autoMoonLon(234, 45, 4.11, 'Dayan'))
