import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
  removeOldOutOfScopeFlightInfoRow,
} from "./dom-manipulation.js";
import { fetchStream$, pollStream$ } from "./services/flight-service.js";

fetchStream$.subscribe({
  next: (flight) => getAPIResponseAndUpdatePage(flight),
  complete: () => minimiseLoadingScreen(),
});

pollStream$.subscribe((flight) => {
  getAPIResponseAndUpdatePage(flight);
});

export function getAPIResponseAndUpdatePage(flight) {
  const currentFlightCodes = [];
  for (let flightInfo of flight.states) {
    appendFlightInformationToFlightInfoContainer(flightInfo);
    currentFlightCodes.push(flightInfo[0]);
  }
  addEventListenerToFlightInfoButtons(flight.states);
  removeOldOutOfScopeFlightInfoRow(currentFlightCodes);
}
