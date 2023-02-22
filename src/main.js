import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
  removeOldOutOfScopeFlightInfoRow,
} from "./dom-manipulation.js";
import { fetchStream$, pollStream$ } from "./services/flight-service.js";

fetchStream$.subscribe({
  next: (flight) => getAPIResponsAndUpdatePage(flight),
  complete: () => minimiseLoadingScreen(),
});

pollStream$.subscribe((flight) => {
  getAPIResponsAndUpdatePage(flight);
});

export function getAPIResponsAndUpdatePage(flight) {
  const currentFlightCodes = [];
  for (let flightInfo of flight.states) {
    appendFlightInformationToFlightInfoContainer(flightInfo);
    currentFlightCodes.push(flightInfo[0]);
  }
  addEventListenerToFlightInfoButtons(flight.states);
  removeOldOutOfScopeFlightInfoRow(currentFlightCodes);
}
