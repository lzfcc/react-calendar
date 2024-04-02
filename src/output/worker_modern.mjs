import { outputEphModernWeb, outputNewmWeb_DE } from './main.mjs'

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd, Longitude, Latitude } = event.data;
  if (eventName === "Newm") {
    const data = outputNewmWeb_DE(YearStart, YearEnd);
    postMessage(data);
  }
  if (eventName === "Eph") {
    const data = outputEphModernWeb(YearStart, Longitude, Latitude);
    postMessage(data);
  }
});
