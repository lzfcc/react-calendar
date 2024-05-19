import { R2D, acosd, asind, cosd, pi, sind } from "../parameter/functions.mjs";
import {
  Gong2Lon,
  GongFlat2High,
  GongHigh2Flat,
  HighLon2FlatLat
} from "../astronomy/pos_convert.mjs";

const RoundL2HWest = (r, l) => r * (1 - cosd(l)); // 輸入半弧，輸出矢
const RoundH2LWest = (r, h) => acosd((r - h) / r); // 輸入矢，輸出半弧
const RoundL2CWest = (r, l) => r * sind(l); // 輸入半弧，輸出半弦
const RoundC2LWest = (r, c) => asind(c / r); // 輸入半弦，輸出半弧  // 圓心角l=arcsin(sqrt(2rh-h^2)/r)

// 會圓術矢 --> 弧、弦
const RoundH2LC = (h) => {
  // 弓弦長 2* sqrt (r^2-(r-h)^2) //半徑，矢長
  const r = 60.875;
  const Halfc = Math.sqrt(h * (2 * r - h));
  const c = Halfc * 2;
  const l = h ** 2 / r + c;
  return { Halfc, c, l };
};

export const RoundH2LCPrint = (h) => {
  h = +h;
  const Sidereal = 365.25;
  const r = 60.875; // 會圓術系數3，不是pi
  const Portion2 = pi / 3;
  const Portion4 = Sidereal / 360;
  const { l } = RoundH2LC(h);
  const c = Math.sqrt(h * (2 * r - h)) * 2;
  const rReal = Sidereal / pi / 2; // 365.25、60.875對應的直徑：116.26268592862955
  const hReal = h / Portion2;
  let cWest = Math.sqrt(hReal * (2 * rReal - hReal));
  const lWest = RoundC2LWest(rReal / Portion4, cWest / Portion4) * Portion4 * 2;
  cWest *= 2;
  let Print = [
    {
      title: "會圓術",
      data: [
        l.toFixed(6),
        (l - lWest).toFixed(4),
        c.toFixed(6),
        (c - cWest).toFixed(4)
      ]
    }
  ];
  Print = Print.concat({
    title: "三角函數",
    data: [lWest.toFixed(6), 0, cWest.toFixed(6), 0]
  });
  return Print;
};
// console.log(RoundH2LCPrint(60.875, 60.875, 365.25))

/**
 * 弦 --> 弧、矢
 * @param {*} c
 * @returns
 */
const RoundC2LH = (c) => {
  // c 半弦長
  const r = 60.875;
  const h = r - Math.sqrt(r ** 2 - c ** 2);
  const l = 2 * c + h ** 2 / r;
  const Halfl = l / 2;
  return { h, l, Halfl };
};

export const RoundC2LHPrint = (cRaw) => {
  cRaw = +cRaw;
  const c = cRaw / 2;
  if (cRaw > 121.75) {
    throw new Error("c <= 121.75");
  }
  const Sidereal = 365.25;
  const r = 60.875;
  const Portion2 = pi / 3;
  const Portion4 = Sidereal / 360;
  const { l, h } = RoundC2LH(c);
  const rReal = Sidereal / pi / 2;
  const cReal = c / Portion2;
  let lWest = RoundC2LWest(rReal / Portion4, c / Portion4) * Portion4;
  const hWest =
    rReal / Portion4 - Math.sqrt((rReal / Portion4) ** 2 - cReal ** 2); // / Portion2
  lWest *= 2;
  let Print = [
    {
      title: "會圓術",
      data: [
        l.toFixed(6),
        (l - lWest).toFixed(4),
        h.toFixed(6),
        (h - hWest).toFixed(4)
      ]
    }
  ];
  Print = Print.concat({
    title: "三角函數",
    data: [lWest.toFixed(6), 0, hWest.toFixed(6), 0]
  });
  return Print;
};
// console.log(RoundC2LHPrint(10))

/**
 * 會圓術 半弧長 --> 矢長
 * @param {*} l
 * @returns
 */
export const RoundL2H = (l) => {
  const r = 60.875;
  const d = 121.75;
  const equation = (x) =>
    x ** 4 / d ** 2 + (1 - (2 * l) / d) * x ** 2 - d * x + l ** 2;
  let mid = 0;
  let lower = 0;
  let upper = r;
  while (upper - lower > 1e-10) {
    mid = (lower + upper) / 2;
    if (equation(mid) * equation(lower) < 0) {
      upper = mid;
    } else {
      lower = mid;
    }
  }
  return upper; // 矢長
};

export const RoundL2HPrint = (lRaw) => {
  lRaw = +lRaw;
  const l = lRaw / 2;
  const Sidereal = 365.25;
  const r = 60.875; // 會圓術系數3，不是pi
  let h = RoundL2H(l);
  if (lRaw === 0) {
    h = 0;
  }
  const c = lRaw - h ** 2 / r;
  const Portion2 = pi / 3;
  const Portion4 = Sidereal / 360;
  const rReal = Sidereal / pi / 2;
  // const lReal=
  let hWest = RoundL2HWest(rReal / Portion4, l / Portion4);
  hWest *= Portion2;
  const cWest = (RoundH2LC(hWest).c / Portion2) * Portion4;
  hWest *= Portion4;
  let Print = [
    {
      title: "會圓術",
      data: [
        h.toFixed(6),
        (h - hWest).toFixed(4),
        c.toFixed(6),
        (c - cWest).toFixed(4)
      ]
    }
  ];
  Print = Print.concat({
    title: "三角函數",
    data: [hWest.toFixed(6), 0, cWest.toFixed(6), 0]
  });
  return Print;
};
// console.log(RoundL2HPrint(182.625, 60.875, 365.25))
const Hushigeyuan_Sub = (LonRaw, p, q, pAnother) => {
  const Sidereal = 365.25;
  const r = 60.875;
  const d = 121.75;
  pAnother = pAnother || p;
  const SiderealQuar = Sidereal / 4;
  const SiderealHalf = Sidereal / 2;
  const SiderealQuar3 = Sidereal * 0.75;
  let Lon = LonRaw % SiderealQuar;
  if (
    (LonRaw > SiderealQuar && LonRaw <= SiderealHalf) ||
    (LonRaw >= SiderealQuar3 && LonRaw < Sidereal)
  ) {
    Lon = SiderealQuar - Lon;
  }
  const v1 = RoundL2H(Lon); // LD黃道矢度
  const OL = r - v1; // 黃赤小弦
  const p1 = Math.sqrt(r ** 2 - OL ** 2); // LB黃半弧弦
  const p2 = (p * OL) / r; // BN,LM
  const p2Another = (pAnother * OL) / r; // BN黃赤小弧弦、黃赤內外半弧弦
  const p3 = (p1 * r) / Math.sqrt(r ** 2 - p2 ** 2); // PC赤半弧弦
  const v3 = r - Math.sqrt(r ** 2 - p3 ** 2); // PE赤橫弧矢
  let Eclp2EquaDif = (p3 + v3 ** 2 / d - Lon) % 91.3125; // 赤經。輸入0的話會冒出一個91.3125
  /// // 黃轉赤的赤緯
  const OM = (OL * q) / r; // 黃赤小股
  const ON = Math.sqrt(p1 ** 2 + OM ** 2); // 赤小弦// const ON = Math.sqrt(r ** 2 - p2 ** 2) //v2
  let Lat = p2Another + (r - ON) ** 2 / d; // r - ON ： 赤二弦差、黃赤內外矢 //NC ** 2 / d： 半背弦差
  let sign = 1;
  if (LonRaw < SiderealQuar || LonRaw > SiderealQuar3) {
    Lat = -Lat;
    sign = -1;
  }
  /// //赤轉黃/////
  const PE = RoundL2H(Lon);
  const OP = r - PE;
  const PC = Math.sqrt(r ** 2 - OP ** 2);
  const CT = (p * OP) / q; // PQ=CT，T是C向上垂直，超出了球體。Q是P垂直向上，交OD
  const OT = Math.sqrt(r ** 2 + CT ** 2); // OT=r+BT
  const BN = (CT * r) / OT;
  const PQ = (p * OP) / q;
  const BL = (PC * BN) / PQ;
  const BD = RoundC2LH(BL).Halfl;
  let Equa2EclpDif = Lon - BD;
  const condition =
    (LonRaw >= 0 && LonRaw < SiderealQuar) ||
    (LonRaw >= SiderealHalf && LonRaw < SiderealQuar3);
  Eclp2EquaDif *= condition ? 1 : -1;
  Equa2EclpDif *= condition ? -1 : 1;
  const Eclp2Equa = LonRaw + Eclp2EquaDif;
  const Equa2Eclp = LonRaw + Equa2EclpDif;
  return {
    Eclp2EquaDif,
    Equa2EclpDif,
    Eclp2Equa,
    Equa2Eclp,
    Lat,
    ON,
    p2Another,
    sign
  };
};
// 弧矢割圓術黃赤轉換。跟元志六《黃赤道率》立成表分毫不差，耶！！！
export const Hushigeyuan = (LonRaw, Name) => {
  Name = Name || "Shoushi";
  // 變量名見《中國古代曆法》頁629。將術文與球面三角對比誤差應該用23.807。
  // 北京赤道出地度50.365，緯度40.9475，40.949375。《大統法原勾股測望》：半弧背s26.465。矢v 5.915
  LonRaw += 1e-12;
  const p = 23.807; // DK 實測23.9半弧背、黃赤大勾
  const pAnother = 23.71; // 二至黃赤內外半弧弦
  const q = 56.0268; // OK
  // const v = 4.8482 // KE
  const {
    Eclp2EquaDif,
    Equa2EclpDif,
    Eclp2Equa,
    Equa2Eclp,
    Lat,
    ON,
    p2Another,
    sign
  } = Hushigeyuan_Sub(LonRaw, p, q, pAnother);
  // const Lat1 = 91.3125 - Lat // 91.314375
  /// ///////晷漏////////
  // const v2 = LatFunc.h
  const SunHundred = 6 * ON + 1; // 日行百刻度
  const Banhubei =
    (p2Another * (["Datong", "Datong2"].includes(Name) ? 14.5554 : 19.9614)) /
    pAnother; // 19.9614：二至出入差半弧背 // 根據大統晨昏立成，14.5554與冬至初日相合
  const Rise = 25 - (sign * Banhubei * 100) / SunHundred; // 半夜漏。似乎授時的夜漏包含了晨昏
  //  const Duskstar = (50 - (NightTime - 2.5)) * Sidereal / 100 + 正午赤度
  return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat, Rise };
};

const Hushigeyuan_Ex = (LonRaw, e) => {
  // 度數，黃赤交角。與上面的術文相比可拓展至任意黃赤交角的弧矢割圓。術文的數據由24（考慮捨入誤差24.00003）算得。
  const r = 60.875;
  const h = RoundL2H(e);
  const p = Math.sqrt(r ** 2 - (r - h) ** 2);
  const q = r - h;
  const { Eclp2EquaDif, Equa2EclpDif, Eclp2Equa, Equa2Eclp, Lat } =
    Hushigeyuan_Sub(LonRaw, p, q);
  return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat };
};
// console.log(Hushigeyuan(0.00001))
// console.log(Hushigeyuan_Ex(0.00001, 23.9)) // 弧矢割圓的黃赤交角以24度算

const HushigeyuanWest = (LonRaw, Sidereal, DE) => {
  // DE黃赤交角。變量名見《中國古代曆法》頁629
  const SiderealQuar = Sidereal / 4;
  const SiderealHalf = Sidereal / 2;
  const SiderealQuar3 = Sidereal * 0.75;
  let Lon = LonRaw % SiderealQuar;
  if (
    (LonRaw > SiderealQuar && LonRaw <= SiderealHalf) ||
    (LonRaw >= SiderealQuar3 && LonRaw < Sidereal)
  ) {
    Lon = SiderealQuar - Lon;
  }
  /// /轉換爲360度////
  const Portion4 = Sidereal / 360;
  Lon /= Portion4;
  const r = R2D;
  const p = RoundL2CWest(r, DE); // DK
  const v = RoundL2HWest(r, DE); // KE
  const q = r - v; // OK
  const v1 = RoundL2HWest(r, Lon); // LD
  const OL = r - v1;
  const p1 = Math.sqrt(r ** 2 - OL ** 2); // LB黃半弧弦
  const p2 = (p * OL) / r; // BN,LM
  const p3 = (p1 * r) / Math.sqrt(r ** 2 - p2 ** 2); // PC赤半弧弦
  // const v3 = r - Math.sqrt(r ** 2 - p3 ** 2) // PE赤橫弧矢
  // const EquaLon = RoundH2LWest(r, v3) // 這兩個結果完全一樣
  const EquaLon = RoundC2LWest(r, p3);
  /// // 黃轉赤的赤緯
  // const OM = OL * q / r // 黃赤小股
  // const NC = r - Math.sqrt(p1 ** 2 + OM ** 2)
  // let Lat = RoundH2LWest(r, NC)
  let Lat = RoundC2LWest(r, p2);
  if (LonRaw < SiderealQuar || LonRaw > SiderealQuar3) Lat = -Lat;
  /// //赤轉黃/////
  const PE = RoundL2HWest(r, Lon);
  const OP = r - PE;
  const PC = Math.sqrt(r ** 2 - OP ** 2);
  const CT = (p * OP) / q; // PQ=CT，T是C向上垂直，超出了球體。Q是P垂直向上，交OD
  const OT = Math.sqrt(r ** 2 + CT ** 2); // OT=r+BT
  const BN = (CT * r) / OT;
  const PQ = (p * OP) / q;
  const BL = (PC * BN) / PQ;
  const BD = RoundC2LWest(r, BL);
  /// ///轉換爲365.25度//////
  let Eclp2EquaDif = (EquaLon - Lon) * Portion4;
  let Equa2EclpDif = (Lon - BD) * Portion4;
  Lat *= Portion4;
  const condition =
    (LonRaw >= 0 && LonRaw < SiderealQuar) ||
    (LonRaw >= SiderealHalf && LonRaw < SiderealQuar3);
  Eclp2EquaDif *= condition ? 1 : -1;
  Equa2EclpDif *= condition ? -1 : 1;
  const Eclp2Equa = LonRaw + Eclp2EquaDif;
  const Equa2Eclp = LonRaw + Equa2EclpDif;
  return { Eclp2Equa, Eclp2EquaDif, Equa2Eclp, Equa2EclpDif, Lat };
};
// console.log(HushigeyuanWest(32, 365.25, 1000).Eclp2Equa)

export const Hushigeyuan_Ex_Print = (GongRaw, e) => {
  e = +e;
  GongRaw = +GongRaw;
  const p = 360 / 365.25;
  const Gong = GongRaw * p;
  let WestA = GongHigh2Flat(e, Gong);
  let WestB = GongFlat2High(e, Gong);
  const WestA1 = (WestA - Gong) / p;
  const WestB1 = (WestB - Gong) / p;
  const WestLat = HighLon2FlatLat(e, Gong2Lon(Gong)) / p;
  WestA /= p;
  WestB /= p;
  let Print = [
    {
      title: "球面三角",
      data: [
        WestB.toFixed(6),
        WestB1.toFixed(6),
        0,
        WestA.toFixed(6),
        WestA1.toFixed(6),
        0,
        WestLat.toFixed(6),
        0
      ]
    }
  ];
  const {
    Equa2Eclp: GeyuanB,
    Equa2EclpDif: GeyuanB1,
    Eclp2Equa: GeyuanA,
    Eclp2EquaDif: GeyuanA1,
    Lat: GeyuanLat
  } = Hushigeyuan_Ex(GongRaw, e);
  Print = Print.concat({
    title: "弧矢割圓",
    data: [
      GeyuanB.toFixed(6),
      GeyuanB1.toFixed(6),
      Math.trunc(((GeyuanB - WestB) / WestB) * 10000),
      GeyuanA.toFixed(6),
      GeyuanA1.toFixed(6),
      Math.trunc(((GeyuanA - WestA) / WestA) * 10000),
      GeyuanLat.toFixed(6),
      Math.trunc(((GeyuanLat - WestLat) / WestLat) * 10000)
    ]
  });
  return Print;
};

// 南宋秦九韶的《数书九章》（Mathematical Treatise in Nine Sections）中的三斜求积术：以小斜幂，并大斜幂，减中斜幂，余半之，自乘于上；以小斜幂乘大斜幂，减上，余四约之，为实；一为从隅，开平方得积。秦九韶他把三角形的三条边分别称为小斜、中斜和大斜。“术”即方法。三斜求积术就是用小斜平方加上大斜平方，减中斜平方，取余数的一半的平方，而得一个数。小斜平方乘以大斜平方，减上面所得到的那个数。相减后余数被4除,开平方后即得面积。化下简就会发现这就是传说中的已知三边求三角形面积的海伦公式。
// 海伦公式 sqrt(p (p-a) (p-b) (p-c)), p=(a+b+c)/2
// 三斜求积术 sqrt( ((c^2 a^2)-((c^2+a^2-b^2 )/2)^2)/4 )
