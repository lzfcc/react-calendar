import {
    transpose,
    multiply,
} from "mathjs";
import { deltaT } from "../time/delta-t.mjs";
import { precessionMx } from "../modern/precession.mjs";
import { nutaMx } from "../modern/nutation.mjs";
import {
    Fbmx,
    lightAber,
    xyz2lonlat,
    rr1
} from "../astronomy/pos_functions.mjs";
import { R2D, pi2 } from "../parameter/functions.mjs";
import { FlatLon2FlatLat, Lat2NS, LonFlat2High, deg2Hms } from "../astronomy/pos_convert.mjs";
import { horizontal } from "../astronomy/pos_convert_modern.mjs";
import { calXV_vsop } from "./vsop_elp.mjs";
import { PlanetList } from "Cal/parameter/constants.mjs";

// 這單獨放一個為了避免循環依賴
const equa2Ceclp = (Sobliq, EquaLon, EquaLat) => {
    Sobliq *= R2D
    EquaLon *= R2D
    EquaLat *= R2D
    return {
        CeclpLon: LonFlat2High(Sobliq, EquaLon),
        CeclpLat: (EquaLat - FlatLon2FlatLat(Sobliq, EquaLon)),
    };
};

// 一次性輸出七政位置 ⚠️ 轉換爲 topocentric，不是geocentric
export const bindTopo_vsop = (Jd, Longitude, Latitude, h) => {
    const T = (Jd - 2451545) / 36525; // 儒略世紀
    const { N, Obliq } = nutaMx(T);
    const P = precessionMx(T); // 歲差矩陣 P(t)
    const NP = multiply(N, P);
    const R1Eps = rr1(Obliq);
    const EquaLon = [], EquaLat = [], EclpLon = [], EclpLat = [], CeclpLon = [], CeclpLat = [], HoriLon = [], HoriLat = []
    for (let i = 0; i < PlanetList.length; i++) {
        const { X: Xreal, V: Vreal } = calXV_vsop(PlanetList[i], Jd); // 實際位置    
        // const Jdr = lightTimeCorr(Jd, Xreal); // 推遲時
        const X = lightAber(Xreal, Vreal); // 光行差修正後的位置。這樣精確的算法和近似公式其實幾乎沒有區別，只相差5e-12rad
        // const { V: Vraw } = calXV_vsop(PlanetList[i], Jdr); // 視位置
        // const RadialV = radialV(X, Vraw);
        // const V = divide(Vraw, 1 + RadialV / cDay);
        const X2000 = multiply(Fbmx, X);
        // const V2000 = multiply(Fbmx, V);
        const Equa = multiply(NP, multiply(transpose(R1Eps), X2000)).toArray();
        // const Equa1 = multiply(NP, multiply(transpose(R1Eps), V2000)).toArray();        
        // const Eclp1 = multiply(R1Eps, Equa1).toArray();
        const { TopoLon: EquaLonTmp, TopoLat: EquaLatTmp, HoriLon: HoriLonTmp, HoriLat: HoriLatTmp, X1 } = horizontal(Equa, Jd, Longitude, Latitude, h)
        EquaLon[i] = (EquaLonTmp + pi2) % pi2;
        EquaLat[i] = EquaLatTmp
        HoriLon[i] = HoriLonTmp
        HoriLat[i] = HoriLatTmp
        const Eclp = multiply(R1Eps, X1).toArray();
        const { Lon: LonTmp, Lat: LatTmp } = xyz2lonlat(Eclp)
        EclpLon[i] = (LonTmp + pi2) % pi2;
        EclpLat[i] = LatTmp
        const { CeclpLon: CeclpLonTmp, CeclpLat: CeclpLatTmp } = equa2Ceclp(Obliq, EquaLon[i], EquaLat[i])
        CeclpLon[i] = CeclpLonTmp // deg
        CeclpLat[i] = CeclpLatTmp
    }
    return { EquaLon, EquaLat, EclpLon, EclpLat, CeclpLon, CeclpLat, HoriLon, HoriLat, Obliq }
}
/**
 * 
 * @param {*} Jd_UT10 0時區UT1
 * @param {*} Longitude 
 * @param {*} Latitude 
 * @param {*} h 
 * @returns 
 */
export const bindPos_vsop_Print = (Jd_UT10, Longitude, Latitude, h) => {
    Longitude = +Longitude
    Latitude = +Latitude
    h = +h
    Jd_UT10 = +Jd_UT10
    const Jd = Jd_UT10 + deltaT(Jd_UT10) // TT
    const { EquaLon, EquaLat, EclpLon, EclpLat, CeclpLon, CeclpLat, HoriLon, HoriLat } = bindTopo_vsop(Jd, Longitude, Latitude, h)
    const Print = []
    for (let i = 0; i < PlanetList.length; i++) {
        Print[i] = {
            title: PlanetList[i],
            data: [
                deg2Hms(EquaLon[i] * R2D),
                Lat2NS(EquaLat[i] * R2D),
                deg2Hms(CeclpLon[i]), // deg
                Lat2NS(CeclpLat[i]),
                deg2Hms(EclpLon[i] * R2D),
                Lat2NS(EclpLat[i] * R2D),
                deg2Hms(HoriLon[i] * R2D),
                Lat2NS(HoriLat[i] * R2D)
            ]
        }
    }
    return Print
}
// console.log(bindPos_vsop_Print(2432111))
