import { AutoSidereal } from "../parameter/auto_consts.mjs";
import { Hushigeyuan } from "../equation/geometry.mjs";
import Para from "../parameter/calendars.mjs";
import { deci } from "../parameter/functions.mjs";

export const Equa2EclpTable = (LonRaw, Name) => {
  let { Type, Sidereal, Solar } = Para[Name];
  Sidereal = Sidereal || Solar;
  const Sidereal50 = Sidereal / 2;
  const Sidereal25 = Sidereal / 4;
  const LonHalf = LonRaw % Sidereal50;
  const Lon = Sidereal25 - Math.abs(LonHalf - Sidereal25);
  let Range = [];
  if (Type <= 4) {
    Range = [
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
      5 + deci(Sidereal25),
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
    ]; // 劉洪濤
  } else if (["Huangji", "Linde", "LindeB"].includes(Name)) {
    Range = [
      0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3.31, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
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
      "Yitian",
    ].includes(Name)
  ) {
    Range = [
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
      1 + deci(Sidereal25),
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
      5,
    ];
  }
  let LonDifDifInitial = 0;
  let LonDifDifChange = 0;
  if (["Huangji", "Linde", "LindeB"].includes(Name)) {
    // 爲何皇極增速先慢後快，大衍先快後慢？
    LonDifDifInitial = 97 / 450; // ⋯⋯四度爲限。初數九十七，每限增一，以終百七
    LonDifDifChange = 1 / 450;
  } else if (
    ["Dayan", "Zhide", "Wuji", "Tsrengyuan", "Xuanming"].includes(Name)
  ) {
    LonDifDifInitial = 12 / 24;
    LonDifDifChange = -1 / 24;
  } else if (Name === "Qintian") {
    LonDifDifInitial = 40 / 72;
    LonDifDifChange = -5 / 72;
  } else if (Name === "Yingtian") {
    LonDifDifInitial = 12 / 20.2;
    LonDifDifChange = -1.5 / 20.2;
  } else if (Name === "Qianyuan") {
    LonDifDifInitial = 9 / 16.8;
    LonDifDifChange = -1 / 16.8;
  } else if (Name === "Yitian") {
    LonDifDifInitial = 107 / 202;
    LonDifDifChange = -10 / 202;
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
  if (Type <= 4) {
    for (let i = 1; i <= 12; i++) {
      LonDifAccum[i] = LonDifAccum[i - 1] + 1 / 4;
    }
    for (let i = 13; i <= 24; i++) {
      LonDifAccum[i] = LonDifAccum[i - 1] - 1 / 4;
    }
  } else {
    for (let i = 1; i <= length / 2 + 1; i++) {
      LonDifAccum[i] = LonDifAccum[i - 1] + LonDifDif[i];
      LonDifAccum[i] = parseFloat(LonDifAccum[i].toPrecision(14));
    }
    for (let i = length / 2 + 2; i <= length + 1; i++) {
      LonDifAccum[i] = LonDifAccum[i - 1] - LonDifDif[i];
      LonDifAccum[i] = parseFloat(LonDifAccum[i].toPrecision(14));
    }
    LonDifAccum[length + 1] = 0;
  }
  let LonOrder = 0;
  for (let j = 1; j <= Range.length - 2; j++) {
    if (RangeAccum[j] <= Lon && Lon < RangeAccum[j + 1]) {
      LonOrder = j;
    }
  }
  let Equa2EclpDif =
    LonDifAccum[LonOrder] +
    ((LonDifAccum[LonOrder + 1] - LonDifAccum[LonOrder]) *
      (Lon - RangeAccum[LonOrder])) /
    (RangeAccum[LonOrder + 1] - RangeAccum[LonOrder]); // 一次內插
  let sign1 = 1;
  if (
    LonRaw < Sidereal / 4 ||
    (LonRaw >= Sidereal50 && LonRaw < Sidereal * 0.75)
  )
    sign1 = -1;
  Equa2EclpDif *= sign1;
  const Equa2Eclp = LonRaw + Equa2EclpDif;
  const Eclp2EquaDif = -Equa2EclpDif;
  const Eclp2Equa = LonRaw + Eclp2EquaDif;
  return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif };
};
// console.log(Equa2EclpTable(1, 'Qianxiang'))

export const Equa2EclpFormula = (LonRaw, Name) => {
  // 公式化的，週天度就用自己的
  const Solar = AutoSidereal(Name);
  const Solar25 = Solar / 4;
  const Solar50 = Solar / 2;
  const Solar125 = Solar / 8;
  const Solar75 = Solar * 0.75;
  let Equa2Eclp = 0;
  let Eclp2Equa = 0;
  const LonQuar = LonRaw % Solar25;
  const Lon = Solar125 - Math.abs(LonQuar - Solar125);
  let h = 0;
  let Eclp2EquaDif = 0;
  let Equa2EclpDif = 0;
  // 這些函數並不是以91度或者45度對稱，而是將近60度左右
  if (Name === "Chongxuan") {
    Equa2EclpDif =
      ((1315 - 14.4 * Lon) * Lon - (Lon * (4566 - Lon)) / 1696) / 10000;
    // const tmp1 =(frc('8685 4566/1696').div(frc(14.4).sub('1/1696'))).div(2).toFraction(true) // '301 81608 / 122107'
    // const tmp2=frc(10000).div(frc(14.4).sub('1/1696')).toFraction(true) // "694 57742/122107"
    h =
      Math.sqrt((694 + 57742 / 122107) * Lon + (301 + 81608 / 122107) ** 2) -
      (301 + 81608 / 122107);
  } else if (["Dayan", "Chongtian"].includes(Name)) {
    if (Lon <= 45) {
      Equa2EclpDif = (Lon * (125 - Lon)) / 1200; // 在45度正好=3，所以45以上處理爲依平
      h = Math.sqrt(288906.25 + 1200 * Lon) - 537.5;
    } else {
      Equa2EclpDif = 3;
      h = 3;
    }
  } else if (Name === "Mingtian") {
    Equa2EclpDif = (Lon * (111.37 - Lon)) / 1000;
    h = Math.sqrt(197415.819225 + 1000 * Lon) - 444.315;
  } else if (["Guantian", "Fengyuan", "Zhantian"].includes(Name)) {
    Equa2EclpDif = (Lon * (400 - 3 * Lon)) / 4000;
    h = Math.sqrt(360000 + (4000 / 3) * Lon) - 600;
  } else if (Name === "Jiyuan") {
    // 紀元一直到南宋、大明、庚午
    Equa2EclpDif = (Lon * (101 - Lon)) / 1000;
    // if (LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75)) {
    h = Math.sqrt(202050.25 + 1000 * Lon) - 449.5;
    // }
    //  else {
    //     h = -Math.sqrt(303050.25 - 1000 * LonHalf) + 550.5 // 這兩個公式是一樣的，只是對稱而已
    // }
  }
  // 《古代曆法》頁123    沒明白。曲安京《中国古代的二次求根公式与反函数》，西北大学学报(自然科学版). 1997(01)。曆法中二次反函數僅有的例子是大衍行星行度、紀元。赤道度爲Solar/8，黃道度就是43.1287。兩篇公式不一樣，最後畫圖才想明白。我把其他幾個曆法補出來了
  Eclp2EquaDif = Math.abs(Lon - h);
  const sign1 =
    LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? -1 : 1;
  const sign2 =
    LonRaw < Solar25 || (LonRaw >= Solar50 && LonRaw < Solar75) ? 1 : -1;
  Equa2EclpDif *= sign1;
  Eclp2EquaDif *= sign2;
  Equa2Eclp = LonRaw + Equa2EclpDif;
  Eclp2Equa = LonRaw + Eclp2EquaDif;
  return { Equa2Eclp, Equa2EclpDif, Eclp2Equa, Eclp2EquaDif };
};

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