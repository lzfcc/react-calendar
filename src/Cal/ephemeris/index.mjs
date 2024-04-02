import { D1 } from "./eph.mjs";
import { D2 } from "./eph_shixian.mjs";
import Para from "../parameter/calendars.mjs";

export default (Name, YearStart, YearEnd) => {
  const Bind = (Name) => {
    const type = Para[Name].Type;
    if (type < 13) return D1;
    else if (type === 13) return D2;
  };
  const AutoDay = Bind(Name);
  return AutoDay(Name, YearStart, YearEnd);
};
