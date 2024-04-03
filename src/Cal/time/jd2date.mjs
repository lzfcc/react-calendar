import { ScList, WeekList1 } from '../parameter/constants.mjs'
import { deci2hms } from './decimal2clock.mjs'
/**
 * 把儒略日轉換成儒略曆或格里高利曆 ported from https://ytliu0.github.io/ChineseCalendar/Julian.js by 廖育棟
 * @param {array} Jd 儒略日
 */
export const jd2Date = Jd => {
    let b = 0, c = 0, d = 0, e = 0, f = 0
    if (Jd < 2299161) { // Julian calendar
        b = 0
        c = Jd + 1524
    } else { // Gregorian calendar
        b = Math.floor((Jd - 1867216.25) / 36524.25)
        c = Jd + b - Math.floor(b / 4) + 1525
    }
    d = Math.floor((c - 122.1) / 365.25);
    if (d < 0) d++
    e = d * 365 + Math.floor(d / 4);
    f = Math.floor((c - e) / 30.6);
    if (f < 0) f++
    let mm = f - 1 - Math.floor(f / 14) * 12;
    let year = d - 4715 - Math.floor((mm + 7) / 10);
    let dd = c - e - Math.floor(f * 30.6);
    dd = Math.round(dd)
    if (dd === 0) {
        mm--
        dd = 31
    }
    const DayFrac = Jd - Math.round(Jd) + 0.5
    const { hm, hms, hmsms } = deci2hms(DayFrac)
    const ScOrder = Math.round((Math.round(Jd) % 60 + 110) % 60.1);
    return { year, mm, dd, hm, hms, hmsms, ScOrder }
}
// console.log(extractFirstTwoDigits('46262'))
// const Start = performance.now()
// console.log(jd2Date(2460393.12264).year)
// const End = performance.now()
// console.log(End - Start)
export const Jd2DatePrint = (Jd, Longitude) => {
    Jd = +Jd
    const { year, mm, dd, ScOrder } = jd2Date(Jd + Longitude / 360)
    let yy = year
    if (year <= 0) {
        yy = Math.abs(year) + 1
        yy = '前 ' + yy;
    }
    const Week = Math.round(Jd) % 7
    const WeekName = WeekList1[Week]
    const Sc = ScList[ScOrder] + '(' + ScOrder + ')'
    return '公元 ' + yy + ' 年 ' + mm + ' 月 ' + dd + ' 日 ' + ' 星期' + WeekName + ' ' + Sc
}
export const date2Jd = (yy, mm, dd, h, m, s, ms) => {
    yy = parseInt(yy), mm = parseInt(mm), dd = parseInt(dd), h = parseInt(h), m = parseInt(m), s = parseInt(s), ms = parseInt(ms)
    mm = mm || 1, dd = dd || 1, h = h || 0, m = m || 0, s = s || 0, ms = ms || 0
    if (mm > 12 || dd > 31 || h > 23 || s > 59 || ms > 999) {
        throw (new Error('invalid value!'))
    } else if (mm <= 0 || dd <= 0 || h < 0 || s < 0 || ms < 0) {
        throw (new Error('invalid value!'))
    }
    if (mm <= 2) {
        mm += 12
        yy--
    }
    let b = 0
    if (10000 * yy + 100 * mm + dd <= 15821004) { // Julian calendar
        b = -2 + Math.floor((yy + 4716) / 4) - 1179
    } else { // Gregorian calendar
        b = Math.floor(yy / 400) - Math.floor(yy / 100) + Math.floor(yy / 4)
    }
    // const Frac = h.div(24) + m.div(1440) + s.div(86400) + ms.div(86400000)
    // const Date = Frac.add(365 * yy - 679004 + b + Math.floor(30.6 * (mm + 1)) + dd + 2400001 + -.5) // Frac默認0，所以要減去半日
    const Frac = h / 24 + m / 1440 + s / 86400 + ms / 86400000
    const Jd = 365 * yy - 679004 + b + Math.floor(30.600001 * (mm + 1)) + dd + 2400001 + -.5 + Frac
    return Jd
}

// https://ww2.mathworks.cn/matlabcentral/fileexchange/111820-nasa-jpl-development-ephemerides-de441
// Mjday: Modified Julian Date from calendar date and time
// 
// Inputs:
// Year      Calendar date components
//  Month
//  Day
//  Hour      Time components
//  Min
// Sec
//Output:
// Modified Julian Date
//     %
//  Last modified: 2022 /09 / 24   Meysam Mahooti
//     %
//  Reference:
//  Montenbruck O., Gill E.; Satellite Orbits: Models, Methods and
// Applications; Springer Verlag, Heidelberg; Corrected 3rd Printing(2005).
// function Mjday(Year, Month, Day, Hour = 0, Minute = 0, Sec = 0) {
//     if (Month <= 2) {
//         Month += 12;
//         Year -= 1;
//     }
//     let b;
//     if (10000 * Year + 100 * Month + Day <= 15821004) {
//         // Julian calendar
//         b = -2 + Math.floor((Year + 4716) / 4) - 1179;
//     } else {
//         // Gregorian calendar
//         b = Math.floor(Year / 400) - Math.floor(Year / 100) + Math.floor(Year / 4);
//     }

//     const MjdMidnight = 365 * Year - 679004 + b + Math.floor(30.6001 * (Month + 1)) + Day;
//     const FracOfDay = (Hour + Minute / 60 + Sec / 3600) / 24;

//     const Mjd = MjdMidnight + FracOfDay;
//     return Mjd;
// }

// // 示例使用
// const mjd = Mjday(2023, 4, 12, 14, 30, 0);
// console.log(mjd);