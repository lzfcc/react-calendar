import Para from '../parameter/calendars.mjs'
import { autoEquaEclp, autoRise } from '../astronomy/bind.mjs'
import { MansionNameList, degAccumList } from '../parameter/constant.mjs'
import { AutoLightRange } from '../parameter/auto-constant.mjs'
import { GongHigh2Flat, LonHigh2Flat, fmod, twilight } from '../newmoon/main_shixian.mjs'

export const mansion2Deg = (Mansion, AccumList) => {
    let Print = 0
    if (AccumList.length === undefined) {
        Print = +(AccumList[Mansion.slice(0, 1)] + +Mansion.slice(1)).toFixed(10)
    } else {
        Print = +(AccumList[MansionNameList.indexOf(Mansion.slice(0, 1))] + +Mansion.slice(1)).toFixed(10)
    }
    return Print
}
// console.log(mansion2Deg('心2', degAccumList('Guimao', 900).EquaAccumList))
export const deg2Mansion = (Deg, AccumList, fixed) => {
    Deg = +Deg + 1e-12
    let Print = ''
    if (AccumList.length === undefined) { // 清代用字典
        const SortedList = Object.entries(AccumList).sort((a, b) => a[1] - b[1])
        for (let i = 0; i < 27; i++) {
            if (Deg >= SortedList[i][1] && Deg < SortedList[i + 1][1]) {
                const MansionDeg = Deg - SortedList[i][1]
                Print = SortedList[i][0] + MansionDeg.toFixed(fixed || 3)
                break
            }
            Print = SortedList[27][0] + (Deg - SortedList[27][1]).toFixed(fixed || 3) // 軫
        }
    } else {
        for (let i = 0; i < 28; i++) {
            if (Deg >= AccumList[i] && Deg < AccumList[i + 1]) {
                const MansionDeg = Deg - AccumList[i]
                Print = MansionNameList[i] + MansionDeg.toFixed(fixed || 3)
                break
            }
        }
    }
    return Print
}
// console.log(deg2Mansion(1, degAccumList('Guimao', 900).EquaAccumList))
/**
 * 20240312改寫，增加黃道宿度
 * @param {*} Name 曆法名
 * @param {*} Y 冬至小分
 * @param {*} EclpGong 距冬至黃道實行度。有它就是有太陽盈縮積算法的
 * @param {*} Sd 距冬至時間。有它就是沒有太陽盈縮積算法的，與上面二選一。
 * @param {*} SolsDeci 公元年
 * @returns 
 */
export const mansion = (Name, Y, EclpGong, Sd) => {
    const { Type, SolarRaw, MansionConst, MansionRaw, OriginAd, CloseOriginAd } = Para[Name]
    let { Sidereal, Solar } = Para[Name]
    const isPrecession = Sidereal ? true : false // 有歲差的曆法
    const { EclpAccumList, EquaAccumList } = degAccumList(Name, Y)
    Sidereal = Sidereal || (Solar || SolarRaw)
    const OriginYear = Y - (OriginAd || CloseOriginAd)
    const OriginYear1 = OriginYear + 1
    if (Name === 'Shoushi' || Name === 'Shoushi2') {
        Sidereal += +(Math.trunc(OriginYear1 / 100) * .0001).toFixed(4) // 方向和歲實消長反的
        Solar = +(SolarRaw - Math.trunc(OriginYear1 / 100) * .0001).toFixed(4)
    } // 置中積，以加周應爲通積，滿周天分，（上推往古，每百年消一；下算將來，每百年長一。）去之，不盡，以日周約之爲度，不滿，退約爲分秒。命起赤道虛宿六度外，去之，至不滿宿，卽所求天正冬至加時日𨇠赤道宿度及分秒。（上考者，以周應減中積，滿周天，去之；不盡，以減周天，餘以日周約之爲度；餘同上。如當時有宿度者，止依當時宿度命之。） // 試了一下，按上面這樣區分1281前後，沒有任何變化
    const OriginDeg = EquaAccumList[MansionRaw[0]] + MansionRaw[1] // 曆元宿度積度
    //////// 黃道度
    const OriginAccum = OriginYear * Solar + (MansionConst || 0)
    const SolsEquaDeg = isPrecession ? fmod(OriginAccum + OriginDeg, Sidereal) : OriginDeg // 赤道冬至。算例參《古曆新探》p85
    const SolsEquaMansion = deg2Mansion(SolsEquaDeg, EquaAccumList, 10)
    const SolsMansionName = SolsEquaMansion.slice(0, 1)
    const SolsEquaMansionDeg = +SolsEquaMansion.slice(1)
    const SolsEclpMansionDeg = autoEquaEclp(SolsEquaMansionDeg, Name).Equa2Eclp // 根據《太陽通軌》（《明大統曆法彙編》p128），直接用冬至赤道宿度（例如在箕5，即用5）赤轉黃即冬至黃道宿度。又如紀元曆「求天正冬至加時黃道日度」：「以冬至加時赤道日度及分秒，減一百一度⋯⋯」就是指這個5
    const SolsEclpMansion = SolsMansionName + SolsEclpMansionDeg
    const SolsEclpDeg = mansion2Deg(SolsEclpMansion, EclpAccumList)
    let EclpDeg = 0, EquaDeg = 0
    if (Type >= 5) {
        const EquaGong = autoEquaEclp(EclpGong, Name).Eclp2Equa
        const PrecessionFrac = isPrecession ? EquaGong / Sidereal * (Sidereal - Solar) : 0 // 一年之中的歲差
        EclpDeg = (SolsEclpDeg + EclpGong - autoEquaEclp(PrecessionFrac, Name).Equa2Eclp) % Sidereal // 太陽改正所得就是黃道度，此處不要赤轉黃
        EquaDeg = (SolsEquaDeg + EquaGong - PrecessionFrac) % Sidereal
    } else { // 沒有盈縮積的曆法
        const PrecessionFrac = isPrecession ? Sd / Sidereal * (Sidereal - Solar) : 0 // 一年之中的歲差
        EclpDeg = (SolsEclpDeg + autoEquaEclp(Sd - PrecessionFrac, Name).Equa2Eclp) % Sidereal
        EquaDeg = (SolsEquaDeg + Sd - PrecessionFrac) % Sidereal
    }
    const Equa = deg2Mansion(EquaDeg, EquaAccumList)
    const Eclp = deg2Mansion(EclpDeg, EclpAccumList)
    return {
        Equa, Eclp,
        SolsEclpMansion: SolsMansionName + SolsEclpMansionDeg.toFixed(3),
        SolsEquaMansion: SolsMansionName + SolsEquaMansionDeg.toFixed(3)
    }
}
// console.log(mansion('Dayan', 1555, 0))
/**
 * 西曆日躔
 * @param {*} Name 
 * @param {*} Y 年份
 * @param {*} Gong 距冬至黃道度
 * @param {*} fixed 保留小數點幾位
 * @param {*} isEqua true: Gong是赤道度
 * @returns 
 */
export const mansionQing = (Name, Y, Gong, isEqua) => {
    const { StarVy, Sobliq, MansionConst, CloseOriginAd, MansionOriginAd } = Para[Name]
    const { EclpAccumList, EquaAccumList, Exchange } = degAccumList(Name, Y)
    const Precession = StarVy * (Y - (MansionOriginAd || CloseOriginAd))
    const SolsEclpDeg = fmod(MansionConst - Precession, 360)  // 冬至黃道宿積度（宿的度量體系）從角0度開始，冬至在多少度
    // 此處照抄古曆，只是黃赤互換
    const SolsEclpMansion = deg2Mansion(SolsEclpDeg, EclpAccumList, undefined, true, Exchange)
    const SolsMansionName = SolsEclpMansion.slice(0, 1)
    const SolsEclpMansionDeg = +SolsEclpMansion.slice(1)
    const SolsEquaDeg = GongHigh2Flat(Sobliq, SolsEclpDeg) // 直接這樣算即可，因為平常是逆時針加，這裏是順時針加，只是方向反了，但度數不變
    const SolsEquaMansion = deg2Mansion(SolsEquaDeg, EquaAccumList, undefined, true, Exchange)
    let EclpMansionGong = 0, EquaMansionGong = 0
    if (isEqua) {
        const PrecessionFrac = GongHigh2Flat(Sobliq, Gong / 360 * StarVy)
        EquaMansionGong = SolsEquaDeg + Gong - PrecessionFrac
    }
    else {
        const PrecessionFrac = Gong / 360 * StarVy
        EclpMansionGong = SolsEclpDeg + Gong - PrecessionFrac
        EquaMansionGong = SolsEquaDeg + GongHigh2Flat(Sobliq, Gong - PrecessionFrac)
    }
    return {
        Eclp: deg2Mansion(EclpMansionGong % 360, EclpAccumList, 3, true, Exchange, true),
        Equa: deg2Mansion(EquaMansionGong % 360, EquaAccumList, 3, true, Exchange),
        SolsEclpMansion: SolsMansionName + SolsEclpMansionDeg.toFixed(3),
        SolsEquaMansion,
        Exchange
    }
}
// console.log(mansionQing('Guimao', 333, 150))
/**
 * 昏中《中》頁326昬時距午度（卽太陽時角）=Sidereal*半晝漏（單位1日），夜半至昬東行度數=2-夜漏=1-(Rise-LightRange)，夜半至明東行度數=Rise-LightRange
昏中=昬時距午度+夜半至昬東行度數=赤度+(晝漏*週天-夜漏)/200+1=1+赤度+(.5-夜半漏)*週天-夜半漏（單位1日）
 */
export const midstar = (Name, Y, EclpGong, Sd, SolsDeci) => {
    const { Type, Sidereal } = Para[Name]
    const { EquaAccumList } = degAccumList(Name, Y)
    const EquaDeg = mansion(Name, Y, EclpGong, Sd).EquaDeg
    const LightRange = AutoLightRange(Name)
    const Rise = autoRise(Sd, SolsDeci, Name) / 100
    const HalfLight = .5 - Rise + LightRange // 半晝漏
    const HalfNight = Rise - LightRange
    const MorningstarDeg = (EquaDeg + Sidereal * (1 - HalfLight) + (Type === 7 ? 0 : HalfNight)) % Sidereal // 大衍只考慮了昬時距午度
    const DuskstarDeg = (EquaDeg + Sidereal * HalfLight + (Type === 7 ? 0 : 1 - HalfNight)) % Sidereal
    const Duskstar = deg2Mansion(DuskstarDeg, EquaAccumList, 2)
    const Morningstar = deg2Mansion(MorningstarDeg, EquaAccumList, 2)
    return Morningstar + ' ' + Duskstar
}
export const midstarQing = (Name, Y, LonTod, LonMor, Rise) => {
    const { StarVy, Solar, MansionConst, Sobliq, RiseLat, CloseOriginAd, MansionOriginAd } = Para[Name]
    const { EquaAccumList } = degAccumList(Name, Y)
    const Precession = StarVy * (Y - (MansionOriginAd || CloseOriginAd))
    const EquaMansionGongTod = GongHigh2Flat(Sobliq, LonTod + 90 - Precession + MansionConst)
    const SunVd = LonMor - LonTod
    const SunEquaVd = LonHigh2Flat(Sobliq, LonMor) - LonHigh2Flat(Sobliq, LonTod)
    const Twilight = twilight(Sobliq, RiseLat, (LonTod + SunVd / 2) % 360)
    const MorningstarTmp = (Rise - Twilight) * SunEquaVd - (.5 - Rise + Twilight) * 360 // 考成上編中星時刻法沒有考慮地球公轉
    const DuskstarTmp = (1 - Rise + Twilight) * SunEquaVd + (.5 - Rise + Twilight) * 360
    const Morningstar = deg2Mansion(((EquaMansionGongTod + MorningstarTmp) * (Solar / 360) + Solar) % Solar, EquaAccumList, 2)
    const Duskstar = deg2Mansion(((EquaMansionGongTod + DuskstarTmp) * (Solar / 360) + Solar) % Solar, EquaAccumList, 2)
    return { Morningstar, Duskstar }
}