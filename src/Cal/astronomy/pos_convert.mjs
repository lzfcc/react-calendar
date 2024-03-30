import { pi, D2R, R2D, big } from '../parameter/constant.mjs'
import { FlatLon2FlatLat, Gong2Lon, GongFlat2High, GongHigh2Flat, HighLon2FlatLat, Lon2Gong, LonFlat2High, LonHigh2Flat, aCb_Sph } from '../newmoon/main_shixian.mjs'
import { r1, x2LonLat } from '../newmoon/main_vsop.mjs'
import { multiply } from 'mathjs'
import { constModern } from './astr_const.mjs'
// import { mat3, vec3 } from 'gl-matrix'

// const d2r = degree => big(degree).mul(pi).div(180)
// const r2d = degree => big(degree).mul(180).div(pi)


const abs = X => Math.abs(X)
const d2r = d => d * pi / 180
const r2d = r => r * 180 / pi
const sin = X => Math.sin(D2R * X)//.toFixed(8) // 數理精蘊附八線表用的是七位小數
const cos = X => Math.cos(D2R * X) //.toFixed(8)
const tan = X => Math.tan(D2R * X)//.toFixed(8)
const cot = X => (1 / Math.tan(D2R * X))//.toFixed(8)
const asin = X => R2D * Math.asin(X)//.toFixed(8)
const acos = X => R2D * Math.acos(X)//.toFixed(8)
const atan = X => R2D * Math.atan(X)//.toFixed(8)
const t1 = X => abs(180 - X % 360)


/**
 * 位置矢量
 * @param {*} Lon ⚠️角度deg
 * @param {*} Lat ⚠️角度deg
 * @returns 
 */
const xyz = (Lon, Lat) => [
    cos(Lat) * cos(Lon),
    cos(Lat) * sin(Lon),
    sin(Lat)
]
// const aa = multiply(transpose(I(40, 5)), I(40, 5)) //  I·IT=1

/**
 * 
 * @param {*} Sobliq 黃赤大距
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 * @returns 
 */
export const eclp2Equa = (Sobliq, Lon, Lat) => {
    const Gong = Lon2Gong(Lon)
    const EquaLat = 90 - aCb_Sph(Sobliq, 90 - Lat, t1(Gong)) // 赤緯
    let A = acos(
        (cos(90 - Lat) - cos(Sobliq) * cos(90 - EquaLat)) /
        (sin(Sobliq) * sin(90 - EquaLat)))  // cosA=(cosa-cosb·cosc)/(sinb·sinc)
    A = A || 180
    return {
        EquaLon: Gong2Lon(Gong < 180 ? A : 360 - A),
        EquaLat
    }
}
// console.log(eclp2Equa(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60)) // 考成卷十六恆星曆理算例:赤經緯23度41分58秒=23.6994444444，求得赤緯8度5分4秒=8.08444444444
const eclp2Equa_Matrix = (Sobliq, Lon, Lat) => {
    const Ieclp = xyz(Lon, Lat)
    const Iequa = multiply(r1(D2R * -Sobliq), Ieclp).toArray()
    const { Lon: EquaLon, Lat: EquaLat } = x2LonLat(Iequa)
    return { EquaLon: (EquaLon * R2D + 360) % 360, EquaLat: EquaLat * R2D }
}
export const equa2Eclp = (Sobliq, EquaLon, EquaLat) => {
    const Iequa = xyz(EquaLon, EquaLat)
    const Ieclp = multiply(r1(D2R * Sobliq), Iequa).toArray()
    const { Lon, Lat } = x2LonLat(Ieclp)
    return { Lon: (Lon * R2D + 360) % 360, Lat: Lat * R2D }
}
// console.log(eclp2Equa(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60))
// console.log(eclp2Equa_Geom(23 + 29.5 / 60, 27 + 10 / 60 - 90, 29 + 22 / 60))
// 赤道經緯轉古代極黃經緯
export const equa2Ceclp = (Sobliq, EquaLon, EquaLat) => {
    return {
        CeclpLon: LonFlat2High(Sobliq, EquaLon),
        CeclpLat: EquaLat - FlatLon2FlatLat(Sobliq, EquaLon)
    }
}
/**
 * 黃道經緯轉古代極黃經緯
 * @param {*} Sobliq 
 * @param {*} Lon 黃經
 * @param {*} Lat 黃緯
 */
export const eclp2Ceclp = (Sobliq, Lon, Lat) => {
    const { EquaLon, EquaLat } = eclp2Equa(Sobliq, Lon, Lat)
    const { CeclpLon, CeclpLat } = equa2Ceclp(Sobliq, EquaLon, EquaLat)
    return { CeclpLon, CeclpLat, EquaLon, EquaLat }
}
// console.log(eclp2Ceclp(23.5, 10, 10))
export const testEclpEclpDif = (Sobliq, Lat) => { // 看極黃經和黃經差多少
    const Dif = []
    for (let i = 0; i < 180; i++) {
        Dif[i] = (eclp2Ceclp(Sobliq, i, Lat).CeclpLon - i) % 360
        if (Dif[i] > 180) Dif[i] -= 360
        Dif[i] = +Dif[i].toFixed(5)
    }
    const Max = Math.max(...Dif)
    const A = Dif.indexOf(Max)
    const B = Dif.indexOf(-Max)
    const Print = `極黃經與黃經之差，約在${A}和${B}°出現極值${Max}°`
    return Print
}
// console.log(testEclpEclpDif(23.5, 20))


/**
 * 一天之内太阳高度角的变化速率如何计算？ - Pjer https://www.zhihu.com/question/25909220/answer/1026387602 一年中太阳直射点在地球上的移动速度是多少？ - 黄诚赟的回答 https://www.zhihu.com/question/335690936/answer/754032487「太阳直射点的纬度变化不是匀速的，春分秋分最大，夏至冬至最小。」
https://zh.wikipedia.org/zh-hk/%E5%A4%AA%E9%99%BD%E4%BD%8D%E7%BD%AE
 * @param {*} v 時角（正午爲0單位°）
 * @param {*} Lat 正午12點赤緯
 * @param {*} f 地理緯度
 * @returns 太陽高度角
 */
const hourA2ElevatA = (v, Lat, f) => +(asin(sin(f) * sin(Lat) + cos(f) * cos(Lat) * cos(v))).toFixed(12)
// console.log(hourA2ElevatA(0, 23.5, 23))
/**
 * // https://zh.wikipedia.org/zh-hk/%E6%97%A5%E5%87%BA%E6%96%B9%E7%A8%8B%E5%BC%8F
// cosw=-tanftand 。f緯度，d赤緯 w日出時角
// =sina-sinfsind/cosfcosd 是考慮了視直徑、蒙氣差之後的。維基：a=.83
 * @param {*} l 黃經
 * @param {*} f 地理緯度
 * @param {*} Sobliq 黃赤交角
 * @returns 日出時刻
 */
export const sunRise = (Sobliq, f, l) => {
    const d = HighLon2FlatLat(Sobliq, l) // 赤緯
    const w0 = acos(-tan(f) * tan(d))
    const t0 = (180 - w0) / 360 * 100 // 未修正
    const w = acos((sin(-.77) - sin(f) * sin(d)) / (cos(f) * cos(d)))
    const t = (180 - w) / 360 * 100 // 考慮蒙气差、視半徑
    return { t0, t }
}
// console.log(sunRise(23.44, 39, 1))
// console.log(sunRiseQing(23.44, 39, 1))
// h太陽高度角=90°-|緯度φ-赤緯δ|。张富、张丽娟、邱本志《一种计算太阳低仰角蒙气差的有理函数逼近方法》，《太陽能學報》2015(9) // 還可參考 李文、赵永超《地球椭球模型中太阳位置计算的改进》
const refraction_ARCHIVE = h => (1819.08371242143 + 194.887513592849 * h + 1.46555397475109 * h ** 2 - .0419553783815395 * h ** 3) /
    (1 + .409283439734292 * h + .0667313795916436 * h ** 2 + .0000846859707945254 * h ** 3) / 3600
/**
 * Sæmundsson’s formula: https://en.wikipedia.org/wiki/Atmospheric_refraction#cite_note-Saemundsson1986-24
 * @param {*} a 高度
 * @param {*} P 大氣壓kPa
 * @param {*} T 溫度K
 * @returns 
 */
const refraction = (a, P, T) => 1.02 / 60 * (P / 101) * (283 / T) * cot(a + 10.3 / (a + 5.11))

/**
 * 
 * @param {*} Sobliq 黃赤交角
 * @param {*} f 地理緯度
 * @param {*} l 黃經
 * @returns dial length= h tan(zenith height)
 */
export const Lon2DialWest = (Sobliq, f, l) => {
    const d = HighLon2FlatLat(Sobliq, l) // 赤緯
    const h = 90 - Math.abs(f - d) // 正午太陽高度
    const z0 = f - d // 眞天頂距=緯度-赤緯
    const r = .52 // 日視直徑0.53度。角半径=atan(1/2 d/D)
    const Refrac = refraction(h, 102, 290) // 蒙气差使太陽升高
    const Parallax = 8.8 / 3600 * sin(z0) // p0太陽地平視差8.8s。視差總是使視位置降低，地平線最大，天頂爲0
    const z = z0 - Refrac + r / 2 + Parallax
    const Dial = (8 * tan(z)).toFixed(8) // 修正
    const Dial1 = (8 * tan(z0)).toFixed(8) // 未修正
    return { Dial, Dial1 }
}
const Lat = () => { // 由《周髀算经》推算观测地 的纬度有三种数据可用，一是夏至日影一尺六寸，二是冬至日影一丈三尺五寸，三是北极 高度一丈三寸。
    let x = 30.1
    const scale = x => Math.tan(D2R * (x - 23.958428)) / Math.tan(D2R * (x + 23.958428)) // 前2300年黃赤交角
    const norm = 1.6 / 13.5
    const eps = 1e-8
    while (x < 45) {
        if (scale(x) > norm - eps && scale(x) < norm + eps) {
            return x
        }
        x += .00001
    }
}
// console.log(Lat()) // 35.17369

// ε黃赤交角 Φ 黃白交角
const MoonLonWest_BACKUP = (EclpRaw, Jd) => { // 統一360度
    const Eclp = EclpRaw //(EclpRaw + 90) % 360
    const v0 = D2R * Eclp // 距冬至轉換成距離春分的黃經
    const I = D2R * 5.1453 // 授時黃白大距6
    const E = D2R * constModern(Jd).e // 授時黃赤大距23.9
    const cosE = big.cos(E) // .9
    const tank = big.tan(I).div(big.sin(E)) // tank .22
    // const k = tank.atan() // k正交極數 12.7
    const tana0 = tank.mul(v0.sin()).div(tank.mul(cosE.mul(v0.cos())).add(1))
    const a0Raw = tana0.atan() // a0距差
    const a0 = r2d(a0Raw).abs().toNumber() // a0距差=赤經    
    let EquaLon = 0
    if ((Eclp >= 90 && Eclp < 180) || (Eclp >= 270)) {
        EquaLon = 90 + a0
    } else {
        EquaLon = 90 - a0
    }
    // a0 =k*Eclp/(Sidereal/4) //k=14.66 授時
    // 月離赤道正交：白赤道降交點
    const sinu = I.sin().mul(v0.sin()).div(a0Raw.sin()) // 白赤大距
    const u = r2d(sinu.asin())
    const l = r2d(a0Raw.sin().div(a0Raw.sin().pow(2).sub(I.sin().pow(2).mul(v0.sin().pow(2))).sqrt()).atan()) // WhiteLon
    return {
        EquaLon, a0,
        u: u.toNumber(),
        l: l.toNumber(),
    }
}
// console.log(MoonLonWest(165, 365.2575, 1281).u)

// 《數》頁348白赤差
const MoonLonWest = (NodeEclpLon, MoonEclpLon, Jd) => {
    const E = d2r(constModern(Jd).e)
    const I = d2r(5.1453)
    const v = d2r(NodeEclpLon) // 升交點黃經
    const b = d2r(MoonEclpLon - NodeEclpLon) // 月亮到升交點的黃道度
    const tmp = b.cos().mul(I.cos()).sub(I.sin().mul(big.cos(v.add(b))).mul(E.tan()))
    const g = r2d(b.sin().div(tmp).atan()) // 月亮距離升交點的白道度
    const EclpWhiteDif = g.sub(r2d(b)).toNumber()
    const WhiteLon = MoonEclpLon + EclpWhiteDif
    return { EclpWhiteDif, WhiteLon }
}
// console.log (MoonLonWest(0, 170, 1222))

// 下陳美東公式
const MoonLatWest = (NodeAccum, NodeAvgV, Sidereal, year) => {
    const T = d2r(45)
    const cosT = T.cos()
    const sinT = T.sin()
    const Node = big(27.212220817).add(big(.000000003833).mul(year - 2000))
    NodeAvgV = NodeAvgV || big(Sidereal).div(Node)
    const E = d2r(constModern(year).e)
    const sinE = E.sin()
    const cosE = E.cos()
    const cotE = big.tan(E.neg().add(pi.div(2)))
    const n0 = NodeAvgV.mul(NodeAccum).mul(pi).div(Sidereal / 2)
    const F = d2r(5.1453)
    const sinF = F.sin()
    const cosF = F.cos()
    /////甲/////
    const CH = sinT.div(cosT.mul(cosF).add(sinF.mul(cotE))).atan()
    const cosa = sinE.mul(sinF).mul(cosT).sub(cosE.mul(cosF))
    const sina = cosa.acos().sin()
    const DG = big.sin(n0.add(CH)).mul(sina).asin()
    const CD = cosa.mul(n0.add(CH).tan()).neg().atan()
    const BC = sinT.div(cosT.mul(cosE).add(sinE.mul(F.tan()))).atan()
    const DK = big.sin(CD.add(BC)).mul(E.tan()).atan()
    const GK = DG.sub(DK)
    /////乙//////
    const cosb = cosF.mul(cosE).add(sinF.mul(sinE).mul(cosT))
    const sinb = cosb.acos().sin()
    const AH = cosb.mul(cosF).sub(cosE).div(sinb.mul(sinF)).acos()
    const EM = big.sin(n0.add(AH)).mul(sinb).asin()
    const AB = sinT.mul(sinF).div(sinb).asin()
    const AE = cosb.mul(big.tan(n0.add(AH))).atan()
    const EI = big.sin(AE.sub(AB)).mul(E.tan())
    const IM = EI.sub(EM)

    const MoonLat = GK.abs().add(IM.abs()).div(2).toNumber()
    return MoonLat
}
// console.log(MoonLatWest(6, 0, 360, 1000))

const HighLon2FlatLatWest = (GongRaw, Jd) => { // 根據當年的黃赤交角
    const { Sidereal, e } = constModern(Jd)
    const Lon = (GongRaw * 360 / Sidereal + 270) % 360
    return HighLon2FlatLat(e, Lon)
}
// 下面這個加上了日躔。藤豔輝《宋代朔閏與交食研究》頁90,106
export const EcliWest = (NodeAccum, AnomaAccum, Deci, Sd, f, Jd) => { // 一日中的時刻，距冬至日及分，入轉日，地理緯度，公元年
    const ConstWestFunc = constModern(Jd)
    const Solar = ConstWestFunc.Solar
    f = d2r(f)
    const SunWestFunc = SunAcrVWest(Sd, Jd)
    let Lon = (SunWestFunc.Lon) % Solar // 黃經
    let SunV = SunWestFunc.SunAcrV
    let MoonV = MoonAcrVWest(AnomaAccum, Jd).MoonAcrVd
    SunV *= 360 / Solar
    MoonV *= 360 / Solar
    const d = HighLon2FlatLatWest(Lon, Solar, Jd).d // 赤緯radius
    const h = (Deci - .5) * 360 // 時角
    const a = hourA2ElevatA(h, d, f) // 太陽高度
    const e = d2r(ConstWestFunc.e) // 黃赤交角degree
    const H0 = big(.9507) // 假設是月亮地平視差57' // 月亮地平視差曲安京《數》頁413
    Lon = d2r(big(Lon).mul(360).div(Solar)).add(pi.mul(1.5)).mod(pi.mul(2)) //.toNumber()
    // const tanC = Lon.cos().mul(e.tan()).pow(-1) //.toNumber() // C星位角與赤經圈夾角
    // const sinC1 = h.sin().mul(f.cos()).mul(z0.div(90).asin()) //.toNumber() // C1星位角與黃道夾角
    // const F = tanC.atan().sub(sinC1.asin())
    // const Tcorr = H0.mul(d2r(z0).sin().mul(F.cos())).div(MoonV - SunV).toNumber()
    const k0 = H0.mul(f.cos()).div(MoonV - SunV) //.toNumber()
    const tmp = e.sub(e.mul(Lon.mod(pi.div(2))).div(pi.div(2)))
    const Tcorr0 = k0.mul(h.sin()) // 冬夏至點的特殊情況
    const Tcorr = Tcorr0.mul(tmp.cos()).add(k0.mul(Lon.add(pi.mul(.5)).cos())) // +k0cosl很奇怪，我自己加270度才湊出來的，實在不行就用Tcorr0
    const I = d2r(5.1453) // 黃白大距
    const k1 = H0.div(I.sin()).mul(f.sin()).mul(e.cos()) // 一個常數
    const k2 = H0.mul(f.cos()).mul(e.sin()).div(I.sin()) //.toNumber()
    const tmp1 = h.sin().mul(Lon.cos()).neg().sub(h.cos().mul(Lon.sin())) // 我這符號取了個負，要不然對不上
    const Mcorr = k1.add(k2.mul(tmp1))
    return {
        Tcorr: Tcorr.toNumber(),
        Tcorr0: Tcorr0.toNumber(),
        Mcorr: Mcorr.toNumber()
    }
}
// console.log(EcliWest(.5, 360, 8, 35, 1000))

// 潮汐計算 http://blog.sciencenet.cn/blog-684007-733958.html
// const Tide = u => {
//     // const M = big(5.9722).mul(big(10).pow(24)) // 地球質量kg
//     // const m1=big(7.3477).mul(big(10).pow(22)) // 月球質量
//     // const m2=big(1.9885).mul(big(10).pow(30)) // 太陽質量
//     const M = 597.22
//     const m1 = 7.3477
//     const m2 = 198855000
//     const R=6371 // 地球半徑km
//     const D1=384401 // 月地距離
//     const D2=149597870 // 日地距離
//     const h1 = big(m1).mul(big(R).pow(4)).div(big(M).mul(2).mul(big(D1).pow(3))).mul(big(d2r(2 * u).add(1))).mul(1000).toFixed(4)
//     const h2 = big(m2).mul(big(R).pow(4)).div(big(M).mul(2).mul(big(D2).pow(3))).mul(big(d2r(2 * u).add(1))).mul(1000).toFixed(4)
//     return {
//         h1,
//         h2
//     }
// }
// https://newgoodlooking.pixnet.net/blog/post/113829993
// console.log(Tide(120))
