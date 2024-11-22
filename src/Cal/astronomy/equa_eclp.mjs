import { AutoSidereal } from "../parameter/auto_consts.mjs";
import { Hushigeyuan } from "../equation/geometry.mjs";
import Para from "../parameter/calendars.mjs";
import { deci } from "../parameter/functions.mjs";

/**
 * 古曆黃赤轉換經驗公式。表格法用等差級數公式轉換爲公式法
 * @param {*} Name
 * @param {*} Lon 半象限以內的x
 * @param {*} isWhite 用於欽天的特例
 * @returns 黃赤差、赤黃差
 */
export const equa2EclpPoly = (LonHalf, Name, isWhite) => {
  const { Type, Solar } = Para[Name];
  const SolarQuar = Solar / 4;
  const SolarOcta = Solar / 8;
  const LonQuar = LonHalf % SolarQuar; // 滿象限去之
  const Lon = SolarOcta - Math.abs(LonQuar - SolarOcta); // 觀天：若在四十五度六十五分、秒五十四半已下爲初限；已上，用減象限，餘爲末限。
  const main = (Lon, a, b, c) => {
    c = Math.abs(c) || 1;
    const Equa2EclpDif = (Lon * (a - c * Lon)) / b;
    const h =
      Math.sqrt(((b - a) / c / 2) ** 2 + (b / c) * Lon) - (b - a) / c / 2; //  x - x(a - x) / b 的反函數
    return { Equa2EclpDif, h };
  };
  let h = 0;
  let Eclp2EquaDif = 0;
  let Equa2EclpDif = 0;
  // 公式法《中國古曆通解》p215：
  // NodeDifQuarRev / Xian * (XianDifInitial - XianDifChange * (NodeDifQuarRev / Xian - 1) / 2)
  if (Name === "Chongxuan") {
    // fmax(45.568)=2.99
    Equa2EclpDif =
      (Lon * (1315 - 14.4 * Lon) - (Lon * (4566 - Lon)) / 1696) / 10000; // 後面一項最多只有0.012的修正值，從0開始逐漸增大，不知道什麼作用
    h =
      Math.sqrt((694 + 57742 / 122107) * Lon + (301 + 81608 / 122107) ** 2) -
      (301 + 81608 / 122107);
  } else {
    let a = 0,
      b = 0,
      c = 1;
    let a2 = 0,
      b2 = 0,
      c2 = 1;
    let MaxX = 0;
    // a, b, c 見我的《律曆初階·天文計算·黃赤轉換》
    if (Type === 6) {
      a = 772;
      b = 14400; // 分母1800/4=450
      c = -1;
      a2 = 956;
      b2 = 14400;
      MaxX = 44; // 表格法依平 4*11
    } else if (Name === "Qintian") {
      // 通解p496
      if (isWhite === true) {
        // 欽天黃白限不是5，是5.07
        a = 431.1914; //85 * 5.072840277777778
        b = 3705.654; // 144 * 5.072840277777778**2
        c = 5;
      } else {
        // XianDifInitial = 40 / 72; // 《通解》p496
        // XianDifChange = - 5 / 72;
        a = 85;
        b = 720; // fmax(42.5)=2.509
      }
    } else if (Type === 7) {
      // 大衍公式《通解》p215
      a = 125;
      b = 1200; // 在45度正好=3，所以45以上處理爲依平
      MaxX = 45; // 表格法依平
    } else if (Name === "Yingtian") {
      // 通解p523，極值2+68/101
      a = 85;
      b = 673 + 1 / 3; // fmax(42.5)=2.683
    } else if (Name === "Qianyuan") {
      a = 95;
      b = 840; // fmax(47.5)=2.686，實際可用f(45)=2.678
      MaxX = 45;
    } else if (Name === "Yitian") {
      a = 112;
      b = 1010; // fmax(56)=3.105，實際可用f(45)=2.98515
      MaxX = 45;
    } else if (Name === "Chongtian") {
      a = 125;
      b = 1200; // 在45度正好=3，所以45以上處理爲依平
    } else if (Name === "Mingtian") {
      a = 111.37;
      b = 1000;
    } else if (["Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
      a = 400;
      b = 4000;
      c = 3; // fmax(66.666)=3.333
      // Equa2EclpDif = (Lon * (400 - 3 * Lon)) / 4000;
      // h = Math.sqrt(360000 + (4000 / 3) * Lon) - 600;
      // 可得 XianDifInitial = 77/160; XianDifChange = 6/160
    } else if (Type === 9 || Type === 10) {
      // 紀元一直到南宋、大明、庚午
      a = 101;
      b = 1000;
      // if (LonRaw < SolarQuar || (LonRaw >= SolarHalf && LonRaw < SolarQuar3)) {
      // h = Math.sqrt(202050.25 + 1000 * Lon) - 449.5;
      // }
      //  else {
      //     h = -Math.sqrt(303050.25 - 1000 * LonHalf) + 550.5 // 這兩個公式是一樣的，只是對稱而已
      // }
    }
    MaxX = MaxX || a / c / 2; // 函數最大值的x
    if (Type === 6 && LonHalf > SolarQuar) {
      // 皇極的冬至到春分和春分到夏至不一樣
      a = a2;
      b = b2;
      c = c2;
    }
    if (MaxX <= 45) {
      if (Lon > MaxX) {
        const Func = main(MaxX, a, b, c);
        Equa2EclpDif = Func.Equa2EclpDif;
        h = Func.h;
      } else {
        const Func = main(Lon, a, b, c);
        Equa2EclpDif = Func.Equa2EclpDif;
        h = Func.h;
      }
    } else {
      const Func = main(Lon, a, b, c);
      Equa2EclpDif = Func.Equa2EclpDif;
      h = Func.h;
    }
  }
  // 曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元黃赤。我把其他幾個曆法補出來了
  Eclp2EquaDif = Math.abs(Lon - h);
  return { Equa2EclpDif, Eclp2EquaDif };
};

export const Equa2EclpTable = (LonRaw, Name) => {
  let { Type, Sidereal, Solar } = Para[Name];
  Sidereal = Sidereal || Solar;
  const SiderealHalf = Sidereal / 2;
  const SiderealQuar = Sidereal / 4;
  const LonHalf = LonRaw % SiderealHalf;
  const Lon = SiderealQuar - Math.abs(LonHalf - SiderealQuar);
  let XianList = [];
  if (Type <= 4) {
    XianList = [
      0,
      4,
      4,
      3,
      4,
      4,
      4,
      3,
      4,
      4,
      4,
      3,
      4,
      5 + deci(SiderealQuar),
      4,
      3,
      4,
      4,
      4,
      3,
      4,
      4,
      4,
      3,
      4
    ]; // 劉洪濤
  } else if (Type === 6) {
    XianList = [
      0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.31, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4
    ]; // 《中國古代曆法》57頁
  } else if (
    [
      "Dayan",
      "Zhide",
      "Wuji",
      "Tsrengyuan",
      "Xuanming",
      "Qintian",
      "Yingtian",
      "Qianyuan",
      "Yitian"
    ].includes(Name)
  ) {
    XianList = [
      0,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      1 + deci(SiderealQuar),
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5
    ];
  }

  let XianDifInitial = 0;
  let XianDifChange = 0;
  if (Type === 6) {
    // 爲何皇極增速先慢後快，大衍先快後慢？感覺皇極是乾象曆的慣性
    XianDifInitial = 97 / 450; // ⋯⋯四度爲限。初數九十七，每限增一，以終百七
    XianDifChange = 1 / 450;
  } else if (
    ["Dayan", "Zhide", "Wuji", "Tsrengyuan", "Xuanming"].includes(Name)
  ) {
    XianDifInitial = 12 / 24;
    XianDifChange = -1 / 24;
  } else if (Name === "Qintian") {
    XianDifInitial = 40 / 72; // 《通解》p496
    XianDifChange = -5 / 72;
  } else if (Name === "Yingtian") {
    // XianDifInitial = 12 / 30.3; // 這樣改之後能每限都不同，按照原文，有4限是一樣的
    // XianDifChange = -.5 / 20.2;
    XianDifInitial = 12 / 20.2; // 極值與《中國古代立法》p59一致。
    XianDifChange = -1.5 / 20.2;
  } else if (Name === "Qianyuan") {
    XianDifInitial = (9 * 5) / 84;
    XianDifChange = -5 / 84;
  } else if (Name === "Yitian") {
    XianDifInitial = 107 / 202;
    XianDifChange = -10 / 202;
  }
  const length = XianList.length - 2;
  const XianAccum = XianList.slice();
  for (let i = 1; i <= length + 1; i++) {
    XianAccum[i] += XianAccum[i - 1];
  }
  const XianDif = [];
  XianDif[1] = XianDifInitial;
  for (let i = 2; i <= length / 2; i++) {
    XianDif[i] = XianDif[i - 1] + XianDifChange;
  }
  XianDif[length / 2 + 1] = 0;
  XianDif[length / 2 + 2] = XianDif[length / 2];
  for (let i = length / 2 + 3; i <= length + 1; i++) {
    XianDif[i] = XianDif[i - 1] - XianDifChange;
  }
  const XianDifAccum = [];
  XianDifAccum[0] = 0;
  if (Type <= 4) {
    for (let i = 1; i <= 12; i++) {
      XianDifAccum[i] = XianDifAccum[i - 1] + 1 / 4;
    }
    for (let i = 13; i <= 24; i++) {
      XianDifAccum[i] = XianDifAccum[i - 1] - 1 / 4;
    }
  } else {
    for (let i = 1; i <= length / 2 + 1; i++) {
      XianDifAccum[i] = XianDifAccum[i - 1] + XianDif[i];
    }
    for (let i = length / 2 + 2; i <= length + 1; i++) {
      XianDifAccum[i] = XianDifAccum[i - 1] - XianDif[i];
    }
    XianDifAccum[length + 1] = 0;
  }
  let XianOrder = 0;
  for (let j = 1; j <= XianList.length - 2; j++) {
    if (XianAccum[j] <= Lon && Lon < XianAccum[j + 1]) {
      XianOrder = j;
    }
  }
  let Equa2EclpDif =
    XianDifAccum[XianOrder] +
    ((XianDifAccum[XianOrder + 1] - XianDifAccum[XianOrder]) *
      (Lon - XianAccum[XianOrder])) /
      (XianAccum[XianOrder + 1] - XianAccum[XianOrder]); // 一次內插
  let sign1 = 1;
  if (
    LonRaw < Sidereal / 4 ||
    (LonRaw >= SiderealHalf && LonRaw < Sidereal * 0.75)
  ) {
    sign1 = -1;
  }
  Equa2EclpDif *= sign1;
  const Equa2Eclp = LonRaw + Equa2EclpDif;
  const Eclp2EquaDif = -Equa2EclpDif;
  const Eclp2Equa = LonRaw + Eclp2EquaDif;
  return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif };
};

export const Equa2EclpFormula = (LonRaw, Name) => {
  // 公式化的，週天度就用自己的
  const Solar = AutoSidereal(Name);
  const SolarQuar = Solar / 4;
  const SolarHalf = Solar / 2;
  let Equa2Eclp = 0;
  let Eclp2Equa = 0;
  const LonHalf = LonRaw % SolarHalf;
  let { Equa2EclpDif, Eclp2EquaDif } = equa2EclpPoly(LonHalf, Name); // Equa2EclpDif黃赤道差
  const sign1 = LonHalf < SolarQuar ? -1 : 1;
  Equa2EclpDif *= sign1;
  Eclp2EquaDif *= -sign1;
  Equa2Eclp = LonRaw + Equa2EclpDif;
  Eclp2Equa = LonRaw + Eclp2EquaDif;
  return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif };
};
// console.log(Equa2EclpFormula(3, "Jiyuan").Equa2EclpDif)

/**
 * 只有公式法的才有黃轉赤。表格的是直接取符號相反
 * @param {*} Gong 度數而非距冬至時間
 * @param {*} Name
 * @returns
 */
export const equaEclp = (Gong, Name) => {
  const { Type, Sidereal, Solar, SolarRaw } = Para[Name];
  Gong %= Sidereal || Solar || SolarRaw;
  let Func = {};
  // if (Type <= 7 || ["Yingtian", "Qianyuan", "Yitian"].includes(Name)) {
  //   if (["Yisi", "LindeB", "Shenlong"].includes(Name))
  //     Func = Equa2EclpTable(Gong, "Linde");
  //   else Func = Equa2EclpTable(Gong, Name);
  // } else {
  //   if (Type === 9 || Type === 10) Func = Equa2EclpFormula(Gong, "Jiyuan");
  //   else if (Type === 11) Func = Hushigeyuan(Gong);
  //   else Func = Equa2EclpFormula(Gong, Name); // (Name === 'Dayan' || Type === 8)
  // }
  if (Type <= 4) {
    Func = Equa2EclpTable(Gong, Name);
  } else if (Type === 11) {
    Func = Hushigeyuan(Gong);
  } else {
    Func = Equa2EclpFormula(Gong, Name);
  }
  const { Equa2Eclp, Eclp2Equa, Equa2EclpDif, Eclp2EquaDif } = Func;
  return {
    Equa2Eclp: +Equa2Eclp.toFixed(10),
    Equa2EclpDif: +Equa2EclpDif.toFixed(10),
    Eclp2Equa: +Eclp2Equa.toFixed(10),
    Eclp2EquaDif: +Eclp2EquaDif.toFixed(10)
  };
};
