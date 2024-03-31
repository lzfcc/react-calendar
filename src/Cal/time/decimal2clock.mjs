import Para from '../parameter/calendars.mjs'
import {
    BranchList, HalfList, StemList, QuarList, TwelveList, TwelveListHuangji, TwelveListWuyin, TwentyfourList, FourList, big, nzh, deci,
} from '../parameter/constant.mjs'

export const deci2hms = Deci => {
    Deci = Math.abs(Deci) % 1
    const H = Deci * 24
    const h = Math.trunc(H)
    const HFrac = deci(H)
    const M = HFrac * 60
    const m = Math.trunc(M)
    const MFrac = deci(M)
    const S = MFrac * 60
    const s = Math.trunc(S)
    const SFrac = deci(S)
    const MS10 = SFrac * 100  // 本來毫秒應該*1000，這是10ms
    const ms10 = Math.trunc(MS10)
    let hStr = h.toString()
    let mStr = m.toString()
    let sStr = s.toString()
    let ms10Str = ms10.toString()
    if (hStr.length < 2) hStr = '0' + hStr
    if (mStr.length < 2) mStr = '0' + mStr
    if (sStr.length < 2) sStr = '0' + sStr
    if (ms10Str.length < 2) ms10Str = '0' + ms10Str
    return {
        hm: hStr + ':' + mStr,
        hms: hStr + ':' + mStr + ':' + sStr,
        hmsms: hStr + ':' + mStr + ':' + sStr + '.' + ms10Str
    }
}


const ClockWeijin = (Deci, Name) => {
    const { Type } = Para[Name]
    Deci = big(Deci)
    const Portion = big.div(100, 12)
    if (Name === 'Easthan' || Type >= 5) {
        Deci = Deci.add(100 / 24).mod(100)
    }
    let ClockOrder = (Deci.div(Portion)).floor().toNumber()
    const ClockFrac = Deci.sub(big(ClockOrder).mul(Portion))
    const Twelve = ((big.div(ClockFrac, Portion)).mul(12)).floor().toNumber()
    if (Twelve === 11 && Name !== 'Wuyin') {
        ClockOrder++
    }
    let TwelveName = ''
    if (Type <= 4) {
        TwelveName = TwelveList[Twelve]
    } else if (Name === 'Huangji') {
        TwelveName = TwelveListHuangji[Twelve]
    } else if (Name === 'Wuyin') { // 戊寅交食加時。滕艳辉等:《戊寅元历》的日月食推算方法
        TwelveName = TwelveListWuyin[Twelve]
    }
    return BranchList[ClockOrder + 1] + '時' + TwelveName
}

const ClockTmp = (Deci, Mode) => { // 我假設：每日96刻，子初夜半，每刻100分
    let Portion1 = 0
    let Portion2 = 0
    if (Mode === 96) {
        Portion1 = .96
        Portion2 = 8
    } else if (Mode === 108) {
        Portion1 = 1.08
        Portion2 = 9
    } else if (Mode === 120) {
        Portion1 = 1.2
        Portion2 = 10
    }
    const KeRaw = Deci * Portion1
    const ClockOrder = Math.trunc(KeRaw / Portion2)
    const QuarOrder = Math.trunc(KeRaw - ClockOrder * Portion2)
    // const MinOrder = Math.trunc(deci(KeRaw) * 100)
    return BranchList[ClockOrder + 1] + '時' + QuarList[QuarOrder % 8] + '刻' // + nzh.encodeS(MinOrder) +'分'
}

const Clock24 = Deci => {
    const Portion = 100 / 24 + 1e-10
    let ClockOrder = Math.trunc(Deci / Portion)
    const ClockFrac = Deci - ClockOrder * Portion
    const Twelve = Math.trunc(ClockFrac / Portion * 12)
    if (Twelve === 11) {
        ClockOrder++
    }
    return TwentyfourList[ClockOrder] + '時' + TwelveList[Twelve]
}

const ClockTang = Deci => { // 唐、宋皇祐之前。1/3刻放在時辰最後，可能是初或正兩種情況
    const KeRaw = (Deci + 100 / 24 + 1e-10) % 100 // 夜半子半 
    let ClockOrder = Math.trunc(KeRaw / (100 / 12))
    const HalfRaw = KeRaw - (ClockOrder * (100 / 12))
    let QuarOrder = 0
    for (let i = 1; i <= 9; i++) {
        if (HalfRaw >= i - 1 && HalfRaw < i) {
            QuarOrder = i - 1
        }
    }
    return BranchList[ClockOrder + 1] + '時' + QuarList[QuarOrder] + '刻'
}

const ClockSong = Deci => { // 皇祐之後、元、明。四刻是1/6。1刻60分，1分=14.4s
    const KeRaw = (Deci + 100 / 24 + 1e-10) % 100 // 夜半子半 
    let ClockOrder = Math.trunc(KeRaw / (100 / 12))
    const HalfOrder = Math.trunc((KeRaw - ClockOrder * (100 / 12)) / (4 + 1 / 6))
    let HalfRaw = KeRaw - (ClockOrder * (100 / 12) + HalfOrder * (4 + 1 / 6))
    let QuarOrder = 0
    if (HalfRaw < 1) { } else if (HalfRaw < 2) {
        QuarOrder = 1
    } else if (HalfRaw < 3) {
        QuarOrder = 2
    } else if (HalfRaw < 4) {
        QuarOrder = 3
    } else {
        QuarOrder = 4
    }
    const MinOrder = Math.trunc((KeRaw - (ClockOrder * (100 / 12) + HalfOrder * (4 + 1 / 6) + QuarOrder)) * 60)
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder] + '' + QuarList[QuarOrder] + '刻' + nzh.encodeS(MinOrder) + '分'
}
const clockQingMain = DeciRaw => {
    const Deci = DeciRaw + 100 / 24 // 夜半子半
    const KeRaw = Deci * .96 + 1e-10
    const KeOrder = Math.trunc(KeRaw)
    const ClockOrder = Math.trunc(KeRaw / 8)
    const HalfOrder = Math.trunc((KeOrder - ClockOrder * 8) / 4)
    const QuarOrder = KeOrder - (ClockOrder * 8 + HalfOrder * 4)
    const MinOrder = Math.trunc(deci(KeRaw) * 15) % 15
    const sum = (ClockOrder / 12 + (HalfOrder - 1) / 24 + QuarOrder / 96 + MinOrder / 1440) * 86400
    const SecOrder = Math.trunc(DeciRaw * 864 - sum)
    return { ClockOrder, HalfOrder, QuarOrder, MinOrder, SecOrder }
}
const ClockQing = DeciRaw => { // 清代96刻
    const { ClockOrder, HalfOrder, QuarOrder, MinOrder, SecOrder } = clockQingMain(DeciRaw)
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder % 2] + '' + QuarList[QuarOrder] + '刻' + (MinOrder === 0 ? '' : nzh.encodeS(MinOrder) + '分') + (SecOrder === 0 ? '' : nzh.encodeS(SecOrder) + '秒')
}
export const clockQingB = DeciRaw => {
    const { ClockOrder, HalfOrder, QuarOrder, MinOrder, SecOrder } = clockQingMain(DeciRaw)
    return BranchList[ClockOrder + 1] + HalfList[HalfOrder % 2] + '' + QuarList[QuarOrder] + (MinOrder === 0 ? '' : MinOrder)
}
// console.log(ClockQing(99.99))
export const AutoClock = (Deci, Name) => {
    const { Type } = Para[Name]
    let Print = ''
    if (Type <= 6 && !['Linde', 'LindeB'].includes(Name)) {
        Print = ClockWeijin(Deci, Name)
    } else if (Type === 7 || ['Futian', 'Chongxuan', 'Yingtian', 'Qianyuan', 'Yitian', 'Chongtian'].includes(Name)) { // 因為宋志皇祐渾儀排在明天之後觀天之前
        Print = ClockTang(Deci)
    } else if (Type >= 8) {
        Print = ClockSong(Deci)
    }
    return Print
}

const ClockNameList = {
    Easthan: '後漢四分曆',
    Yuanjia: '魏晉南北',
    Wuyin: '戊寅曆',
    Huangji: '皇極曆',
    Dayan: '唐北宋前期',
    Mingtian: '南宋元明'
}
const GengList = '初二三四五'

export const BindClock1 = Deci => {
    Deci = +('.' + Deci)
    let Print = [{
        title: '現代',
        data: deci2hms(Deci).hmsms
    }]
    Deci *= 100 + 1e-12
    Print = Print.concat(
        ['Yuanjia', 'Wuyin', 'Easthan', 'Huangji', 'Dayan', 'Mingtian'].map(title => {
            return {
                title: ClockNameList[title],
                data: AutoClock(Deci, title)
            }
        }))
    Print = Print.concat({
        title: '清',
        data: ClockQing(Deci)
    })
    Print = Print.concat({
        title: '南北朝方位制',
        data: Clock24(Deci)
    })
    Print = Print.concat({
        title: '96刻',
        data: ClockTmp(Deci, 96)
    })
    Print = Print.concat({
        title: '108刻',
        data: ClockTmp(Deci, 108)
    })
    Print = Print.concat({
        title: '120刻',
        data: ClockTmp(Deci, 120)
    })
    return Print
}
// console.log(BindClock1('5')) // 128  9584  9999

export const Clock2Deci = Clock => {
    const info = '請按如下格式輸入：「子正初刻」「辰初」「未初四刻」「巳時」「申時八刻」'
    const A = BranchList.indexOf(Clock[0])
    const B = HalfList.indexOf(Clock[1])
    const C = QuarList.indexOf(Clock[2])
    if (A < 0) {
        throw (new Error(info))
    } else if (B < 0) {
        throw (new Error(info))
    }
    let Start = 0, End = 0
    if (Clock.length === 2) {
        if (B <= 2) {
            Start = (A - 1) / 12 + B / 24 - 1 / 24
            End = (Start + 1 / 24).toFixed(6)
        } else {
            Start = (A - 1) / 12 - 1 / 24
            End = (Start + 1 / 12).toFixed(6)
        }
        Start = ((Start + 1) % 1).toFixed(6)
    } else if (Clock.length === 4) {
        if (C < 0) {
            throw (new Error(info))
        } else if (B <= 2 && C > 4) { // 又有初正，刻數又>四
            throw (new Error(info))
        } else if (Clock[3] !== '刻') {
            throw (new Error(info))
        }
        if (B <= 2) {
            Start = (A - 1) / 12 + B / 24 + C / 100 - 1 / 24
            End = ((Start + (C === 4 ? .01 / 6 : .01) + 1) % 1).toFixed(6)
        } else {
            Start = (A - 1) / 12 + C / 100 - 1 / 24
            End = ((Start + (C === 8 ? .01 / 3 : .01) + 1) % 1).toFixed(6)
        }
        Start = ((Start + 1) % 1).toFixed(6)
    } else {
        throw (new Error(info))
    }
    let Print = [{
        title: '約餘',
        data: `${Start} — ${End}`
    }]
    return Print
}

// console.log(Clock2Deci('子時八刻'))



export const BindNightClock = (DeciRaw, Rise, LightRange) => {
    DeciRaw = +('.' + DeciRaw)
    Rise = +('.' + Rise)
    LightRange = +LightRange / 100
    const Dawn = Rise - LightRange
    const Dusk = 1 - Rise + LightRange
    if (DeciRaw > Dawn && DeciRaw < Dusk) {
        throw (new Error('請輸入夜中時刻'))
    }
    const Night = 2 * (Rise - LightRange)
    let Deci = DeciRaw
    if (DeciRaw < Dawn) {
        Deci += 1
    }
    Deci -= Dusk
    const GengRange = Night / 5
    const ChouRange = Night / 25
    let Geng = 0
    for (let i = 0; i <= 4; i++) {
        if (Deci >= i * GengRange && Deci < (i + 1) * GengRange) {
            Geng = i
            break
        }
    }
    const GengName1 = StemList[Geng + 1] + '夜'
    const GengName2 = GengList[Geng] + '更'
    const Deci1 = Deci % GengRange
    let Chou = 0
    for (let i = 1; i <= 5; i++) {
        if (Deci1 >= (i - 1) * ChouRange && Deci1 < i * ChouRange) {
            Chou = i
            break
        }
    }
    let ChouName1 = ''
    let Print1 = ''
    if (Chou === 1) {
        ChouName1 = StemList[Geng + 1] + '辰刻'
        Print1 = ChouName1
    } else {
        ChouName1 = QuarList[Chou - 1] + '籌'
        Print1 = GengName1 + ChouName1
    }
    const ChouName2 = QuarList[Chou] + '點'
    let Print = [{
        title: '唐',
        data: Print1
    }]
    Print = Print.concat({
        title: '宋以後',
        data: GengName2 + ChouName2
    })

    const GengRange3 = Night / 5 - .02
    const ChouRange3 = Night / 25
    let Geng3 = 0
    for (let i = 0; i <= 4; i++) {
        if (Deci >= i * GengRange3 && Deci < (i + 1) * GengRange3) {
            Geng3 = i
            break
        }
    }
    const Deci3 = Deci % GengRange3
    let Chou3 = 0
    for (let i = 1; i <= 5; i++) {
        if (Deci3 >= (i - 1) * ChouRange3 && Deci3 < i * ChouRange3) {
            Chou3 = i
            break
        }
    }
    let Print3 = ''
    if (Deci + Dusk < .9 + Dawn) {
        const GengName3 = GengList[Geng3] + '更'
        const ChouName3 = QuarList[Chou3] + '點'
        Print3 = GengName3 + ChouName3
    } else {
        const tmp = (DeciRaw - (Rise - .1)) * 100
        Print3 = '攢點後' + tmp.toFixed(2) + '刻'
    }
    Print = Print.concat({
        title: '宋以後內中',
        data: Print3
    })
    return Print
}

export const Deci2Stage = Deci => {
    let Order12 = Math.trunc(Deci)
    const Order4 = Order12
    let Order4B = Order12
    const Frac = Deci - Order4
    const Twelve = Math.trunc(Frac * 12)
    const Four = Math.trunc(Frac * 4)
    const FourB = Math.trunc((Frac + .125) * 4)
    if (Twelve === 11) {
        Order12++
    }
    if (FourB === 4) {
        Order4B++
    }
    let Print = [{
        title: '十二段',
        data: `${Order12} 度${TwelveList[Twelve]}`
    }]
    Print = Print.concat({
        title: '三段A',
        data: `${Order4} 度${FourList[Four]}`
    })
    Print = Print.concat({
        title: '三段B',
        data: `${Order4B} 度${FourList[FourB]}`
    })
    return Print
}
// console.log(Deci2Stage(1.65))