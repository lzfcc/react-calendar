import { add, chain, divide, matrix, multiply, subtract } from "mathjs";
import {
  D2R,
  R2D,
  H2R,
  sqr,
  sind,
  cosd,
  tand,
  cotd,
  asind,
  acosd,
  deci,
  cDay,
  pi2,
  fmod,
  R2H,
  S2R,
} from "../parameter/functions.mjs";
import { FlatLon2FlatLat, HighLon2FlatLat, LonFlat2High } from "./pos_convert.mjs";
import { deltaT, deltaTError } from "../time/delta-t.mjs";
import { nutation, obliqAvg } from "../modern/nutation.mjs";
import { jd2Date } from "../time/jd2date.mjs";
import { deci2hms } from "../time/decimal2clock.mjs";
import { calPos_vsop } from "../newmoon/newm_vsop.mjs";

// 以下分別為R1 R2 R3 ，分別爲x, y, z軸旋轉矩陣。輸入弧度
export const rr1 = (a) =>
  matrix([
    [1, 0, 0],
    [0, Math.cos(a), Math.sin(a)],
    [0, -Math.sin(a), Math.cos(a)],
  ]);
export const rr2 = (b) =>
  matrix([
    [Math.cos(b), 0, -Math.sin(b)],
    [0, 1, 0],
    [Math.sin(b), 0, Math.cos(b)],
  ]);
export const rr3 = (g) =>
  matrix([
    [Math.cos(g), Math.sin(g), 0],
    [-Math.sin(g), Math.cos(g), 0],
    [0, 0, 1],
  ]);

// 參考架偏差矩陣 frame bias matrix
export const Fbmx = matrix([
  [0.99999999999999425, -7.078279744e-8, 8.05614894e-8],
  [7.078279478e-8, 0.99999999999999695, 3.306041454e-8],
  [-8.056149173e-8, -3.306040884e-8, 0.999999999999996208],
]);

export const xyz2lonlat = (X) => {
  // X = X.flat(Infinity)
  const Lon = Math.atan2(X[1], X[0]);
  // const Lat = Math.asin(X[2])
  //   const Lat = Math.atan2(X[2], sqr(X[0] ** 2 + X[1] ** 2));
  const Lat = Math.asin(X[2] / Math.hypot(...X)); // ⚠️兩者等效
  return { Lon, Lat };
};
// console.log(xyz2lonlat([3, 4, 0.1]));
/**
 * 位置矢量
 * @param {*} Lon ⚠️角度deg
 * @param {*} Lat ⚠️角度deg
 * @returns
 */
const lonlat2xyz = (Lon, Lat, D) => [
  (D || 1) * Math.cos(Lat) * Math.cos(Lon),
  (D || 1) * Math.cos(Lat) * Math.sin(Lon),
  (D || 1) * Math.sin(Lat),
];
// 求徑向速度
export const radialV = (X, V) => {
  const R = Math.hypot(...X);
  const Vr = (V[0] * X[0] + V[1] * X[1] + V[2] * X[2]) / R;
  return Vr;
};
// 光行時修正retarded time推遲時。t - |X(tr)-XE(t)| / c 然後迭代算出。近似公式t - |X(t)-XE(t)|
export const lightTimeCorr = (t0, X) => t0 - Math.hypot(...X) / cDay;

// 光行差 見廖育棟文檔
// n′ = γ−1n + β + (n·β)β / (1 + γ−1)
//      / (1 + β·n)
export const lightAber = (X, V) => {
  const Xmod = Math.hypot(...X);
  const v = Math.hypot(...V);
  const n = divide(X, Xmod); // 單位向量
  const Vverse = multiply(V, -1);
  const Beta = divide(Vverse, cDay);
  const g1 = sqr(1 - (v / cDay) ** 2);
  const tmp1 = add(multiply(g1, n), Beta);
  const tmp2 = chain(n)
    .multiply(Beta)
    .multiply(Beta)
    .divide(1 + g1)
    .done();
  const tmp3 = add(1, multiply(Beta, n));
  const n1 = divide(add(tmp1, tmp2), tmp3);
  // 近似公式：相差很小
  // const tmp4 = add(n, Beta)
  // const tmp5 = Math.hypot(...add(n, Beta))
  // const n1a = divide(tmp4, tmp5)
  return multiply(n1, Xmod);
};

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
export const equa2Ceclp = (Sobliq, EquaLon, EquaLat) => {
  return {
    CeclpLon: LonFlat2High(Sobliq, EquaLon),
    CeclpLat: EquaLat - FlatLon2FlatLat(Sobliq, EquaLon),
  };
};
/**
 * 黃道經緯轉古代極黃經緯
 * @param {*} Sobliq
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 */
export const eclp2Ceclp = (Sobliq, Lon, Lat) => {
  const { EquaLon, EquaLat } = eclp2Equa_Mx(Sobliq, Lon, Lat);
  const { CeclpLon, CeclpLat } = equa2Ceclp(Sobliq, EquaLon, EquaLat);
  return { CeclpLon, CeclpLat, EquaLon, EquaLat };
};
// console.log(eclp2Ceclp(23.5, 10, 10))
export const testEclpEclpDif = (Sobliq, Lat) => {
  // 看極黃經和黃經差多少
  const Dif = [];
  for (let i = 0; i < 180; i++) {
    Dif[i] = (eclp2Ceclp(Sobliq, i, Lat).CeclpLon - i) % 360;
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
/**
 * // https://zh.wikipedia.org/zh-hk/%E6%97%A5%E5%87%BA%E6%96%B9%E7%A8%8B%E5%BC%8F
// cosw=-tanftand 。f緯度，d赤緯 w日出時角
// =sina-sinfsind/cosfcosd 是考慮了視直徑、蒙氣差之後的。維基：a=.83
 * @param {*} l 黃經
 * @param {*} f 地理緯度
 * @param {*} Sobliq 黃赤交角
 * @returns 日出時刻
 */
export const sunRise = (Sobliq, f, l) => {
  const d = HighLon2FlatLat(Sobliq, l); // 赤緯
  const w0 = acosd(-tand(f) * tand(d));
  const t0 = ((180 - w0) / 360) * 100; // 未修正
  const w = acosd((sind(-0.77) - sind(f) * sind(d)) / (cosd(f) * cosd(d)));
  const t = ((180 - w) / 360) * 100; // 考慮蒙气差、視半徑
  return { t0, t };
};
// console.log(sunRise(23.44, 39, 1))
// console.log(sunRiseQing(23.44, 39, 1))

// 廖育棟文檔8
// Positions of celestial objects measured from Earth’s surface are called the topocentric position.
// The difference between the geocentric and topocentric position is called the diurnal parallax or geocentric parallax.
// X′=X−XL，XL=[(aC+h)cosφcosts, (aC+h)cosφsints, (aS+h)sinφ], where ts is the local apparent sidereal time LAST
/**
 *
 * @param {*} X 地心座標
 * @param {*} Jd TT儒略日
 * @param {*} Longitude 地理經度°
 * @param {*} Latitude 地理緯度°
 * @param {*} h 海拔km
 * @return topocentric座標
 */
const topocentric = (X, Jd, Longitude, Latitude, h) => {
  const LASTrad = siderealTime(Jd, Longitude) * H2R;
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
  return { Lon, Lat, LASTrad };
};

// astronomical latitude, astronomical longitude 和geodetic latitude and longitude有幾秒的區別，此處沒有區分。
// altitude a, azimuth A
// α = arg(X′ +iY′) and δ = sin−1(Z′/R′)
// H = ts − α
// cosacosA = sinδcosφ − cosδcosHsinφ
// cosasinA = −cosδsinH
//     sina = sinδsinφ + cosδcosHcosφ
const horizontal = (X, Jd, Longitude, Latitude, h) => {
  const {
    Lon: alpha,
    Lat: delta,
    LASTrad,
  } = topocentric(X, Jd, Longitude, Latitude, h);
  const H = LASTrad - alpha;
  const f = Latitude * D2R;
  const s1 = Math.sin(delta);
  const s2 = Math.sin(f);
  const s3 = Math.sin(H);
  const c1 = Math.cos(delta);
  const c2 = Math.cos(f);
  const c3 = Math.cos(H);
  const x = s1 * c2 - c1 * c3 * s2;
  const y = -c1 * s3;
  const z = s1 * s2 + c1 * c3 * c2;
  const { Lon, Lat } = xyz2lonlat([x, y, z]);
  return { Lon, Lat };
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
 * @param {*} Sobliq 黃赤交角
 * @param {*} f 地理緯度
 * @param {*} l 黃經
 * @returns dial length= h tand(zenith height)
 */
export const Lon2DialWest = (Sobliq, f, l) => {
  const d = HighLon2FlatLat(Sobliq, l); // 赤緯
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

// 廖育棟 Calculations in Star Charts
// Sidereal time is defined as the hour angle of the vernal equinox. α⊙ is Sun’s right ascension. ∆ψ is the nutation in longitude given by equation(30), εA is the mean obliquity of the ecliptic given by equation(28), and λ is observer’s(east) longitude.
// 平恆星時（平春分點的時角）與視恆星時（真春分點的時角）之差：Ee, equation of the equinoxes. 平春分點：只算了歲差，真春分點：算了歲差和章動。
// 用 CIO取代春分點的地位，TIO取代Greenwich子午線， Earth Rotation Angle (ERA) 取代恆星時。ERA需要實測。
// ERA(Dᴜ)=θ(Dᴜ) = 2π(0.7790572732640 + 1.00273781191135448Dᴜ)，其中Dᴜ=julian UT1 date -2451545
// GAST=GMST+Ee,GMST=θ-Eprec。Eprec(T)累積歲差=−0′′.014506−4612′′.16534T−1′′.3915817T^2+4′′.4×10−7T^3+2′′.9956×10−5T^4。T：J2000儒略世紀。根據圖像，-200<T<200
// Ee =∆ψcosεA

// A sidereal day is approximately 86164.0905 seconds (23 h 56 min 4.0905s)
/**
 * 視恆星時LAST。但要注意，這個公式只是近似，有效期是前後幾百年，再遠一些誤差就很大了。
 * @param {*} Jd TT儒略日
 * @param {*} Longitude 地理經度°
 */
export const siderealTime = (Jd, Longitude) => {
  const T = (Jd - 2451545) / 365250; // TT儒略世紀
  const Jd2000_UT1 = Jd - deltaT(Jd) - 2451545;
  const Eprec =
    (-0.014506 -
      4612.16534 * T -
      1.3915817 * T ** 2 +
      4.4e-7 * T ** 3 +
      2.9956e-5 * T ** 4) *
    S2R;
  const DeltaPsi = nutation(T).NutaEclp;
  const EpsAvg = obliqAvg(T) * S2R;
  const Ee = DeltaPsi * Math.cos(EpsAvg);
  const Theta = pi2 * (0.779057273264 + 1.00273781191135448 * Jd2000_UT1);
  const GAST = Theta - Eprec + Ee;
  return fmod(GAST * R2H + Longitude / 15, 24);
};
// console.log(siderealTime(2051555.2, 120))
// 真太陽時 t⊙ =12h+H⊙，太陽時角H⊙=LAST−α⊙（太陽赤經），正午H⊙=0h, t⊙=12h
// equation of time(EOT) =t⊙ −tm, tm = UT1 + λ
// EOT is independent of the observer’s location if the geocentric right ascension is used for α⊙
/**
 * 真太陽時
 * @param {*} Jd TT
 * @param {*} Longitude 地理經度
 */
const solarTime = (Jd, Longitude) => {
  Longitude = Longitude || 0;
  const LAST = siderealTime(Jd, Longitude);
  const { EquaLon } = calPos_vsop("Sun", Jd);
  let H = LAST - EquaLon * R2H;
  H = H < -12 ? H + 24 : H;
  return {
    LAST,
    LASolar: (12 + H) % 24,
  };
};
// console.log(solarTime(2432224, 0))
/**
 * 求時差（視太陽時平太陽時之差）
 * @param {*} Jd_UT1 UT1
 * @param {*} Longitude
 * @returns in hour
 */
export const eot = (Jd_UT1, Longitude) => {
  Jd_UT1 = +Jd_UT1;
  Longitude = +Longitude || 0;
  const DeltaT = deltaT(Jd_UT1);
  const Jd = Jd_UT1 + DeltaT; // TT
  const { LAST, LASolar } = solarTime(Jd, Longitude);
  const LMSolar = (12 + deci(Jd_UT1) * 24 + Longitude / 15) % 24;
  let EOT = LASolar - LMSolar;
  if (EOT > 23) EOT -= 24;
  else if (EOT < -23) EOT += 24;
  return { LAST, EOT, LASolar, LMSolar, Jd, DeltaT };
};
export const eotPrint = (Jd_UT1, Longitude) => {
  const { LAST, EOT, LASolar, LMSolar, Jd, DeltaT } = eot(Jd_UT1, Longitude);
  const DeltaTErr = deltaTError(jd2Date(Jd).year);
  return {
    LASTPrint: deci2hms(LAST / 24).hms,
    LASolarPrint: deci2hms(LASolar / 24).hms,
    LMSolarPrint: deci2hms(LMSolar / 24).hmsms,
    DeltaT: Math.trunc(DeltaT * 86400),
    DeltaTErr,
    Jd: Jd.toFixed(6),
    TThms: deci2hms(Jd - Math.round(Jd) + 0.5 + Longitude / 360).hmsms,
    EOTPrint: (EOT > 0 ? "+" : "-") + deci2hms(EOT / 24).hms,
  };
};
// console.log(eot(2457754.5, 0))
// const eprec = T => (-0.014506 - 4612.16534 * T - 1.3915817 * T ** 2 + 4.4e-7 * T ** 3 + 2.9956e-5 * T ** 4)
// console.log(eprec(-10))
