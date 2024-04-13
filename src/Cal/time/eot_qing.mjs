import { Lon2Gong, LonHigh2Flat } from '../astronomy/pos_convert.mjs';
// import { sunCorrQing } from '../astronomy/sun_moon_qing.mjs';
// import { tand, sind, cosd, atand } from '../parameter/functions.mjs'

// 本文件是時憲曆的平太陽時真太陽時之差
const timeAvg2RealXinfaList = [
    // 距冬至度數0-359
    8, 7.5, 7, 7, 7, 6, 5, 5, 4, 4, 3.5, 3, 2.5, 2, 2, 1.5, 1, 0.5, 0, -0.5, -1,
    -1.5, -2, -2.5, -3, -3, -3, -3.5, -4, -4.5, -5, -5, -5, -5.5, -6, -6, -6, -6,
    -6.5, -7, -7, -7, -7, -7, -7.5, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8, -8,
    -8, -8, -8, -8, -7, -7, -7, -7, -7, -7, -7, -7, -6.5, -6, -6, -6, -6, -5.5,
    -5, -5, -5, -4.5, -4, -4, -4, -3.5, -3, -3, -2.5, -2, -2, -1.5, -1, -0.5, 0,
    0, 0.5, 0.5, 0.5, 0.5, 0.5, 1.5, 2, 2.5, 3, 3, 3, 3.5, 4, 4.5, 5, 5, 5, 5.5,
    6, 6, 6.5, 7, 7, 7.5, 7.5, 8, 8, 8, 8.5, 8.5, 9, 9, 9.5, 9.5, 10, 10.5, 11,
    11, 11, 11, 11, 11, 11, 11, 11, 11, 11.5, 12, 12, 12, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 12, 12, 11.5, 11, 11, 11, 11, 11, 11, 11, 10.5, 10, 10, 10, 10,
    10, 9.5, 9, 9, 9, 9, 8.5, 8, 8, 8, 7.5, 7.5, 7, 7, 6.5, 6, 6, 6, 6, 5.5, 5.5,
    5, 5, 5, 5, 4.5, 4, 4, 4, 4, 3.5, 3, 3, 3, 3, 3, 3, 2.5, 2.5, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2.5, 2.5, 3, 3, 3, 3, 3, 3, 3.5, 4, 4,
    4.5, 4.5, 5, 5, 5, 5.5, 6, 6, 6, 6.5, 7, 7, 7, 7.5, 8, 8.5, 9, 9, 9, 9.5, 10,
    10.5, 11, 11, 11.5, 11.5, 12, 12.5, 13, 13, 13.5, 13.5, 14, 14.5, 15, 15.5,
    16, 16, 16.5, 17, 17, 17.5, 18, 18, 18, 18.5, 19, 19, 20, 20, 20, 20.5, 21,
    21, 21, 21.5, 22, 22, 22, 22.5, 23, 23, 23, 23, 23, 23.5, 24, 24, 24, 24, 24,
    24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23.5, 23, 23, 23,
    23, 23.5, 22, 22, 22, 21.5, 21, 21, 21, 20.5, 20.5, 20, 19.5, 19, 19, 18.5,
    18, 17.5, 17, 16.5, 16, 15.5, 15, 14.5, 14, 13.5, 13.5, 13, 12.5, 12, 11.5,
    11, 10.5, 10, 9.5, 9,
];
// const timeAvg2RealXinfaLiao = (Sobliq, SunLon, Name) => {
//     // 根據廖育棟附錄A
//     const SunCorr = sunCorrQing(Name, Lon2Gong(SunLon)).Corr;
//     const a = tand(Sobliq / 2) ** 2 * sind(2 * SunLon);
//     const b = 1 + tand(Sobliq / 2) ** 2 * cosd(2 * SunLon);
//     const EclpEquaDifTcorr = atand(a / b);
//     const SunCorrTcorr = -SunCorr; // 變成分鐘數
//     const k = 7.5;
//     return SunCorrTcorr * 4 + EclpEquaDifTcorr * 4 + k;
// };
const timeAvg2RealXinfa = (SunLon) => {
    // 査表
    const SunGong = Math.trunc(Lon2Gong(SunLon));
    return timeAvg2RealXinfaList[SunGong] / 1440;
};
const timeAvg2RealXinfaB = (Sobliq, SunLon) =>
    (SunLon - LonHigh2Flat(Sobliq, SunLon)) / 360; // 只考慮升度差
// 時差總
const timeAvg2RealJiazi = (Sobliq, SunLon, SunCorr) => {
    const SunCorrTcorr = -SunCorr / 360; // 均數時差。以實望太陽均數變時。均數加者則爲減。
    const EclpEquaDifTcorr = (SunLon - LonHigh2Flat(Sobliq, SunLon)) / 360; // 升度時差。二分後爲加，二至後爲減。
    return SunCorrTcorr + EclpEquaDifTcorr;
};
export const timeAvg2Real = (Name, Sobliq, SunLon, SunCorr) => {
    let TimeDif = 0;
    if (Name === "Xinfa" || Name === "Yongnian") {
        if (SunCorr) TimeDif = timeAvg2RealXinfa(SunLon);
        else TimeDif = timeAvg2RealXinfaB(Sobliq, SunLon); // 合朔只用升度差
    } else if (Name === "Jiazi" || Name === "Guimao")
        TimeDif = timeAvg2RealJiazi(Sobliq, SunLon, SunCorr);
    return TimeDif;
};