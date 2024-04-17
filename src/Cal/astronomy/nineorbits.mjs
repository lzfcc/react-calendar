import Para from '../parameter/calendars.mjs'
import { AutoMoonAvgV } from '../parameter/auto_consts.mjs'

export const AutoNineOrbit = (NodeAccum, Sd, Name) => { // 月行九道法
    const { Type, SolarRaw, Node, LunarRaw } = Para[Name]
    let { Solar, Lunar
    } = Para[Name]
    Lunar = Lunar || LunarRaw
    Solar = Solar || SolarRaw
    const NodeHalf = Node / 2
    const SynodicNodeDif50 = (Lunar - Node) / 2 // 望差
    const HalfTermLeng = Solar / 24
    Sd += (Node - NodeAccum) * AutoMoonAvgV(Name) // 正交黃道度
    let Print = ''
    if (Type <= 6) {
        if ((NodeAccum > NodeHalf - SynodicNodeDif50 && NodeAccum < NodeHalf) || NodeAccum < SynodicNodeDif50 || (NodeAccum > NodeHalf && NodeAccum < NodeHalf + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span>`
        } else if (NodeAccum < NodeHalf) {
            Print = `<span class='lati-yang'>陽</span>`
        } else Print = `<span class='lati-yin'>陰</span>`
    } else if (Type >= 7 && Type <= 10) { // 月行九道
        if (Sd < 3 * HalfTermLeng || Sd >= 21 * HalfTermLeng) { // 冬
            if (NodeAccum < NodeHalf) {
                Print = `<span class='lati-white'>白</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-green'>靑</span><span class='lati-yin'>陰</span>`
        } else if (Sd >= 3 * HalfTermLeng && Sd < 9 * HalfTermLeng) {
            if (NodeAccum < NodeHalf) {
                Print = `<span class='lati-red'>朱</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-black'>黑</span><span class='lati-yin'>陰</span>`
        } else if (Sd >= 9 * HalfTermLeng && Sd < 15 * HalfTermLeng) {
            if (NodeAccum < NodeHalf) {
                Print = `<span class='lati-green'>靑</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-white'>白</span><span class='lati-yin'>陰</span>`
        } else {
            if (NodeAccum < NodeHalf) {
                Print = `<span class='lati-black'>黑</span><span class='lati-yang'>陽</span>`
            } else Print = `<span class='lati-red'>朱</span><span class='lati-yin'>陰</span>`
        }
        if ((NodeAccum > NodeHalf - SynodicNodeDif50 && NodeAccum < NodeHalf) || NodeAccum < SynodicNodeDif50) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yang'>陽</span>`
        } else if ((NodeAccum > NodeHalf && NodeAccum < NodeHalf + SynodicNodeDif50) || (NodeAccum > Node - SynodicNodeDif50)) {
            Print = `<span class='lati-yellow'>黃</span><span class='lati-yin'>陰</span>`
        }
    }
    return Print
}

const Exhaustion = () => { // 大同歲實365.2469 設在0.015-.018之間。365.262566
    let Sidereal = 365.2579
    let Print = ''
    while (Sidereal < 365.2689) {
        Sidereal = +(Sidereal + .000001).toFixed(6)
        const Solar = 365 + 9681 / 39616
        const Accum = Solar * 1025699
        const Deg = (121.2599 + Accum) % Sidereal
        // const DuskstarDeg = (Deg + .225 * Sidereal + .7) % Sidereal
        if (Deg >= 87 && Deg < 87.9) {
            // if (DuskstarDeg >= 183.2599 && DuskstarDeg < 184.2499) {
            Print += ',' + Sidereal // + ':' + Deg}
            // }
        }
        return Print
    }
}
// console.log(Exhaustion())