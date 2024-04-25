import { multiply, divide, add } from "mathjs";
import { precessionMx } from "./precession.mjs";
import { nutaMx } from "./nutation.mjs";
import { MansNameList } from "../parameter/constants.mjs";
import { Fbmx, rr1, xyz2lonlat } from "../astronomy/pos_functions.mjs";
import { Parsec, R2D, cDay } from "../parameter/functions.mjs";
import { calXV_vsop } from "./vsop_elp.mjs";
import { equa2Cec } from "../astronomy/pos_convert_modern.mjs";
import { siderealTime } from "../time/sidereal_time.mjs";
import { lonEqua2Cwh } from "../astronomy/pos_convert_modern.mjs";
import { LonFlat2High } from "../astronomy/pos_convert.mjs";
// [AT-HYG Subset v2.4](https://astronexus.com/hyg/) parsec
// 由AT-HYG算出來的數據和廖育棟的有點點區別。以下直接取自廖育棟的starCharts/brightStars.js
// 獲取brightStars.js信息的代碼
// function getInfoByName(arr, name) {
//     const item = arr.find(obj => obj.hip == name);
//     if (item && 'vx' in item && 'vy' in item && 'vz' in item) {
//         return [item.vx, item.vy, item.vz];
//     }
//     return null;
// }
// function getInfoForNames(data, names) {
//     return names.map(name => getInfoByName(data, name)).filter(info => info !== null);
// }
// const names = [92041, 100345, 102618, 106278, 109074, 113963, 1067, 4463, 8903, 12719, 17499, 20889, 26207, 29426, 30343, 41822, 42313, 46390, 52943, 53740, 59803, 65474, 69427, 72622, 78265, 80112, 82514, 88635]
// const results = getInfoForNames(List, names);
// // console.log(results);

// 從角開始
const PosList = [
    [-69.99084364894061, -27.28582512049931, -14.82175802302408],
    [-64.30650629231958, -42.11938421937712, -13.93364081840597],
    [-16.40887294594048, -15.15209393541715, -6.421989269399122],
    [-81.30152180198797, -139.2032275629476, -79.0233755984842],
    [-69.33263433865635, -120.492158817456, -57.92847628697942],
    [-80.53622103528672, -175.0753824051962, -92.3017804382437],
    [-45.96002047572168, -119.5468286481695, -68.72049140886905],
    [-35.43292978575936, -115.6622120034046, -94.67170040364189],
    [-8.785099173369078, -114.748091388404, -93.2928565799255],
    [0.6489746026678835, -25.6021104262935, -15.03997252939531],
    [3.817212661238929, -36.05793943337306, -24.81305096533027],
    [12.93788431617822, -64.08339061620123, -33.2976714848435],
    [6.326230040652385, -22.57738868441583, -13.4717654457595],
    [55.92025191683849, -79.11709130716685, -25.56426116301318],
    [41.96974671048129, -46.74491405588834, -10.50796000447551],
    [130.7592315400537, -98.92929922154872, -15.99375977523479],
    [43.81822238221578, -38.14976514853701, 5.33630246370596],
    [140.987629744526, -76.72223361660298, -0.8960540496215159],
    [24.96390731954687, -12.96774809534005, 3.054955470523145],
    [38.31146667917681, -9.417134378285294, 10.72273130324744],
    [115.6641488077358, 6.687320220516069, 31.44211718142119],
    [25.97466674229986, 0.9510237282489385, 14.46131650766171],
    [51.75521010594903, 10.84495556451726, 23.83943763709033],
    [62.61922645546277, 15.96339132884417, 27.98805319509834],
    [46.94640168105052, 14.74173541899818, 35.25513260970254],
    [14.75265403534917, 8.063468131174545, 6.389169583821384],
    [70.4057525830597, 60.90777176212588, 48.89091529554102],
    [33.2875937947042, 30.49812944836423, 23.26241353233986],
    [62.9655846514536, 94.1240183627286, 50.68772185651433],
    [61.66446997849043, 94.48906322658902, 50.48359972499495],
    [16.48833103143964, 39.13649009710043, 14.7726564529615],
    [7.027054094008122, 18.28716670748488, 5.80652278153978],
    [35.90747100954619, 329.7024807146378, 58.08631298681738],
    [36.04815216420688, 326.7896115633587, 54.95606780606953],
    [18.91847443267391, 224.8092488987091, -7.651869294397376],
    [25.86809945064331, 210.7295247770825, -1.108304866279148],
    [3.189293002761294, 151.3642003700023, 19.68211807027707],
    [-6.562057483521148, 65.28099168767618, 27.19476863564972],
    [-5.266181060854978, 31.71449860608129, 9.461435494107656],
    [-74.28649731901778, 95.42904731425322, 39.51449793449976],
    [-31.0607706595566, 37.79513314028643, 4.886204926366674],
    [-43.00349678310445, 33.7228700978394, -8.322094053168033],
    [-66.0717681418883, 46.32583261103903, -1.609724693401768],
    [-66.22714077088219, 41.59326122306379, -20.7307371637801],
    [-63.0223948099883, 27.37333075675344, -20.79239456977805],
    [-44.74568385872141, 12.03673851905569, -15.32319811035672],
    [-54.19944912012065, 9.717640118530976, -14.52640118412574],
    [-44.80597024408861, -3.095075978635876, -14.19707665022337],
];
// parsec/jucen
const VelList = [
    [-0.0004432641666602483, 0.001488504062741034, -0.001175400711746651],
    [-0.0002946970701520448, -0.000551213297846681, 0.005320035143625381],
    [0.002753693560073549, 0.004100501830151603, 0.0005726671580148358],
    [-0.000174148249968426, 0.001561434588636141, -0.001874318569693633],
    [0.0003399614683612274, 0.001762427001163749, -0.002211572475569469],
    [-0.0006297937066863495, 0.0008732259177464006, -0.001817057303049982],
    [-0.0002935361753742603, 0.00072286704233886, -0.001493812528078587],
    [0.0003844614780666319, 0.003024929523568705, 0.0003090035490314214],
    [-0.000187927533506398, 0.002288885670951839, -0.0005239017453505468],
    [-0.0006763606321924803, -0.0006338496127018098, -0.003393295157874852],
    [-0.0009828175008670724, 0.002669666984219932, -0.001314325171253529],
    [0.001987358174001414, -0.001651531840863944, -0.001006877951826018],
    [0.0003784805868388938, -0.001944790252935021, -0.001079298817304954],
    [0.0008729554788281654, 0.002705307073522567, 0.001153351649518809],
    [-0.0004757252951783433, 0.001983670397836711, -0.0008057773035272952],
    [0.001619844963742981, 0.001046193528471354, -0.0006021051126173813],
    [0.00005798372729811032, 0.002176492863601599, -0.002806656735006951],
    [0.001380661088762945, 0.0008345073515131694, -0.0007772998658940938],
    [0.001018831491782147, 0.003804104651537136, 0.0003386981740170084],
    [0.0001104566495026185, 0.001176284483207604, -0.000921330993752971],
    [0.0005043058158166923, 0.0002935934462675175, -0.0003556896711112811],
    [0.000007404234871160714, 0.001711162673865015, -0.002650061979776061],
    [-0.0007314758212314792, -0.002804830357518742, -0.003108163868464054],
    [0.00003459036269798711, -0.001404720115953728, -0.001849498852906611],
    [0.0005117513928546984, 0.004551236303310069, -0.002725010602567852],
    [-0.0004163693461479368, 0.0006671395988501557, -0.001032143952272725],
    [0.000965271142094891, 0.001044526135470552, 0.0001681818084410349],
    [0.0002695988683400293, 0.002190493411703654, -0.002364499894167507],
    [0.0002532266708006074, 0.002506391687867209, -0.001964802414238733],
    [0.000200430197889882, 0.002243867599372559, -0.001940502120082965],
    [-0.0004697127033879341, 0.00457150146535777, 0.0005533637716990637],
    [0.001551450425701776, 0.005699856420689361, -0.000214614260102587],
    [0.0005411396242705155, 0.003439093383000465, 0.0003008092511608548],
    [0.0005687120406176199, 0.00335296744788841, 0.0001595332661904482],
    [-0.0002798001273640856, 0.00187932926292464, 0.0002154128107830373],
    [0.00002879142820684521, 0.001645368595224311, 0.00004909970305075131],
    [-0.001962887203104632, 0.002067954153517881, 0.001073997241979945],
    [-0.002462099554919327, 0.00641648920930734, -0.001306664232313298],
    [0.0001900087048456709, -0.0009501832635793552, -0.001418388998930314],
    [-0.0005738308157418808, 0.006468794560472846, -0.001883267806116203],
    [0.0005663481127942027, 0.001935801226593018, -0.00005397814541153993],
    [0.0004495771409597155, 0.0001353195092450282, 0.0009425340752507662],
    [-0.002959187529654492, -0.0002095339152626059, -0.002508449897653321],
    [0.001065282251431106, -0.00150538459095209, -0.0004365003059370318],
    [-0.00114568175453257, 0.005164879494321312, -0.003851804338673808],
    [-0.002634919508585381, 0.01146543112367223, 0.001391207006981141],
    [-0.0003591447830702968, 0.003440184813673738, 0.00564602532745666],
    [-0.000003514929185211585, 0.003482782239018817, 0.0006090845770401577],
];
const ShangguList = [
    0, 1, 2, 4, 6, 8, 10, 12, 13, 14, 16, 18, 19, 21, 24, 25, 27, 28, 31, 33, 36,
    38, 39, 40, 42, 44, 46, 47,
];
const ShiList = [
    0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 17, 19, 20, 22, 25, 26, 28, 30, 33, 35,
    37, 39, 40, 41, 43, 45, 47,
];
const ChongzhenList = [
    0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 17, 19, 20, 23, 25, 26, 29, 30, 32, 34,
    37, 39, 40, 41, 43, 45, 47,
];
const XinfaList = [
    0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 17, 19, 20, 22, 25, 26, 28, 30, 33, 34,
    37, 39, 40, 41, 43, 45, 47,
];
const LingtaiList = [
    0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 17, 19, 20, 23, 25, 26, 29, 30, 32, 35,
    37, 39, 40, 41, 43, 45, 47,
];
const YixiangList = [
    0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 15, 17, 19, 20, 23, 25, 26, 28, 30, 32, 34,
    37, 39, 40, 41, 43, 45, 47,
];
const ShangguPosList = ShangguList.map((index) => PosList[index]);
const ShangguVelList = ShangguList.map((index) => VelList[index]);
const ShiPosList = ShiList.map((index) => PosList[index]);
const ShiVelList = ShiList.map((index) => VelList[index]);
const ChongzhenPosList = ChongzhenList.map((index) => PosList[index]);
const ChongzhenVelList = ChongzhenList.map((index) => VelList[index]);
const XinfaPosList = XinfaList.map((index) => PosList[index]);
const XinfaVelList = XinfaList.map((index) => VelList[index]);
const LingtaiPosList = LingtaiList.map((index) => PosList[index]);
const LingtaiVelList = LingtaiList.map((index) => VelList[index]);
const YixiangPosList = YixiangList.map((index) => PosList[index]);
const YixiangVelList = YixiangList.map((index) => VelList[index]);

// 與古曆的deg2Mans區別在於現代的不從角0起算，直接給出每宿經度
export const deg2MansModern = (Deg, AccumObj, fixed) => {
    const SortedList = Object.entries(AccumObj).sort((a, b) => a[1] - b[1]);
    let index = -1;
    let Solsindex = -1;
    for (let i = SortedList.length - 1; i >= 0; i--) {
        if (Deg >= SortedList[i][1]) {
            index = i;
            break;
        }
    }
    if (Deg < SortedList[0][1]) index = SortedList.length - 1;
    if (index === -1) throw new Error("未找到所在宿度");
    const Name = SortedList[index][0];
    const MansDeg = (Deg - SortedList[index][1] + 360) % 360;
    // 冬至日躔：其實應該每年都一樣，不過這裡直接是黃經270的宿度
    for (let i = SortedList.length - 1; i >= 0; i--) {
        if (SortedList[i][1] <= 270) {
            Solsindex = i;
            break;
        }
    }
    const SolsMans =
        SortedList[Solsindex][0] +
        (270 - SortedList[Solsindex][1]).toFixed(fixed || 6);
    return { Mans: Name + MansDeg.toFixed(fixed || 3), SolsMans };
};

//根據廖育棟文檔14.3 14.4 
export const mansModernList = (Jd, Name) => {
    Name = Name || "Shi";
    let PosList, VelList
    if (Name === "Shanggu") {
        PosList = ShangguPosList
        VelList = ShangguVelList
    } else if (Name === "Shi") {
        PosList = ShiPosList
        VelList = ShiVelList
    } else if (Name === "Chongzhen") {
        PosList = ChongzhenPosList
        VelList = ChongzhenVelList
    } else if (Name === "Xinfa") {
        PosList = XinfaPosList
        VelList = XinfaVelList
    } else if (Name === "Lingtai") {
        PosList = LingtaiPosList
        VelList = LingtaiVelList
    } else if (Name === "Yixiang") {
        PosList = YixiangPosList
        VelList = YixiangVelList
    }
    const EclpAccumList = {};
    const EquaAccumList = {};
    const CecAccumList = {};
    const CwhAccumList = {};
    const T = (Jd - 2451545) / 36525;
    const { N, Obliq } = nutaMx(T);
    const NP = multiply(precessionMx(T), N);
    const NPB = multiply(NP, Fbmx);
    const { X: XSEclpRaw, V: VSEclpRaw } = calXV_vsop("Sun", Jd); // VSOP算出來的是黃道。算太陽的目的是計算視差
    const XSRaw = multiply(rr1(-Obliq), XSEclpRaw);
    const XS = multiply(NPB, XSRaw);
    const VSRaw = multiply(rr1(-Obliq), VSEclpRaw);
    const VE = multiply(multiply(NP, VSRaw), -1);
    const Beta = divide(VE, cDay);
    const { WhEqLon, WhEqObliq } = lonEqua2Cwh(Jd) // 白赤交點赤經，算九道用的
    const tmp = 360 - LonFlat2High(WhEqObliq, (360 - WhEqLon) % 360) // 白道度CwhLon是從白赤交點起算，所以要根據白赤交點的赤經，歸算出應該加上的度數
    for (let i = 0; i < 28; i++) {
        const XSRawParsec = divide(XSRaw, Parsec);
        const X00 = add(
            PosList[i],
            multiply(T, VelList[i]),
        );
        const X01 = add(X00, XSRawParsec); // =r-rE=r+rS 視差修正之後
        const X02 = multiply(NP, X01); // 歲差章動變化之後
        // 計算太陽所在宿度需要考慮週日光行差嗎？加上的話就是 (Beta=NPVE+Vspin)/c
        const X02mod = Math.hypot(...X02.toArray());
        const n = divide(X02, X02mod); // 單位向量
        const n_B = add(n, Beta).toArray();
        const n1 = divide(n_B, Math.hypot(...n_B));
        const XEqua = multiply(n1, X02mod); // 光行差修正之後
        const XEclp = multiply(rr1(Obliq), XEqua).toArray(); // 乘法順序不能變！
        const EquaLon = (xyz2lonlat(XEqua).Lon * R2D + 360) % 360;
        EquaAccumList[MansNameList[i]] = EquaLon
        EclpAccumList[MansNameList[i]] = (xyz2lonlat(XEclp).Lon * R2D + 360) % 360;
        CecAccumList[MansNameList[i]] = equa2Cec(Obliq * R2D, EquaLon, 0).CecLon
        CwhAccumList[MansNameList[i]] = (lonEqua2Cwh(Jd, EquaLon).CwhLon + tmp) % 360
    }
    return {
        EclpAccumList,
        EquaAccumList,
        CecAccumList,
        CwhAccumList,
        XS,
        Obliq
    };
};

export const mansModern = (Jd, Name) => {
    Name = Name || "Shi";
    const { EclpAccumList, EquaAccumList, CecAccumList, CwhAccumList, XS, Obliq } = mansModernList(Jd, Name)
    const XSEclp = multiply(rr1(Obliq), XS); // 乘法順序不能變！！要不然transpose()也沒用
    const SunEclpLon = (xyz2lonlat(XSEclp.toArray()).Lon * R2D + 360) % 360;
    const SunEquaLon = (xyz2lonlat(XS.toArray()).Lon * R2D + 360) % 360;
    const SunCecLon = equa2Cec(Obliq * R2D, SunEquaLon, 0).CecLon
    const SunCwhLon = lonEqua2Cwh(Jd, SunEquaLon).CwhLon
    const { Mans: Eclp, SolsMans: SolsEclpMans } = deg2MansModern(
        SunEclpLon,
        EclpAccumList
    );
    const { Mans: Equa, SolsMans: SolsEquaMans } = deg2MansModern(
        SunEquaLon,
        EquaAccumList
    );
    const { Mans: Cec, SolsMans: SolsCecMans } = deg2MansModern(
        SunCecLon,
        CecAccumList
    );
    const { Mans: Cwh, SolsMans: SolsCwhMans } = deg2MansModern(
        SunCwhLon,
        CwhAccumList
    );
    return {
        Eclp,
        Equa,
        Cec,
        Cwh,
        EclpAccumList,
        EquaAccumList,
        CecAccumList,
        CwhAccumList,
        SolsEclpMans,
        SolsEquaMans,
        SolsCecMans,
        SolsCwhMans
    };
};
// const S = performance.now()
// console.log(mansModern(2288579, 'Shi'))
// const E = performance.now()
// console.log(E - S) // 算一個7ms


// const DistRaDec = [
//     [73.3676, 4.91160279727379, -0.471077925259674], // 角
//     [100.2004, 5.32766641880663, -0.257984226739332],
//     [63.6943, 5.44401298043882, -0.16573256319833],
//     [167.4261, 5.63548890293603, -0.09723529448381],
//     [202.2185, 5.78482368488571, -0.00558242321428733],
//     [40.8831, 6.04215917029935, 0.26538192013172],
//     [143.9383, 0.057752421283725, 0.26500374218983],
//     [79.6028, 0.249611162553299, 0.408715126528552], // 斗
//     [17.9856, 0.50021171211585, 0.363168721205238],
//     [189.1228, 0.713193611302155, 0.483580996956567],
//     [119.8224, 0.981204992994713, 0.420857158718658],
//     [44.712, 1.17206122063375, 0.334761699048072],
//     [336.7003, 1.46231516206411, 0.173383701959763],
//     [221.0694, 1.62289414131311, 0.247989740684475],
//     [71.0227, 1.67097988201279, 0.392936201681905], // 奎
//     [132.316, 2.23225646357863, 0.315807190740683],
//     [54.259, 2.2587009532277, 0.0995498213298614],
//     [55.2792, 2.47656723573261, -0.151121107238433],
//     [42.0274, 2.83452265061411, -0.28263247518604],
//     [47.1032, 3.21056029524484, -0.306164417851233], // 參
//     [48.8043, 2.87880896748883, -0.319374041938158], // 觜
//     [76.5697, 3.51331902158728, -0.194800472078366], // 井
//     [86.2979, 3.72145977885982, -0.179309898138567],
//     [23.2396, 3.88719100670674, -0.279981825502641],
//     [103.3774, 4.18378066872019, -0.455777112940713],
//     [213.6752, 4.28124265878429, -0.446678738962132],
//     [153.6098, 4.41511812668824, -0.66405205199865],
//     [29.7, 4.73773163218489, -0.531000691565575],
// ];
// const genXYZ = (DistRaDec) => {
//     const X = [];
//     for (let i = 0; i < 28; i++) {
//         X[i] = [];
//         const D = DistRaDec[i][0];
//         const Ra = DistRaDec[i][1];
//         const Dec = DistRaDec[i][2];
//         X[i][0] = D * Math.cos(Ra) * Math.cos(Dec);
//         X[i][1] = D * Math.sin(Ra) * Math.cos(Dec);
//         X[i][2] = D * Math.sin(Dec);
//     }
//     return X;
// };


/**
 * 上中天的星宿
 * @param {*} Jd TT
 * @param {*} Longitude 地理經度
 * @param {*} EquaAccumList 赤道宿度表
 * @returns 
 */
export const midstarModern = (Jd, Longitude, EquaAccumList) => {
    const LAST = siderealTime(Jd, Longitude) // 晨昏恆星時
    return deg2MansModern(LAST * 15, EquaAccumList, 2).Mans
}