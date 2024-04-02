import {
    transpose,
    multiply,
    subtract,
    divide,
} from "mathjs";
import { deltaT } from "../time/delta-t.mjs";
import { precessionMx } from "../modern/precession.mjs";
import { nutaMx } from "../modern/nutation.mjs";
import { vsop87XV } from "../modern/vsop.mjs";
import { elp2000 } from "../modern/elp2000.mjs";
import {
    Fbmx,
    lightAber,
    lightTimeCorr,
    radialV,
    xyz2lonlat,
    rr1
} from "../astronomy/pos_functions.mjs";
import { D2R, R2D, cDay, pi2 } from "../parameter/functions.mjs";
import { FlatLon2FlatLat, Lat2NS, LonFlat2High, deg2Hms } from "../astronomy/pos_convert.mjs";

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
// 計算位置、速度
export const calXV_vsop = (Planet, Jd) => {
    let X = [];
    let V = [];
    if (Planet === "Moon") {
        X = elp2000(Jd);
        V = multiply(subtract(X, elp2000(Jd - 0.000001157407407)), 864000); // 用0.1秒的路程來近似
    } else if (Planet === "Sun") {
        const Func = vsop87XV("Earth", Jd);
        X = multiply(Func.X, -1);
        V = multiply(Func.V, -1);
    } else if (Planet === "Earth") return;
    else {
        const { X: XEarth, V: VEarth } = vsop87XV("Earth", Jd);
        const { X: XTarget, V: VTarget } = vsop87XV(Planet, Jd);
        X = subtract(XTarget, XEarth);
        V = subtract(VTarget, VEarth);
    }
    // return { X: [[X[0]], [X[1]], [X[2]]], V: [[V[0]], [V[1]], [V[2]]] } // 返回GCRS位置、速度
    return { X, V };
};
// console.log(calXV_vsop('Mercury', 2424111))

/**
 * 計算瞬時地心視黃經黃緯。在需要黃經導數的時候用calPos1，不需要的時候用calPos。注意：分析曆表的位置都是黃道座標，DE曆表是赤道座標
 * Xeq = N(t)P(t)X2000 = N(t)P(t)B·XICRS
 * Xec = R1(ε(t))Xeq = R1(ε(t))N(t)P(t)B·XICRS
 * Xeq = R1(-Ep)Xec
    // 廖育棟：計算瞬時黃道可以簡化，不計算黃赤交角章動
    // | cos∆ψ    −sin∆ψcosεA  −sin∆ψsinεA |
    // | sin∆ψ    cos∆ψcosεA    cos∆ψsinεA |
    // | 0        −sinεA        cosεA |
    // const CPs = Math.cos(DeltaPsi)
    // const SPs = Math.sin(DeltaPsi)
    // const CEpA = Math.cos(ObliqAvg)
    // const SEpA = Math.sin(ObliqAvg)
    // const R1EpsN = matrix([
    //     [CPs, -SPs * CEpA, -SPs * SEpA],
    //     [SPs, CPs * CEpA, CPs * SEpA],
    //     [0, -SEpA, CEpA]
    // ])
    // const R1EpsN = multiply(rr3(-DeltaPsi), rr1(ObliqAvg))    
    // const tmp = chain(R1EpsN).multiply(P).multiply(Fbmx).done()
 * @param {*} Planet 
 * @param {*} Jd 
 * @returns 
 */
export const calPos_vsop = (Planet, Jd) => {
    const T = (Jd - 2451545) / 36525; // 儒略世紀
    const { X: Xreal, V: Vreal } = calXV_vsop(Planet, Jd); // 實際位置
    const Jdr = lightTimeCorr(Jd, Xreal); // 推遲時
    const X = lightAber(Xreal, Vreal); // 光行差修正後的位置。這樣精確的算法和近似公式其實幾乎沒有區別，只相差5e-12rad
    const { V: Vraw } = calXV_vsop(Planet, Jdr); // 視位置
    const RadialV = radialV(X, Vraw);
    const V = divide(Vraw, 1 + RadialV / cDay);
    const X2000 = multiply(Fbmx, X);
    const V2000 = multiply(Fbmx, V);
    // const { Lon: LonRaw } = xyz2lonlat(X) //  1024-3-15 2:37,VSOP的LonRaw是13°34′49″，DE441是12.48，一個黃道一個赤道
    const { N, Obliq } = nutaMx(T);
    const P = precessionMx(T); // 歲差矩陣 P(t)
    const NP = multiply(N, P);
    const R1Eps = rr1(Obliq);
    // ⚠️分析曆表的座標是黃道，所以必須要先轉成赤道，與廖育棟文檔上的順序不太相同。排查了一個下午終於找到問題了
    const Equa = multiply(NP, multiply(transpose(R1Eps), X2000)).toArray();
    const Equa1 = multiply(NP, multiply(transpose(R1Eps), V2000)).toArray();
    const Eclp = multiply(R1Eps, Equa).toArray();
    const Eclp1 = multiply(R1Eps, Equa1).toArray();
    // X=[x, y, z]. Lon=atan2(y, x). derivativeLon =(xy'-yx')/(x^2+y^2). 欲求x', y', 求 X' ≈ R1(Ep t)N(t)P(t)Fbmx[v(tr)-vE(tr)]
    const Lon1 =
        (Eclp[0] * Eclp1[1] - Eclp[1] * Eclp1[0]) / (Eclp[0] ** 2 + Eclp[1] ** 2); // 經度的時間導數
    let { Lon: EquaLon, Lat: EquaLat } = xyz2lonlat(Equa);
    EquaLon = (EquaLon + pi2) % pi2;
    let { Lon, Lat } = xyz2lonlat(Eclp);
    Lon = (Lon + pi2) % pi2;
    return { EquaLon, EquaLat, Lon, Lat, Lon1 };
};
// console.log(calPos_vsop('Sun', 2095178.05080473))
// const startTime = performance.now();
// console.log(calPos_vsop('Sun', 2433323))
// const endTime = performance.now();
// console.log(endTime - startTime) // 4.2ms一次

const PlanetList = ['Sun', 'Moon', 'Saturn', 'Jupiter', 'Mars', 'Venus', 'Mercury']
// 一次性輸出七政位置
export const bindPos_vsop = Jd => {
    const T = (Jd - 2451545) / 36525; // 儒略世紀
    const { N, Obliq } = nutaMx(T);
    const P = precessionMx(T); // 歲差矩陣 P(t)
    const NP = multiply(N, P);
    const R1Eps = rr1(Obliq);
    const EquaLon = [], EquaLat = [], EclpLon = [], EclpLat = [], CeclpLon = [], CeclpLat = []
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
        const Eclp = multiply(R1Eps, Equa).toArray();
        // const Eclp1 = multiply(R1Eps, Equa1).toArray();
        const { Lon: EquaLontmp, Lat: EquaLattmp } = xyz2lonlat(Equa);
        EquaLon[i] = (EquaLontmp + pi2) % pi2;
        EquaLat[i] = EquaLattmp
        const { Lon: Lontmp, Lat: Lattmp } = xyz2lonlat(Eclp);
        EclpLon[i] = (Lontmp + pi2) % pi2;
        EclpLat[i] = Lattmp
        const { CeclpLon: CeclpLontmp, CeclpLat: CeclpLattmp } = equa2Ceclp(Obliq, EquaLon[i], EquaLat[i])
        CeclpLon[i] = CeclpLontmp // deg
        CeclpLat[i] = CeclpLattmp
    }
    return { EquaLon, EquaLat, EclpLon, EclpLat, CeclpLon, CeclpLat }
}

export const bindPos_vsop_Print = (Jd_UT1, Longitude) => {
    Jd_UT1 = +Jd_UT1 - +Longitude / 360 // 0時區
    const Jd = Jd_UT1 + deltaT(Jd_UT1) // TT
    const { EquaLon, EquaLat, EclpLon, EclpLat, CeclpLon, CeclpLat } = bindPos_vsop(Jd)
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
                Lat2NS(EclpLat[i] * R2D)
            ]
        }
    }
    return Print
}
// console.log(bindPos_vsop_Print(2432111))