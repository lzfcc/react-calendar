import { ScList } from '../parameter/constant.mjs'
import { deltaT } from '../time/delta-t.mjs'
import { Jd2Date, generateTimeString } from '../time/jd2date.mjs'
import NewmList from '../modern/newm_de44_list.mjs'
import SyzygyList from '../modern/syzygy_de44_list.mjs'
import TermList from '../modern/term_de44_list.mjs'
import Term1List from '../modern/term1_de44_list.mjs'
import { mansionModern } from '../modern/mansion.mjs'
// import { } from '../modern/mansion.mjs'
function findClosest(a, list) {
    let closest = list[0], closestIndex = 0;
    let smallestDifference = Math.abs(a - closest);
    for (let i = 1; i < list.length; i++) {
        let currentDifference = Math.abs(a - list[i]);
        if (currentDifference < smallestDifference) {
            smallestDifference = currentDifference;
            closest = list[i];
            closestIndex = i;
        }
    }
    return { closest, closestIndex };
}
// 安排DE曆表的朔望節氣
export const N6 = Y => {
    if (Y > 2499 || Y < -2499) throw (new Error('Year range of DE440/1: -2499 to 2499'))
    const EpoSolsJd = 2451534.749 // 取癸卯曆1999年12月22日平冬至時間儒略日
    const ChouConst = 15.68 // 採用癸卯曆首朔應，即十二月平朔距冬至的時間。與時憲曆用冬至次日夜半，我直接用冬至
    const CloseOriginAd = 2000
    const Solar = 365.2422, Lunar = 29.530588853
    const TermLeng = Solar / 12
    const OriginAccum = (Y - CloseOriginAd) * Solar // 中積
    const AvgSolsJd = EpoSolsJd + OriginAccum
    const AvgChouSd = (Lunar - OriginAccum % Lunar + ChouConst) % Lunar // 首朔
    const AvgChouJd = AvgChouSd + AvgSolsJd // 十二月朔
    const AvgChouSyzygySd = AvgChouSd + Lunar / 2 // 十二月望
    const AvgChouSyzygyJd = AvgChouSyzygySd + AvgSolsJd
    const AvgChouTermJd = AvgSolsJd + TermLeng * 2 // 大寒
    const AvgChouTerm1Jd = AvgSolsJd + TermLeng // 小寒
    const AcrChouJdIndex = findClosest(AvgChouJd, NewmList).closestIndex
    const AcrChouSyzygyJdIndex = findClosest(AvgChouSyzygyJd, SyzygyList).closestIndex
    const AcrChouTermJdIndex = findClosest(AvgChouTermJd, TermList).closestIndex
    const AcrChouTerm1JdIndex = findClosest(AvgChouTerm1Jd, Term1List).closestIndex
    const main = (isNewm, LeapNumTerm) => {
        const AcrJd = [], UT18Sc = [], UT18Mmdd = [], UT18Deci = [], NowDeci = [], Eclp = [], Equa = [], AcrTermJd = [], TermAcrSc = [], TermAcrMmdd = [], TermAcrDeci = [], TermEclp = [], TermEqua = [], Term1AcrSc = [], Term1AcrMmdd = [], Term1AcrDeci = [], Term1Eclp = [], Term1Equa = []
        for (let i = 0; i <= 14; i++) {
            //////// 平朔望   
            AcrJd[i] = isNewm ? NewmList[AcrChouJdIndex + i] : SyzygyList[AcrChouSyzygyJdIndex + i]
            const UT18Jd = AcrJd[i] - deltaT(AcrJd[i]) + 8 / 24
            const UT18JdDate = Jd2Date(UT18Jd)
            UT18Sc[i] = ScList[UT18JdDate.ScOrder]
            UT18Mmdd[i] = UT18JdDate.mm + '-' + UT18JdDate.dd
            UT18Deci[i] = generateTimeString(UT18JdDate.h, UT18JdDate.m, UT18JdDate.s, Y < 1600 ? '' : UT18JdDate.ms)
            //////// 節氣
            if (isNewm) {
                const NewmFunc = mansionModern(AcrJd[i])
                Eclp[i] = NewmFunc.Eclp
                Equa[i] = NewmFunc.Equa
                // 中氣
                AcrTermJd[i] = TermList[AcrChouTermJdIndex + i - 1]
                const UT18TermJd = AcrTermJd[i] + 8 / 24 - deltaT(AcrTermJd[i])
                const UT18TermJdDate = Jd2Date(UT18TermJd)
                TermAcrSc[i] = ScList[UT18TermJdDate.ScOrder]
                TermAcrMmdd[i] = UT18TermJdDate.mm + '-' + UT18TermJdDate.dd
                TermAcrDeci[i] = generateTimeString(UT18TermJdDate.h, UT18TermJdDate.m, UT18TermJdDate.s, Y < 1600 ? '' : UT18TermJdDate.ms)
                const TermFunc = mansionModern(AcrTermJd[i])
                TermEclp[i] = TermFunc.Eclp
                TermEqua[i] = TermFunc.Equa
                // 節氣
                const AcrTerm1Jd = Term1List[AcrChouTerm1JdIndex + i - 1]
                const UT18Term1Jd = AcrTerm1Jd + 8 / 24 - deltaT(AcrTerm1Jd)
                const UT18Term1JdDate = Jd2Date(UT18Term1Jd)
                Term1AcrSc[i] = ScList[UT18Term1JdDate.ScOrder]
                Term1AcrMmdd[i] = UT18Term1JdDate.mm + '-' + UT18Term1JdDate.dd
                Term1AcrDeci[i] = generateTimeString(UT18Term1JdDate.h, UT18Term1JdDate.m, UT18Term1JdDate.s, Y < 1600 ? '' : UT18Term1JdDate.ms)
                const Term1Func = mansionModern(AcrTerm1Jd)
                Term1Eclp[i] = Term1Func.Eclp
                Term1Equa[i] = Term1Func.Equa
            }
        }
        //////// 置閏
        LeapNumTerm = LeapNumTerm || 0
        if (isNewm) {
            for (let i = 1; i <= 12; i++) {
                if ((Math.trunc(AcrTermJd[i]) < Math.trunc(AcrJd[i + 1])) && (Math.trunc(AcrTermJd[i + 1]) >= Math.trunc(AcrJd[i + 2]))) {
                    LeapNumTerm = i // 閏Leap月，第Leap+1月爲閏月
                    break
                }
            }
        }
        return {
            AcrJd, UT18Sc, UT18Mmdd, UT18Deci, NowDeci, Eclp, Equa,
            TermAcrSc, TermAcrMmdd, TermAcrDeci, TermEclp, TermEqua,
            Term1AcrSc, Term1AcrMmdd, Term1AcrDeci, Term1Eclp, Term1Equa,
            LeapNumTerm
        }
    }
    const {
        AcrJd: NewmJd, UT18Sc: NewmSc, UT18Mmdd: NewmMmdd, UT18Deci: NewmDeci, Equa: NewmEqua, Eclp: NewmEclp,
        TermAcrSc, TermAcrMmdd, TermAcrDeci, TermEclp, TermEqua,
        Term1AcrSc, Term1AcrMmdd, Term1AcrDeci, Term1Eclp, Term1Equa, LeapNumTerm
    } = main(true)
    const {
        UT18Sc: SyzygySc, UT18Mmdd: SyzygyMmdd, UT18Deci: SyzygyDeci
    } = main(false, LeapNumTerm)
    return {
        NewmSc, NewmMmdd, NewmDeci, NewmEqua, NewmEclp,
        SyzygySc, SyzygyMmdd, SyzygyDeci,
        TermAcrSc, TermAcrMmdd, TermAcrDeci, TermEclp, TermEqua,
        Term1AcrSc, Term1AcrMmdd, Term1AcrDeci, Term1Eclp, Term1Equa, LeapNumTerm,
        //// 曆書用
        NewmJd, AvgSolsJd
    }
}
// console.log(N6(2024))
