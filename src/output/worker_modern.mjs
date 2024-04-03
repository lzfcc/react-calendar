import { outputEphModernWeb, outputNewmWeb_DE } from './main.mjs'

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd, Longitude, Latitude, h } = event.data;
  if (eventName === "Newm") {
    const data = outputNewmWeb_DE(YearStart, YearEnd, Longitude);
    postMessage(data);
  }
  if (eventName === "Eph") {
    const data = outputEphModernWeb(YearStart, Longitude, Latitude, h);
    postMessage(data);
  }
});
