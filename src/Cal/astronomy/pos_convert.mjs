import {
  deci,
  abs,
  sind,
  cosd,
  tand,
  cotd,
  asind,
  acosd,
  atand,
  acotd,
  t1,
  t2,
  t3,
  avsind,
  vsind,
} from "../parameter/functions.mjs";

export const Lon2Gong = (Lon) => (Lon + 90) % 360;
export const Gong2Lon = (Gong) => (Gong + 270) % 360;
export const LonHigh2Flat = (e, X) =>
  Math.trunc(Math.ceil(X / 90) / 2) * 180 + atand(cosd(e) * tand(X)); // 傾角、經度，用於黃轉赤，白轉黃
// export const LonHigh2Flat = (e, X) => Math.trunc(Math.ceil(X / 90) / 2) * 180 + big(R2D).mul(big.atan(big.mul(big.cos(big(D2R).mul(e)), big.tan(big(D2R).mul(X))))).toNumber()
export const GongHigh2Flat = (e, X) => Lon2Gong(LonHigh2Flat(e, Gong2Lon(X)));
export const LonHigh2FlatB = (Lat, X) => acosd(cosd(X) / cosd(Lat)); // 已知黃經赤緯求赤經
// const LonHigh2FlatB = (Lat, X) => big.acos(big.div(big.cos(big(D2R).mul(X)), big.cos(big(D2R).mul(Lat)))).toNumber()
export const LonFlat2High = (e, X) =>
  Math.ceil(Math.ceil(X / 90) / 2) * 180 - 90 - atand(cosd(e) * cotd(X)); // 赤轉黃，黃轉白
// export const LonFlat2High = (e, X) => Math.ceil(Math.ceil(X / 90) / 2) * 180 - 90 - big.atan(big.mul(big.cos(big(D2R).mul(e)), big.cot(big(D2R).mul(X)))).toNumber() // 赤轉黃，黃轉白
// console.log(LonFlat2High(23.4916666666667,73.80638)) // 考成卷八葉37算例
export const GongFlat2High = (e, X) => Lon2Gong(LonFlat2High(e, Gong2Lon(X)));
export const HighLon2FlatLat = (e, X) => asind(sind(e) * sind(X)); // 月距正交轉黃緯
// export const HighLon2FlatLat = (e, X) => big.asin(big.mul(big.sin(bid(D2R).mul(e)), big.sinbig(D2R).mul(X))).toNumber() // 月距正交轉黃緯
export const FlatLon2FlatLat = (e, X) => atand(tand(e) * sind(X)); // 求赤經高弧交角用到這個的變形，求極黃緯也要用這個
// export const FlatLon2FlatLat = (e, X) => big.atan(big.mul(big.tan(big(D2R).mul(e)), big.sinbig(D2R).mul(X))).toNumber() // 求赤經高弧交角用到這個的變形，求極黃緯也要用這個
// const LowLat2HighLon = (e, X) => // 已知太陽赤緯轉黃經
// console.log(LonHigh2Flat(23.5,15))
// console.log(HighLon2FlatLat(23 + 29 / 60,112.28487818))
// console.log(LowLat2HighLon(23 + 29 / 60, 11.49258677))
// OA=40, HAB= 37.00450206, AH=18.74723726, OH=36.00521466, OB=44.09531291,HB=8.09009825, AB=20.36057491. sinHAB=.3973413465. HAB=23.41207808

export const qiexian = (a, b, X) => {
  X = t2(X);
  let long = a;
  let short = b;
  if (b > a) (long = b), (short = a);
  const haAsupple = (180 - X) / 2; // 半外角
  const haAdif = atand(((long - short) / (long + short)) * tand(haAsupple)); // 半較角
  const Ashort = haAsupple - haAdif; // 短邊對角
  const Along = haAsupple + haAdif; // 長邊對角
  return { Ashort, Along };
  // 以下是我的作垂線法
  // const vertical = a * sind(X % 180)
  // const c = sqr(a ** 2 + b ** 2 - 2 * a * b * cosd(180 - abs(180 - X)))
  // return asind(vertical / c)
};
export const qiexianA = (a, b, X) => {
  // 固定返回a邊對角
  X = t2(X);
  let long = a;
  let short = b;
  if (b > a) (long = b), (short = a);
  const haAsupple = (180 - X) / 2; // 半外角
  const haAdif = atand(((long - short) / (long + short)) * tand(haAsupple)); // 半較角
  const Ashort = haAsupple - haAdif; // 短邊對角
  const Along = haAsupple + haAdif; // 長邊對角
  let result = Along;
  if (a < b) result = Ashort;
  return result;
};

// console.log(qiexianA(.0338, 2, 60))
export const aCtimeb_Sph = (a, b, AngCTime) => {
  const AngC = abs(0.5 - deci(AngCTime)) * 360; // 用時太陽距午赤道度
  const b1 = LonHigh2Flat(AngC, a); // 距極分邊
  const b2 = b - b1; // 自天頂作垂線，得距極分邊，再與太陽距極相加減，得距日分邊。距午度<90度，垂線在三角形內，相減，>90相加。
  const tanH = tand(AngC) * sind(b1); // 垂弧之正切
  const AngA =
    ((deci(AngCTime) < 0.5 ? 1 : -1) * (atand(tanH / sind(b2)) + 180)) % 180; // 用時赤經高弧交角。若距極分邊轉大於太陽距北極，則所得爲外角，與半周相減。午前赤經在高弧東，午後赤經在高弧西。
  // const c = asind(sind(AngC) * sina / sind(abs(AngA))) // 用時太陽距天頂
  const c = LonFlat2High(AngA, b2); // 我的等效算法。經實驗，如果三角函數取小數點後8位，20.12486241，本來是20.1248526178365
  return { AngA, c };
};
// 球面三角已知兩角夾邊求另一角cosA=－cosBcosC+sinBsinCcosa
export const BaC_Sph = (B, C, a) =>
  acosd(sind(B) * sind(C) * cosd(a) - cosd(B) * cosd(C));
// console.log(BaC_Sph(90, 83.61729023292902, 72.7386111111)) // 72.84893171874154
// console.log(BaC_Sph(72.8488888889,90,LonHigh2Flat(72.8488888889, 90 - abs(62.06444444444)))) //19.255410907734177
// 斜弧三角形已知兩邊和夾角求另一邊
export const aCb_Sph = (a, b, C) => {
  // 納白爾公式 https://wenku.baidu.com/view/145cd0f4b84cf7ec4afe04a1b0717fd5360cb2f1.html
  // const tanAPlBDiv2 = cosd((a - b) / 2) / cosd((a + b) / 2) * cotd(C / 2)
  // const tanAMiBDiv2 = sind((a - b) / 2) / sind((a + b) / 2) * cotd(C / 2)
  // const tancdiv2 = cosd(atand(tanAPlBDiv2)) / cosd(atand(tanAMiBDiv2)) * tand((a + b) / 2)
  // return atand(tancdiv2) * 2
  const tanAPlBDiv2 = (cosd((a - b) / 2) / cosd((a + b) / 2)) * cotd(C / 2);
  const tanAMiBDiv2 = (sind((a - b) / 2) / sind((a + b) / 2)) * cotd(C / 2);
  const tancdiv2 =
    (cosd(atand(tanAPlBDiv2)) / cosd(atand(tanAMiBDiv2))) * tand((a + b) / 2);
  return atand(tancdiv2) * 2;
};

// 已知三個角一邊求b邊。sinAcosb=cosBsinC+sinBcosCcosa
export const ABCa_Sph = (A, B, C, a) =>
  acosd((cosd(B) * sind(C) + sind(B) * cosd(C) * cosd(a)) / sind(A));
// console.log(ABCa_Sph(72.8488888889,90,83.61729023292902,72.7386111111))// 88度1分18秒=88.02166666667

// 斜弧三角形已知三邊求a所對角。上編卷三總較法
export const abc_Sph = (a, b, c) => {
  const sum = b + c;
  const dif = abs(b - c);
  let mid = 0;
  if ((t2(sum) < 90 && t2(dif) < 90) || (t2(sum) > 90 && t2(dif) > 90)) {
    mid = abs(abs(cosd(sum)) - abs(cosd(dif)));
  } else mid = abs(cosd(sum)) + abs(cosd(dif));
  mid /= 2;
  const vsinDif = abs(vsind(a) - vsind(dif));
  return avsind(vsinDif / mid);
};

// 《后编》蒙氣差
const refractionGuimao = (h) => {
  const a = tand(90 - h) ** 2 + 1;
  const delta = 4 + 4 * a * 2.0006095 * 0.0006095;
  const X = (-2 + Math.sqrt(delta)) / (2 * a); // 根據公式1 ，一元二次方程求根公式
  const ang1 = asind((1 + X) / 1.0006095) - h;
  const ang2 = asind(sind(ang1) * 1.0002841);
  return ang2 - ang1;
};
// console.log(atmos(20)) // .04453873130688635

// https://zhuanlan.zhihu.com/p/265334815 清代日出公式推導
const sunRiseQing = (RiseLat, Lon, d) =>
  0.25 + (Lon < 180 ? -1 : 1) * (asind(tand(abs(d) * tand(RiseLat))) / 360); // 日出時刻。這個經度應該是正午的經度??
export const moonRiseQing = (RiseLat, MEquaLon, MEquaLat, SEquaLon) => {
  const MSDif = (MEquaLon - SEquaLon + 360) % 360;
  const Dif =
    (MEquaLon < 180 ? -1 : 1) * asind(tand(abs(MEquaLat) * tand(RiseLat))); // 出地在卯正前後赤道度。太陰在赤道南，出在卯正後。前減後加
  const RiseTmp = 0.25 + (MSDif + Dif) / 360;
  const SetTmp = 0.75 + (MSDif - Dif) / 360;
  return {
    MoonRise: deci(RiseTmp + (12 * RiseTmp) / 360),
    MoonSet: deci(SetTmp + (12 * SetTmp) / 360),
  };
};

/**
 * // https://zh.wikipedia.org/zh-hk/%E6%97%A5%E5%87%BA%E6%96%B9%E7%A8%8B%E5%BC%8F
// cosw=-tanftand 。f緯度，d赤緯 w日出時角
// =sina-sinfsind/cosfcosd 是考慮了視直徑、蒙氣差之後的。維基：a=.83
* @param {*} f 地理緯度 
* @param {*} d （正午？）赤緯 
 * @returns 日出時刻 0.x日
 */
export const sunRise = (f, d) => {
  const w0 = acosd(-tand(f) * tand(d));
  const t0 = (180 - w0) / 360; // 未修正
  const w = acosd((sind(-0.83) - sind(f) * sind(d)) / (cosd(f) * cosd(d)));
  const t = (180 - w) / 360; // 考慮蒙气差、視半徑
  const tSet = (180 + w) / 360; // 日落考慮蒙气差、視半徑
  return { t0, t, tSet };
};

/**
 *
 * @param {*} RiseLat 地理緯度
 * @param {*} d 赤緯
 * @returns
 */
export const twilight = (RiseLat, d) => {
  // 民用曚影時長。應該也是用的正午太陽緯度
  const limit = 6; // 民用6度，天文18度
  const a = 90 + limit;
  const b = 90 - RiseLat; // 所在地北極距天頂
  const c = 90 - d;
  const Rise = sunRise(RiseLat, d).t0;
  return abc_Sph(a, b, c) / 360 - (0.5 - Rise);
};
// console.log(twilight(23.4916666667, 39.9166666667, 270)) // 日出0.3090277778，曚影0.07083333333

export const deg2Hms = (deg) => {
  const Deci = deci(deg);
  const m = Math.trunc(60 * Deci);
  const s = Math.trunc(3600 * Deci - 60 * m);
  // const ss = Math.round(216000 * Deci - 3600 * m - 60 * s)
  let mStr = m.toString();
  let sStr = s.toString();
  if (mStr.length < 2) mStr = `0${mStr}`;
  if (sStr.length < 2) sStr = `0${sStr}`;
  return `${Math.trunc(deg)}°${mStr}′${sStr}″`; // + ss
};

// 切線分外角法，見梅文鼎三角法舉要卷二。兩邊的輸入順序無所謂。已知邊角邊，求另外兩角。

// console.log(abc_Sph(108, 50.08333333333, 90)) // 113度45分36秒
// console.log(aCb_Sph(73.806348227262589, 75.08623544960639, 23.4916666666667)) // 22度39分19秒=22.6552777778)
// console.log(abc_Sph(73.806348227262589, 75.08623544960639, 22.655413696754813)) // 83度37分4秒，83.61729023292902
export const White2Eclp = (Mobliq, Node, Whitelongi) => {
  // 黃道緯度。月距正交过一象限者与半周相减，过半周者减半周，过三象限者与全周相减
  // const EclpWhiteDif = TwoOrbdegDif(Mobliq, Whitelongi) // 升度差=月距正交之黃道度-月距正交。食甚距時加者亦爲加，減者亦爲減。⚠️我這裡符號用的食甚的月距正交，而非食甚距時所用的實望的月距正交
  // const GreatMLat = sind(90 - AngEquiEclp) * Dist // 這是食甚實緯之南北。
  // 月距正交初、一、二、六、七、八宫为交后，为减。三、四、五、九、十、十一宫为交前，为加。之所以%180，因為tan(20)=tand(200)
  // const MoonGong = fm360(Whitegong + EclpWhiteDif)
  return {
    MoonLon: Gong2Lon(LonHigh2Flat(Mobliq, Whitelongi) + Node),
    MoonLat: HighLon2FlatLat(Mobliq, Whitelongi),
  };
};

export const moonEclp2EquaGuimao = (Sobliq, Lon, Lat) => {
  // 《後編》已知黃道經緯度求赤道經緯度，見月食曆法
  const A_ArcMNox_Eclp =
    (Lat > 0 ? 1 : -1) * t3(acotd(sind(t3(Lon)) * cotd(Lat))); // 太陰距二分弧與黃道交角。單獨算沒問題。近似成平面三角就可以了 sinAcotB=cotC，也就是a/r·r/h=a/h
  const A_ArcMNox_Equa = (Lon > 180 ? -1 : 1) * Sobliq + A_ArcMNox_Eclp; // 太陰距二分弧與赤道交角
  // 思路：黃轉白，白轉赤。
  const tanA_ArcMNox_Equa = cosd(A_ArcMNox_Eclp) * tand(Lon); // 太陰距二分弧之正切線
  const EquaLon =
    Math.trunc(Math.ceil(Lon / 90) / 2) * 180 +
    atand(cosd(A_ArcMNox_Equa) * tanA_ArcMNox_Equa); // 太陰距二分赤道經度
  return {
    EquaLon,
    EquaLat: atand(tand(A_ArcMNox_Equa) * sind(t3(EquaLon))),
  };
};
/**
 * 已知黃道經緯求赤道經緯
 * @param {*} Sobliq 黃赤大距
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 * @returns
 */
export const eclp2Equa = (Sobliq, Lon, Lat) => {
  const Gong = Lon2Gong(Lon);
  const EquaLat = 90 - aCb_Sph(Sobliq, 90 - Lat, t1(Gong)); // 赤緯
  let A = acosd(
    (cosd(90 - Lat) - cosd(Sobliq) * cosd(90 - EquaLat)) /
    (sind(Sobliq) * sind(90 - EquaLat)),
  ); // cosA=(cosa-cosb·cosc)/(sinb·sinc)
  A = A || 180;
  return {
    EquaLon: Gong2Lon(Gong < 180 ? A : 360 - A),
    EquaLat,
  };
};
// console.log(eclp2Equa(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60)) // 考成卷十六恆星曆理算例:赤經緯23度41分58秒=23.6994444444，求得赤緯8度5分4秒=8.08444444444
