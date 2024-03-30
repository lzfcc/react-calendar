import { outputNewmWeb_DE } from './main.mjs'

export default addEventListener("message", (event) => {
  const { eventName, YearStart, YearEnd } = event.data;
  if (eventName === "Newm") {
    const data = outputNewmWeb_DE(YearStart, YearEnd);
    postMessage(data);
  }
});
