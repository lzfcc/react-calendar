import { big, frc } from '../parameter/constant.mjs'
import { Frac2FalseFrac, DeciFrac2IntFrac } from '../equation/math.mjs'

export const constModern = Jd => { // 儒略世紀：36525日。我下面索性將100年作爲儒略世紀，要不然太麻煩
    Jd = +Jd
    const T = (Jd - 2451545) / 36525 // J2000儒略世紀
    const e = (84381.406 - 46.836769 * T - .0001831 * T ** 2 + .00200340 * T ** 3 - .000000576 * T ** 4 - .0000000434 * T ** 5) / 3600
    //《古曆新探》頁322.近日點平黃經 ω // 也就是說近日點越來越向春分移動 。375年在大雪，1247年近日點在冬至
    const T1 = (Jd - 2415021) / 36525
    const perihelion = 281.22084 + 1.719175 * T1 + (1.63 / 3600) * T1 ** 2 + (.012 / 3600) * T1 ** 3
    const eccentricity = .01670862 - .00004204 * T1 - .000000124 * T1 ** 2 // 黃道離心率
    const Solar = 365.242189623 - .000061522 * T - 6.09e-8 * T ** 2 + 2.6525e-7 * T ** 3 // VSOP87 曆表 Meeus J，Savoie D. The history of the tropical year[J]. Journal of the British Astronomical Association，1992，102( 1) : 42. 
    const Sidereal = 365.25636042 + 1e-7 * T
    const Lunar = 29.530588853 + 2.162e-7 * T
    const Anoma = 27.554549878 - 1.039e-6 * T
    const Node = 27.21222082 + 3.8e-7 * T
    const Print = `朔望月 ${Lunar} 日
近點月 ${Anoma} 日
交點月 ${Node} 日
回歸年 ${Solar} 日
恆星年 ${Sidereal} 日
平黃赤交角 ${e}°
黃道離心率 ${eccentricity}
近日點平黃經 ${perihelion}°`
    return { Print, e, perihelion, eccentricity, Anoma, Solar, Sidereal, Lunar }
}
// console.log(constModern(-401).Print)

export const BindSolarChange = year => {
    year = +year
    const year1 = year - 1194 // 現代値歸算爲統天曆元
    const year2 = year - 1281
    const sign1 = year1 > 0 ? -1 : 1
    const sign2 = year2 > 0 ? -1 : 1
    const SolarWest = big(365.2422393296).sub(big(6.16 * 1e-8).mul(year1)).toNumber()
    const SolarChangeWest = parseFloat((sign1 * big(3.08 * 1e-8).mul(year1 ** 2).toNumber()).toPrecision(12))
    const SolarTongtian = parseFloat((365.2425 - .021167 / 12000 * year1).toPrecision(10))
    const SolarChangeTongtian = parseFloat((sign1 * .0127 / 12000 * year1 ** 2).toPrecision(10))
    const SolarShoushi = parseFloat((365.2425 - 2 * 1e-6 * year2).toPrecision(10))
    const SolarChangeShoushiRaw = parseFloat((-Math.trunc(year2 / 100) / 10000).toPrecision(10))
    const SolarChangeShoushi = parseFloat((sign2 * -SolarChangeShoushiRaw * year2).toPrecision(10))
    const SolarWannian = parseFloat((365.2425 - 1.75 * 1e-6 * year2).toPrecision(10))
    const SolarChangeWannian = parseFloat((sign1 * 8.75 * 1e-7 * year2 ** 2).toPrecision(10))
    const LunarWest = big(29.530587110428).add(big(2.162 * 1e-9).mul(year1)).toNumber()
    const LunarCahngeWest = -sign1 * (big(1.081 * 1e-9).mul(year1 ** 2)).toNumber()
    const LunarTongtian = parseFloat((year1 ? (365.2425 + SolarChangeTongtian / year1 - 7 / 8000) / (365.2425 / (29 + 6368 / 12000)) : 29 + 6368 / 12000).toPrecision(10))
    const LunarChangeTongtian = parseFloat((-7 / 8000 * year1).toPrecision(10))
    let Print = []
    Print = Print.concat({
        title: '現代',
        data: [SolarWest, '', SolarChangeWest, LunarWest, LunarCahngeWest]
    })
    Print = Print.concat({
        title: '統天',
        data: [SolarTongtian, '', SolarChangeTongtian, LunarTongtian, LunarChangeTongtian]
    })
    Print = Print.concat({
        title: '授時',
        data: [SolarShoushi, SolarChangeShoushiRaw, SolarChangeShoushi]
    })
    Print = Print.concat({
        title: '聖壽萬年',
        data: [SolarWannian, '', SolarChangeWannian]
    })
    return Print
}
// console.log(BindSolarChange(2000))

export const Node2Cycle = (Node, Lunar) => {
    const NodeDenom = Frac2FalseFrac(Node).Denom
    let Cycle = 0
    if (NodeDenom === 1) {
        Node = big('27.' + Node)
        Lunar = big('29.' + Lunar)
        Cycle = big(.5).mul(Node.div(Lunar)).mul(Lunar.div(Lunar.sub(Node))).toFixed(32)
    } else {
        Node = frc('27 ' + Node)
        Lunar = frc('29 ' + Lunar)
        Cycle = frc('1/2').mul(Node.div(Lunar)).mul(Lunar.div(Lunar.sub(Node))).toFraction(true)
    }
    return Cycle
}
// console.log(Node2Cycle('2122221759', '5305958132'))
// console.log(Node2Cycle('780592/3678183', '659/1242'))

export const Cycle2Node = (Cycle, Lunar) => {
    const CycleDenom = Frac2FalseFrac(Cycle).Denom
    let Node = 0
    if (CycleDenom === 1) {
        Cycle = big('5.' + Cycle)
        Lunar = big('29.' + Lunar)
        Node = Lunar.mul(Cycle.div(big.add(.5, Cycle))).toFixed(32)
    } else {
        Cycle = frc('5 ' + Cycle)
        Lunar = frc('29 ' + Lunar)
        Node = Lunar.mul(Cycle.div(frc('1/2').add(Cycle))).toFraction(true)
    }
    return Node
}
// console.log(Cycle2Node('404/465', '659/1242'))

export const Regression = (Sidereal, Node, Lunar) => {
    let Regression = 0
    let Portion = 0
    if (Sidereal.includes('/') && Node.includes('/') && Lunar.includes('/')) {
        Sidereal = frc('365 ' + DeciFrac2IntFrac(Sidereal))
        Node = frc('27 ' + DeciFrac2IntFrac(Node))
        Lunar = frc('29 ' + DeciFrac2IntFrac(Lunar))
        Regression = Sidereal.div(Node).sub(Sidereal.div(Lunar)).sub(1)
        Portion = Regression.add(1).div(Sidereal.div(Lunar).add(1).add(Regression))
        Regression = Regression.toFraction() + ' = ' + Regression.toString()
        Portion = Portion.toFraction() + ' = ' + Portion.toString()
    } else if (!Sidereal.includes('/') && !Node.includes('/') && !Lunar.includes('/')) {
        Sidereal = +('365.' + Sidereal)
        Node = +('27.' + Node)
        Lunar = +('29.' + Lunar)
        Regression = (Sidereal / Node - Sidereal / Lunar - 1).toFixed(8)
        Portion = ((1 + Regression) / (Sidereal / Lunar + 1 + Regression)).toFixed(8)
    } else {
        throw (new Error('請同時輸入小數或分數'))
    }
    return `交點退行速度 ${Regression} 度/日\n交率/交數 ${Portion}`
}
// console.log(Regression('1875.2125/7290', '1547.0880/7290', '3868/7290'))
// console.log(Regression('3084.57/12030', '2553.0026/12030', '6383/12030'))

const MingtianNode = () => {
    const v = frc('9901159/6240000').div('1151693/39000') // 9901159/184270880交點退行速度
    const Sidereal = frc('365 1600447/6240000')
    const Solar = frc('365 9500/39000')
    const Lunar = frc('29 20693/39000')
    // Node = Sidereal / (v + 1 + Sidereal / Lunar)
    const Node = Sidereal.div(v.add(1).add(Sidereal.div(Lunar))).toString() //.toFraction(true) 
    // const Node = Solar.div(v.add(1).add(Solar.div(Lunar))).toFraction(true)
    // return MoonAvgVddenom
}
// console.log(MingtianNode())

// const test1 = (year, Solar, Lunar) => {
//     const accum = frc(Solar).mul(year).mod(Lunar)
//     return accum.toFraction(true)
// }
// console.log(test1(91341235, '365 1776/7290', '29 3868/7290')) // 15 5686/177147=15.03209763643

// const test2 = (year, Solar, Lunar) => {
//     const accum = Solar * year % Lunar
//     return accum
// }
// console.log(test2(91341235, 365.24362139917695474, 29.5305898491083676))  // 紀元15.03210011886921
// console.log(1776 / 7290)
// 也就是說，積年九千萬年，能保持小數點後5位精度，只能說剛好勉強夠用