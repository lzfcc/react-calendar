import { multiply, subtract } from "mathjs";
import {
  D2R,
  R2D,
  H2R,
  sind,
  cosd,
  tand,
  cotd,
  asind,
  acosd,
  atand,
  atan2d,
} from "../parameter/functions.mjs";
import { FlatLon2FlatLat, HighLon2FlatLat, Lon2Gong, LonFlat2High, LonHigh2Flat } from "./pos_convert.mjs";
import { siderealTime } from "../time/sidereal_time.mjs";
import { lonlat2xyz, rr1, xyz2lonlat } from "./pos_functions.mjs";
import { modernConsts } from "./astr_const.mjs";

const eclp2Equa_Mx = (Sobliq, Lon, Lat) => {
  const Ieclp = lonlat2xyz(Lon * D2R, Lat * D2R);
  const Iequa = multiply(rr1(D2R * -Sobliq), Ieclp).toArray();
  const { Lon: EquaLon, Lat: EquaLat } = xyz2lonlat(Iequa);
  return { EquaLon: (EquaLon * R2D + 360) % 360, EquaLat: EquaLat * R2D };
};
export const equa2Eclp = (Sobliq, EquaLon, EquaLat) => {
  const Iequa = lonlat2xyz(EquaLon * D2R, EquaLat * D2R);
  const Ieclp = multiply(rr1(D2R * Sobliq), Iequa).toArray();
  const { Lon, Lat } = xyz2lonlat(Ieclp);
  return { Lon: (Lon * R2D + 360) % 360, Lat: Lat * R2D };
};
// console.log(eclp2Equa(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60))
// console.log(eclp2Equa_Geom(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60))
// 赤道經緯轉古代極黃經緯
export const equa2Cec = (Sobliq, EquaLon, EquaLat) => {
  return {
    CecLon: LonFlat2High(Sobliq, EquaLon),
    CecLat: EquaLat - FlatLon2FlatLat(Sobliq, EquaLon),
  };
};
export const ceclp2Equa = (Sobliq, CecLon, CecLat) => {
  const EquaLon = LonHigh2Flat(Sobliq, CecLon)
  return {
    EquaLon,
    EquaLat: CecLat + FlatLon2FlatLat(Sobliq, EquaLon),
  };
};
/**
 * 黃道經緯轉古代極黃經緯
 * @param {*} Sobliq
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 */
export const eclp2Cec = (Sobliq, Lon, Lat) => {
  const { EquaLon, EquaLat } = eclp2Equa_Mx(Sobliq, Lon, Lat);
  const { CecLon, CecLat } = equa2Cec(Sobliq, EquaLon, EquaLat);
  return { CecLon, CecLat, EquaLon, EquaLat };
};
// console.log(eclp2Cec(23.5, 10, 10))
export const testEclpEclpDif = (Sobliq, Lat) => {
  // 看極黃經和黃經差多少
  const Dif = [];
  for (let i = 0; i < 180; i++) {
    Dif[i] = (eclp2Cec(Sobliq, i, Lat).CecLon - i) % 360;
    if (Dif[i] > 180) Dif[i] -= 360;
    Dif[i] = +Dif[i].toFixed(5);
  }
  const Max = Math.max(...Dif);
  const A = Dif.indexOf(Max);
  const B = Dif.indexOf(-Max);
  const Print = `極黃經與黃經之差，約在${A}和${B}°出現極值${Max}°`;
  return Print;
};
// console.log(testEclpEclpDif(23.5, 20))


/**
 * 見《數理天文學》白道交周
 * @param {*} WhEcLon 黃白交點黃經
 * @param {*} Sobliq 黃赤大距
 * @param {*} Mobliq 黃白大距
 * @returns 白赤交點赤經
 */
const whEcNode2WhEqNode = (WhEcLon, Sobliq, Mobliq) => {
  const WhEcLonRev1 = WhEcLon <= 180 ? 180 - WhEcLon : WhEcLon - 180;// 圖像以秋分對稱，尖峰距秋分較近
  Sobliq = Sobliq || 23.5559844; // 23.9度。1280理論值23.533°
  Mobliq = Mobliq || 5.91363627; // 6度。理論平均值5.1453°
  const tan_WhEqLonMax = tand(Mobliq) / sind(Sobliq); // 正交極數：白赤交點赤經最大值的tan()
  const tan_WhEqLon =
    (tan_WhEqLonMax * sind(WhEcLonRev1)) /
    (1 - tan_WhEqLonMax * cosd(Sobliq) * cosd(WhEcLonRev1));
  const WhEqEquinoxDif = atand(tan_WhEqLon)
  const WhEcGong = Lon2Gong(WhEcLon)
  const WhEcGongHalf = WhEcGong % 180;
  const sign1 = WhEcGongHalf < 90 ? 1 : -1;
  const sign2 = WhEcGong < 180 ? -1 : 1; // 符號照抄授時曆
  return {
    WhEqLonMax: atand(tan_WhEqLonMax),
    // WhEqLon: (sign1 * -sign2 * WhEqEquinoxDif + 360) % 360,
    WhEqLon: WhEqEquinoxDif,
  };
};
// console.log(whEcNode2WhEqNode(190))
/**
 * 求白赤大距
 * @param {*} WhEcLon 黃白交點黃經
 * @param {*} Mobliq 黃白大距
 */
export const whEqObliq = (WhEcLon, Sobliq, Mobliq) => {
  const WhEcLonRev = WhEcLon <= 180 ? WhEcLon : 360 - WhEcLon; // 看圖像，黃經從0-180逐漸降低，那麼180-360應該是逐漸升高
  Mobliq = Mobliq || 5.91363627;
  const { WhEqLon } = whEcNode2WhEqNode(WhEcLon, Sobliq, Mobliq);
  const sin_WhEqObliq =
    (sind(Mobliq) * sind(WhEcLonRev)) / sind(WhEqLon); // 球面三角形BHG正弦定理
  return {
    WhEqLon,
    WhEqObliq: asind(sin_WhEqObliq)
  }
};
// LonHigh2Flat(whEqObliq, MoonWhiteLon) // 白經轉赤經
// HighLon2FlatLat(whEqObliq, MoonWhiteLon) // 白經轉赤緯。MoonWhiteLon：月亮距離白赤正交
// console.log(whEqObliq(150, 23.533, 5.1453))

/**
 * 赤道轉九道
 * @param {*} Jd 
 */
export const lonEqua2Cwh = (Jd, EqauLon) => {
  const { WhEqLon, WhEqObliq } = whEqObliq(modernConsts(Jd).AvgWhEcLon)
  let WhEqDif = 0, CwhLon = 0;
  if (EqauLon) {
    WhEqDif = (EqauLon - WhEqLon + 360) % 360 // 某點距離白赤交點的赤道度
    CwhLon = LonFlat2High(WhEqObliq, WhEqDif) // 距離白赤交點的白道度
  }
  return {
    CwhLon,
    WhEqLon, // 白赤交點赤經
    WhEqObliq
  }
}
// console.log(lonEqua2Cwh(2343222, 199))

/**
 * 一天之内太阳高度角的变化速率如何计算？ - Pjer https://www.zhihu.com/question/25909220/answer/1026387602 一年中太阳直射点在地球上的移动速度是多少？ - 黄诚赟的回答 https://www.zhihu.com/question/335690936/answer/754032487「太阳直射点的纬度变化不是匀速的，春分秋分最大，夏至冬至最小。」
https://zh.wikipedia.org/zh-hk/%E5%A4%AA%E9%99%BD%E4%BD%8D%E7%BD%AE
 * @param {*} v 時角（正午爲0單位°）
 * @param {*} Lat 正午12點赤緯
 * @param {*} f 地理緯度
 * @returns 太陽高度角
 */
const hourA2ElevatA = (v, Lat, f) =>
  +asind(sind(f) * sind(Lat) + cosd(f) * cosd(Lat) * cosd(v)).toFixed(12);
// console.log(hourA2ElevatA(0, 23.5, 23))

// 廖育棟文檔8
// Positions of celestial objects measured from Earth’s surface are called the topocentric position.
// The difference between the geocentric and topocentric position is called the diurnal parallax or geocentric parallax.
// X′=X−XL，XL=[(aC+h)cosφcosts, (aC+h)cosφsints, (aS+h)sinφ], where ts is the local apparent sidereal time LAST
/**
 *
 * @param {*} X 地心座標
 * @param {*} LASTrad 恆星時（弧度）
 * @param {*} Latitude 地理緯度°
 * @param {*} h 海拔km
 * @return topocentric座標
 */
export const topocentric = (X, LASTrad, Latitude, h) => {
  const f = Latitude * D2R;
  h = h || 0.1;
  if (h > 8) throw new Error("altitude in km!");
  const a = 6378.1366;
  const Oblate = 1 / 298.25642; // =(a-b)/a
  const C =
    (Math.cos(f) ** 2 + (1 - Oblate) ** 2 * Math.sin(f) ** 2) ** (-1 / 2);
  const S = (1 - Oblate) ** 2 * C;
  const c1 = Math.cos(f);
  const c2 = Math.cos(LASTrad);
  const s1 = Math.sin(f);
  const s2 = Math.sin(LASTrad);
  const x = (a * C + h) * c1 * c2;
  const y = (a * C + h) * c1 * s2;
  const z = (a * S + h) * s1;
  const XL = [x, y, z];
  const X1 = subtract(X, XL);
  const { Lon, Lat } = xyz2lonlat(X1);
  return { X1, Lon, Lat, LASTrad };
};

// astronomical latitude, astronomical longitude 和geodetic latitude and longitude有幾秒的區別，此處沒有區分。
// altitude a, azimuth A
// α = arg(X′ +iY′) and δ = sin−1(Z′/R′)
// H = ts − α
// cosacosA = sinδcosφ − cosδcosHsinφ
// cosasinA = −cosδsinH
//     sina = sinδsinφ + cosδcosHcosφ
export const horizontal = (X, Jd, Longitude, Latitude, h) => {
  const LASTrad = siderealTime(Jd, Longitude) * H2R;
  const {
    Lon: TopoLon,
    Lat: TopoLat,
    X1
  } = topocentric(X, LASTrad, Latitude, h);
  const H = LASTrad - TopoLon;
  const f = Latitude * D2R;
  const s1 = Math.sin(TopoLat);
  const s2 = Math.sin(f);
  const s3 = Math.sin(H);
  const c1 = Math.cos(TopoLat);
  const c2 = Math.cos(f);
  const c3 = Math.cos(H);
  const x = s1 * c2 - c1 * c3 * s2;
  const y = -c1 * s3;
  const z = s1 * s2 + c1 * c3 * c2;
  const { Lon: HoriLon, Lat: HoriLat } = xyz2lonlat([x, y, z]);
  return { HoriLon, HoriLat, TopoLon, TopoLat, X1, LASTrad };
};

/**
 * Sæmundsson’s formula: https://en.wikipedia.org/wiki/Atmospheric_refraction#cite_note-Saemundsson1986-24
 * @param {*} a 高度
 * @param {*} P 大氣壓kPa
 * @param {*} T 溫度K
 * @returns
 */
const refraction = (a, P, T) =>
  (1.02 / 60) * (P / 101) * (283 / T) * cotd(a + 10.3 / (a + 5.11));

/**
 *
 * @param {*} f 地理緯度
 * @param {*} d （正午？）赤緯
 * @returns dial length= h tand(zenith height)
 */
export const Lon2DialWest = (f, d) => {
  const h = 90 - Math.abs(f - d); // 正午太陽高度
  const z0 = f - d; // 眞天頂距=緯度-赤緯
  const r = 0.52; // 日視直徑0.53度。角半径=atand(1/2 d/D)
  const Refrac = refraction(h, 102, 290); // 蒙气差使太陽升高
  const Parallax = (8.8 / 3600) * sind(z0); // p0太陽地平視差8.8s。視差總是使視位置降低，地平線最大，天頂爲0
  const z = z0 - Refrac + r / 2 + Parallax;
  const Dial = (8 * tand(z)).toFixed(8); // 修正
  const Dial1 = (8 * tand(z0)).toFixed(8); // 未修正
  return { Dial, Dial1 };
};
const Lat = () => {
  // 由《周髀算经》推算观测地 的纬度有三种数据可用，一是夏至日影一尺六寸，二是冬至日影一丈三尺五寸，三是北极 高度一丈三寸。
  let x = 30.1;
  const scale = (x) =>
    Math.tan(D2R * (x - 23.958428)) / Math.tan(D2R * (x + 23.958428)); // 前2300年黃赤交角
  const norm = 1.6 / 13.5;
  const eps = 1e-8;
  while (x < 45) {
    if (scale(x) > norm - eps && scale(x) < norm + eps) {
      return x;
    }
    x += 0.00001;
  }
};
// console.log(Lat()) // 35.17369
