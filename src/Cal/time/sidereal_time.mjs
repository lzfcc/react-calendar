// A sidereal day is approximately 86164.0905 seconds (23 h 56 min 4.0905s)

import { multiply } from "mathjs";
import { nutation, obliqAvg } from "../modern/nutation.mjs";
import { precessionMx } from "../modern/precession.mjs";
import { calPos_vsop } from "../modern/vsop_elp.mjs";
import { R2H, S2R, big, deci, fmod } from "../parameter/functions.mjs";
import { deci2hms } from "./decimal2clock.mjs";
import { deltaT, deltaTError } from "./delta-t.mjs";
import { jd2Date } from "./jd2date.mjs";
import { xyz2lonlat } from "../astronomy/pos_functions.mjs";
import { deg2Hms } from "../astronomy/pos_convert.mjs";

// 廖育棟 Calculations in Star Charts
// Sidereal time is defined as the hour angle of the vernal equinox. α⊙ is Sun’s right ascension. ∆ψ is the nutation in longitude given by equation(30), εA is the mean obliquity of the ecliptic given by equation(28), and λ is observer’s(east) longitude.
// 平恆星時（平春分點的時角）與視恆星時（真春分點的時角）之差：Ee, equation of the equinoxes. 平春分點：只算了歲差，真春分點：算了歲差和章動。
// 用 CIO取代春分點的地位，TIO取代Greenwich子午線， Earth Rotation Angle (ERA) 取代恆星時。ERA需要實測。
// ERA(Dᴜ)=θ(Dᴜ) = 2π(0.7790572732640 + 1.00273781191135448Dᴜ)，其中Dᴜ=julian UT1 date -2451545
// GAST=GMST+Ee,GMST=θ-Eprec。Eprec(T)累積歲差=−0′′.014506−4612′′.16534T−1′′.3915817T^2+4′′.4×10−7T^3+2′′.9956×10−5T^4。
// Ee =∆ψcosεA
// wiki: As an example, the Astronomical Almanac for the Year 2017 gave the ERA at 0 h 1 January 2017 UT1 as 100° 37′ 12.4365″. The GAST was 6 h 43 m 20.7109 s. 我算得JdUT12457754.5 06:43:20.70
/**
 * 視恆星時LAST
 * @param {*} Jd TT儒略日
 * @param {*} Longitude 地理經度°
 */
export const siderealTime = (Jd, Longitude) => {
  const pi2 =
    "6.28318530717958647692528676655900576839433879875021164194988918";
  const R2H =
    "3.81971863420548805845321032094034468882703149777095476994401626";
  const T = (Jd - 2451545) / 36525; // TT儒略世紀
  const Equinox = multiply(precessionMx(T), [1, 0, 0]).toArray();
  const Eprec = -xyz2lonlat(Equinox).Lon; // 我直接用完整的岁差矩阵来算，不用拟合公式
  const Jd2000_UT1 = Jd - deltaT(Jd) - 2451545;
  // const Eprec =
  //     (-0.014506 -
  //         4612.16534 * T -
  //         1.3915817 * T ** 2 +
  //         4.4e-7 * T ** 3 +
  //         2.9956e-5 * T ** 4) *
  //     S2R;
  const DeltaPsi = nutation(T).NutaEclp;
  const EpsAvg = obliqAvg(T) * S2R;
  const Ee = DeltaPsi * Math.cos(EpsAvg);
  // UT1 is defined by this equation:
  // const Theta = pi2 * (0.779057273264 + 1.00273781191135448 * Jd2000_UT1);
  // const GAST = Theta - Eprec + Ee;
  // const LAST = fmod(GAST * R2H + Longitude / 15, 24)
  const Theta = big(pi2).mul(
    big(0.779057273264).add(big("1.00273781191135448").mul(Jd2000_UT1))
  );
  const GAST = big(Theta).sub(Eprec).add(Ee);
  const LAST = fmod(
    big(GAST)
      .mul(R2H)
      .add(Longitude / 15)
      .toNumber(),
    24
  );
  return LAST;
};
// console.log(siderealTime(2451545 + 365.2422 * 2000, 120))
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
    LASolar: (12 + H) % 24
  };
};
// console.log(solarTime(2432224, 0))
/**
 * 求時差（視太陽時平太陽時之差）
 * @param {*} Jd_UT10 0時區UT1
 * @param {*} Longitude
 * @returns in hour
 */
export const eot = (Jd_UT10, Longitude) => {
  Jd_UT10 = +Jd_UT10;
  Longitude = +Longitude || 0;
  const DeltaT = deltaT(Jd_UT10);
  const Jd = Jd_UT10 + DeltaT; // TT
  const { LAST, LASolar } = solarTime(Jd, Longitude);
  const LMSolar = (12 + deci(Jd_UT10) * 24 + Longitude / 15) % 24;
  let EOT = LASolar - LMSolar;
  if (EOT > 23) EOT -= 24;
  else if (EOT < -23) EOT += 24;
  return { LAST, EOT, LASolar, LMSolar, Jd, DeltaT };
};

export const eotPrint = (Jd_UT10, Longitude) => {
  const { LAST, EOT, LASolar, LMSolar, Jd, DeltaT } = eot(Jd_UT10, Longitude);
  const DeltaTErr = deltaTError(jd2Date(Jd).year);
  return {
    LASTPrint: deci2hms(LAST / 24).hmsms,
    LASTPrint1: deg2Hms(LAST * 15),
    LASolarPrint: deci2hms(LASolar / 24).hmsms,
    LMSolarPrint: deci2hms(LMSolar / 24).hmsms,
    DeltaT: Math.trunc(DeltaT * 86400),
    DeltaTErr,
    Jd: Jd.toFixed(6),
    TThms: deci2hms(Jd - Math.round(Jd) + 0.5 + Longitude / 360).hmsms,
    EOTPrint: (EOT > 0 ? "+" : "-") + deci2hms(EOT / 24).hmsms
  };
};
// console.log(eot(2457754.5, 0))
// const eprec = T => (-0.014506 - 4612.16534 * T - 1.3915817 * T ** 2 + 4.4e-7 * T ** 3 + 2.9956e-5 * T ** 4)
// console.log(eprec(-10))
