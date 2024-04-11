import { outputNewmWeb, outputFile, outputEphWeb } from './main.mjs'

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd, isAuto, calendars } = event.data;
  let data = null;
  if (eventName === "Print") {
    data = outputFile(1, YearStart, YearEnd, isAuto, calendars);
    postMessage(new Blob([data]));
  }
  if (eventName === "Newm") {
    const data = outputNewmWeb(YearStart, YearEnd, isAuto, calendars);
    postMessage(data);
  }
  if (eventName === "Eph") {
    data = outputEphWeb(YearStart, calendars);
    postMessage(data);
  }
});
