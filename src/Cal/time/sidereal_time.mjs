
// A sidereal day is approximately 86164.0905 seconds (23 h 56 min 4.0905s)

import { nutation, obliqAvg } from "../modern/nutation.mjs";
import { calPos_vsop } from "../modern/vsop_elp.mjs";
import { R2H, S2R, deci, fmod, pi2 } from "../parameter/functions.mjs";
import { deci2hms } from "./decimal2clock.mjs";
import { deltaT, deltaTError } from "./delta-t.mjs";
import { jd2Date } from "./jd2date.mjs";

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
