import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
  removeOldOutOfScopeFlightInfoRow,
} from "./dom-manipulation.js";
import { flightStream } from "./models/flight.js";
import { fetchStream$, pollStream$ } from "./services/flight-service.js";

fetchStream$.subscribe({
  next: (flight: flightStream) => getAPIResponseAndUpdatePage(flight),
  complete: () => minimiseLoadingScreen(),
});

pollStream$.subscribe((flight: flightStream) => {
  getAPIResponseAndUpdatePage(flight);
});

export function getAPIResponseAndUpdatePage(flight: flightStream) {
  const currentFlightCodes = [];
  for (let flightInfo of flight.states) {
    appendFlightInformationToFlightInfoContainer(flightInfo);
    currentFlightCodes.push(flightInfo[0]);
  }
  addEventListenerToFlightInfoButtons(flight.states);
  removeOldOutOfScopeFlightInfoRow(currentFlightCodes);
}
