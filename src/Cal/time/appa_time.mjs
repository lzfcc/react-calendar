import { nutation, obliqAvg } from "../modern/nutation.mjs";
import { fmod } from "../newmoon/main_shixian.mjs";
import { calPos_vsop } from "../newmoon/main_vsop.mjs";
import { R2H, S2R, deci, pi2 } from "../parameter/constant.mjs";
import { deci2hms } from "./decimal2clock.mjs";
import { deltaT, deltaTError } from "./delta-t.mjs"
import { jd2Date } from "./jd2date.mjs";

// 廖育棟 Calculations in Star Charts
// α⊙ is Sun’s right ascension. ∆ψ is the nutation in longitude given by equation(30), εA is the mean obliquity of the ecliptic given by equation(28), and λ is observer’s(east) longitude.
// 平恆星時（平春分點的時角）與視恆星時（真春分點的時角）之差：Ee, equation of the equinoxes. 平春分點：只算了歲差，真春分點：算了歲差和章動。
// 用 CIO取代春分點的地位，TIO取代Greenwich子午線，ERA取代恆星時。ERA需要實測。
// ERA(Dᴜ)=θ(Dᴜ) = 2π(0.7790572732640 + 1.00273781191135448Dᴜ)，其中Dᴜ=julian UT1 date -2451545
// GAST=GMST+Ee,GMST=θ-Eprec。Eprec(T)累積歲差=−0′′.014506−4612′′.16534T−1′′.3915817T^2+4′′.4×10−7T^3+2′′.9956×10−5T^4。T：J2000儒略世紀。根據圖像，-200<T<200
// Ee =∆ψcosεA
/**
 * 視恆星時LAST
 * @param {*} Jd TT儒略日
 * @param {*} Longitude 地理經度°
 */
const siderealTime = (Jd, Longitude) => {
    const T = (Jd - 2451545) / 365250 // TT儒略世紀
    const Jd2000_UT1 = Jd - deltaT(Jd) - 2451545
    const Eprec = (-0.014506 - 4612.16534 * T - 1.3915817 * T ** 2 + 4.4e-7 * T ** 3 + 2.9956e-5 * T ** 4) * S2R
    const DeltaPsi = nutation(T).NutaEclp
    const EpsAvg = obliqAvg(T) * S2R
    const Ee = DeltaPsi * Math.cos(EpsAvg)
    const Theta = pi2 * (.7790572732640 + 1.00273781191135448 * Jd2000_UT1)
    const GAST = Theta - Eprec + Ee
    return fmod(GAST * R2H + Longitude / 15, 24)
}
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
    Longitude = Longitude || 0
    const LAST = siderealTime(Jd, Longitude)
    const EquaLon = calPos_vsop('Sun', Jd).EquaLon
    let H = LAST - EquaLon * R2H
    H = H < -12 ? H + 24 : H
    return {
        LAST,
        LASolar: (12 + H) % 24
    }
}
// console.log(solarTime(2432224, 0))
/**
 * 求時差（視太陽時平太陽時之差）
 * @param {*} Jd_UT1 UT1
 * @param {*} Longitude 
 * @returns in hour
 */
export const eot = (Jd_UT1, Longitude) => {
    Jd_UT1 = +Jd_UT1
    Longitude = +Longitude || 0
    const DeltaT = deltaT(Jd_UT1)
    const Jd = Jd_UT1 + DeltaT // TT
    const { LAST, LASolar } = solarTime(Jd, Longitude)
    const LMSolar = (12 + deci(Jd_UT1) * 24 + Longitude / 15) % 24
    const EOT = (LASolar - LMSolar + (LASolar - LMSolar > 23 ? 24 : 0)) % 24
    return { LAST, EOT, LASolar, LMSolar, Jd, DeltaT }
}
export const eotPrint = (Jd_UT1, Longitude) => {
    const { LAST, EOT, LASolar, LMSolar, Jd, DeltaT } = eot(Jd_UT1, Longitude)
    const DeltaTErr = deltaTError(jd2Date(Jd).year)
    return {
        LASTPrint: deci2hms(LAST / 24).hms,
        LASolarPrint: deci2hms(LASolar / 24).hms,
        LMSolarPrint: deci2hms(LMSolar / 24).hmsms,
        DeltaT: Math.trunc(DeltaT * 86400),
        DeltaTErr,
        Jd: Jd.toFixed(6),
        TThms: deci2hms(Jd - Math.round(Jd) + 0.5 + Longitude / 360).hmsms,
        EOTPrint: (EOT > 0 ? '+' : '-') + deci2hms(EOT / 24).hms
    }
}
// console.log(eot(3221521.8, 116.428))
// const eprec = T => (-0.014506 - 4612.16534 * T - 1.3915817 * T ** 2 + 4.4e-7 * T ** 3 + 2.9956e-5 * T ** 4)
// console.log(eprec(-10))