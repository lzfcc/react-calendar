import Para from '../parameter/calendars.mjs'
import { autoRise } from '../astronomy/bind.mjs'
import { AutoLightRange } from '../parameter/auto-constant.mjs'

const LeapAdjust = (LeapNumTerm, TermAvgRaw, NewmInt, Name) => {
    const { isNewmPlus } = Para[Name]
    let Plus = 3.75 // 若不用進朔，需要改成3.75
    if (isNewmPlus) {
        Plus = 2.75
        if (['Wuji', 'Tsrengyuan'].includes(Name)) Plus = 3
    }
    while (LeapNumTerm >= 1 && (TermAvgRaw[LeapNumTerm] >= NewmInt[LeapNumTerm + 1]) && (TermAvgRaw[LeapNumTerm] < NewmInt[LeapNumTerm + 1] + Plus)) { // 原來是LeapNumTerm >= 2,<=11
        LeapNumTerm--
    }
    while (LeapNumTerm <= 12 && (TermAvgRaw[LeapNumTerm + 1] < NewmInt[LeapNumTerm + 2]) && (TermAvgRaw[LeapNumTerm + 1] >= NewmInt[LeapNumTerm + 2] - Plus)) {
        LeapNumTerm++
    }
    return LeapNumTerm
}

export const AutoNewmPlus = (Deci, Sd, SolsDeci, Name) => { // 朔小分
    const { Solar } = Para[Name]
    const Solar25 = Solar / 4
    const SpringequinoxSunrise = autoRise(Solar25, 0, Name) / 100
    const Rise = autoRise(Sd, SolsDeci, Name) / 100
    const LightRange = AutoLightRange(Name)
    let standard = .75
    let Portion = 3 // 明天、紀元這樣，其他宋曆應該也差不多。夏至0.734 為什麼跟前面是相反的？
    if (Name === 'Xuanming') {
        Portion = 5 // 夏至0.7405
    } else if (['Yingtian', 'Qianyuan', 'Yitian'].includes(Name)) {
        Portion = 2 // 夏至0.726
    }
    if (['Wuji', 'Tsrengyuan'].includes(Name)) {
        standard = 1.1 - Rise + LightRange
    } else if (Name === 'Chongxuan') {
        standard = Math.max(.725, 1 - Rise + LightRange)
    } else if (['LindeB', 'Dayan', 'Qintian', 'Chongtian'].includes(Name)) { // 欽天日入後則進一日
        standard = 1 - Rise // 冬至0.7，夏至0.8
    } else if (Sd > Solar25 && Sd < Solar * .75) {
        standard = .75 + (Rise - SpringequinoxSunrise) / Portion
    }
    let NewmPlus = 0
    let Print = ''
    if (Deci >= standard) {
        NewmPlus = 1
        Print = `<span class='NewmPlus'>+</span>`
    }
    return { NewmPlus, Print }
}
// console.log( AutoNewmPlus (.75, 191, .9, 'Linde') )

export const AutoSyzygySub = (Deci, Sd, SolsDeci, Name) => {
    const { Type } = Para[Name]
    const LightRange = AutoLightRange(Name)
    const Rise = autoRise(Sd, SolsDeci, Name) / 100
    let standard = Rise - LightRange
    if (Type >= 8 || Name === 'Qintian') standard = Rise
    let SyzygySub = 0
    let Print = ''
    if (Deci < standard) { // 晨前刻、晨初餘數
        SyzygySub = -1
        Print = `<span class='NewmPlus'>-</span>`
    }
    return { SyzygySub, Print }
}