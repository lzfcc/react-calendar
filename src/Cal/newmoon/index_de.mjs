import { N6 } from './newm_de.mjs'
import { TermNameList, Term1NameList, ScList, MonNumList1 } from '../parameter/constants.mjs'
import { deltaT, deltaTError } from '../time/delta-t.mjs'
// const Index = (YearStart, YearEnd, Longitude) => {
export default (YearStart, YearEnd, Longitude) => {
    const Memo = []
    const calculate = Y => {
        const [PrevYear, ThisYear] = Memo
        let { LeapNumTerm } = ThisYear
        const { NewmEqua, NewmEclp } = ThisYear
        const TermAcrSc = [], TermAcrMmdd = [], TermAcrDeci = [], TermNowDeci = [], Term1Name = [], Term1Equa = [], Term1Eclp = [], Term1AcrSc = [], Term1AcrMmdd = [], Term1AcrDeci = [], Term1NowDeci = []
        let TermName = [], TermEqua = [], TermEclp = [],
            NewmStart = 0
        let NewmEnd = LeapNumTerm ? 1 : 0
        let TermEnd = NewmEnd
        if (PrevYear.LeapNumTerm) {
            LeapNumTerm = 0 // 可能出現去年不閏而閏，於是今年正月和去年十二月重疊
            if ((PrevYear.NewmSc[13]) === ThisYear.NewmSc[1]) {
                NewmStart = 1
                NewmEnd = 1
                TermEnd = 0
            }
        }
        let TermStart = 0
        // 調整節氣
        for (let i = 1; i <= 13; i++) {
            TermName[i] = TermNameList[(i + 2) % 12]
            Term1Name[i] = Term1NameList[(i + 2) % 12]
            TermAcrSc[i] = ThisYear.TermAcrSc[i]
            TermAcrMmdd[i] = ThisYear.TermAcrMmdd[i]
            TermAcrDeci[i] = ThisYear.TermAcrDeci[i]
            Term1AcrSc[i] = ThisYear.Term1AcrSc[i]
            Term1AcrMmdd[i] = ThisYear.Term1AcrMmdd[i]
            Term1AcrDeci[i] = ThisYear.Term1AcrDeci[i]
            if (ThisYear.TermNowDeci) {
                TermNowDeci[i] = ThisYear.TermNowDeci[i]
                Term1NowDeci[i] = ThisYear.Term1NowDeci[i]
            }
            TermEqua[i] = ThisYear.TermEqua[i]
            Term1Equa[i] = ThisYear.Term1Equa[i]
            TermEclp[i] = ThisYear.TermEclp[i]
            Term1Eclp[i] = ThisYear.Term1Eclp[i]
        }
        if (LeapNumTerm) {
            TermName[LeapNumTerm + 1] = '无中'
            TermAcrSc[LeapNumTerm + 1] = ''
            TermAcrMmdd[LeapNumTerm + 1] = ''
            TermAcrDeci[LeapNumTerm + 1] = ''
            TermNowDeci[LeapNumTerm + 1] = ''
            TermEqua[LeapNumTerm + 1] = ''
            TermEclp[LeapNumTerm + 1] = ''
            for (let i = LeapNumTerm + 2; i <= 13; i++) {
                TermName[i] = Term1NameList[(i + 2) % 12]
                // 上下互換位置
                Term1Name[i] = TermNameList[(i + 1) % 12]
                TermAcrSc[i] = ThisYear.Term1AcrSc[i]
                TermAcrMmdd[i] = ThisYear.Term1AcrMmdd[i]
                TermAcrDeci[i] = ThisYear.Term1AcrDeci[i]
                TermEqua[i] = ThisYear.Term1Equa[i]
                TermEclp[i] = ThisYear.Term1Eclp[i]
                Term1AcrSc[i] = ThisYear.TermAcrSc[i - 1]
                Term1AcrDeci[i] = ThisYear.TermAcrDeci[i - 1]
                Term1AcrMmdd[i] = ThisYear.TermAcrMmdd[i - 1]
                Term1Equa[i] = ThisYear.TermEqua[i - 1]
                Term1Eclp[i] = ThisYear.TermEclp[i - 1]
                if (ThisYear.TermNowDeci) {
                    TermNowDeci[i] = ThisYear.Term1NowDeci[i]
                    Term1NowDeci[i] = ThisYear.TermNowDeci[i - 1]
                }

            }
        }
        if (PrevYear.LeapNumTerm) {
            Term1Name[1] = '无節'
            Term1AcrSc[1] = ''
            Term1AcrMmdd[1] = ''
            Term1AcrDeci[1] = ''
            if (ThisYear.Term1NowDeci) Term1NowDeci[1] = ''
            Term1Equa[1] = ''
            Term1Eclp[1] = ''
        }
        // 月序
        const MonthName = []
        let MonNumList = MonNumList1
        if (LeapNumTerm) {
            for (let i = 1; i <= 13; i++) {
                if (i <= LeapNumTerm) {
                    MonthName[i] = MonNumList[i]
                } else if (i === LeapNumTerm + 1) {
                    MonthName[i] = '閏' + MonNumList[LeapNumTerm]
                } else {
                    MonthName[i] = MonNumList[i - 1]
                }
            }
        } else {
            for (let i = 1; i <= 12; i++) {
                MonthName[i] = MonNumList[i]
            }
        }
        const NewmSlice = array => array.slice(1 + NewmStart, 13 + NewmEnd)
        const NewmSlice1 = array => array.slice(1 + NewmStart, 14 + NewmEnd)
        const TermSlice = array => array.slice(1 + TermStart, 13 + TermEnd)
        ////////////下爲調整輸出////////////
        const MonthPrint = MonthName.slice(1)
        const NewmScPrint = NewmSlice(ThisYear.NewmSc)
        const NewmUT1JdPrint = NewmSlice1(ThisYear.NewmUT1Jd)
        const NewmMmddPrint = NewmSlice(ThisYear.NewmMmdd)
        const NewmDeciUT18Print = NewmSlice(ThisYear.NewmDeci)
        const NewmEquaPrint = NewmSlice(NewmEqua)
        const NewmEclpPrint = NewmSlice(NewmEclp)
        const SyzygyScPrint = NewmSlice(ThisYear.SyzygySc)
        const SyzygyMmddPrint = NewmSlice(ThisYear.SyzygyMmdd)
        const SyzygyDeciPrint = NewmSlice(ThisYear.SyzygyDeci)
        let TermNowDeciPrint = [], Term1NowDeciPrint = []
        const TermNamePrint = TermSlice(TermName)
        const Term1NamePrint = Term1Name[2] ? TermSlice(Term1Name) : []
        const TermAcrScPrint = TermSlice(TermAcrSc)
        const TermAcrMmddPrint = TermSlice(TermAcrMmdd)
        const TermAcrDeciPrint = TermSlice(TermAcrDeci)
        const Term1AcrScPrint = TermSlice(Term1AcrSc)
        const Term1AcrMmddPrint = TermSlice(Term1AcrMmdd)
        const Term1AcrDeciPrint = TermSlice(Term1AcrDeci)
        if (TermNowDeci[2]) {
            TermNowDeciPrint = TermSlice(TermNowDeci)
            Term1NowDeciPrint = TermSlice(Term1NowDeci)
        }
        const TermEquaPrint = TermEqua[2] ? TermSlice(TermEqua) : undefined
        const Term1EquaPrint = Term1Equa[2] ? TermSlice(Term1Equa) : undefined
        const TermEclpPrint = TermSlice(TermEclp)
        const Term1EclpPrint = TermSlice(Term1Eclp)
        const YearSc = ScList[((Y - 3) % 60 + 60) % 60]
        let Era = Y
        if (Y > 0) Era = `公元 ${Y} 年 ${YearSc}`
        else Era = `公元前 ${1 - Y} 年 ${YearSc}`
        const YearInfo = [{
            CalName: "DE440/1",
            OriginYear: `距曆元${Y - 2000}年`,
            DeltaT: 'ΔT = ' + Math.trunc(deltaT(ThisYear.NewmUT1Jd[5]) * 86400) + ' ± ' + deltaTError(Y)[0] + ' 秒'
        }]
        return {
            Era, YearInfo, MonthPrint, LeapNumTerm,
            NewmScPrint, NewmMmddPrint, NewmDeciUT18Print, NewmEclpPrint, NewmEquaPrint, NewmUT1JdPrint,
            SyzygyScPrint, SyzygyMmddPrint, SyzygyDeciPrint,
            Term1NamePrint, Term1AcrScPrint, Term1AcrMmddPrint, Term1AcrDeciPrint, Term1NowDeciPrint, Term1EclpPrint, Term1EquaPrint,
            TermNamePrint, TermAcrScPrint, TermAcrMmddPrint, TermAcrDeciPrint, TermNowDeciPrint, TermEclpPrint, TermEquaPrint,
        }
    }
    Memo[0] = N6(YearStart - 1, Longitude) // 去年
    Memo[1] = N6(YearStart, Longitude) // 今年
    const result = []
    YearEnd = YearEnd === undefined ? YearStart : YearEnd
    for (let Y = YearStart; Y <= YearEnd; Y++) {
        Memo[2] = N6(Y + 1, Longitude) // 明年
        result.push(calculate(Y))
        Memo[0] = Memo[1] // 数组滚动，避免重复运算
        Memo[1] = Memo[2]
    }
    return result
}
// console.log(Index(2024, 2024, 116))
