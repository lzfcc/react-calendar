import { pi, D2R, R2D } from '../parameter/constant.mjs'
import { FlatLon2FlatLat, Gong2Lon, GongFlat2High, GongHigh2Flat, HighLon2FlatLat, Lon2Gong, LonFlat2High, LonHigh2Flat, aCb_Sph } from '../newmoon/main_shixian.mjs'
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
