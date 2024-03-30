import { D1 } from './main.mjs'
import { D2 } from './main_shixian.mjs'
import Para from '../parameter/calendars.mjs'

export default (Name, YearStart, YearEnd) => {
    const Bind = Name => {
        const type = Para[Name].Type
        if (type === 13) return D2
        else return D1
    }
    const AutoDay = Bind(Name)
    return AutoDay(Name, YearStart, YearEnd)
}