import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
  removeOldOutOfScopeFlightInfoRow,
} from "./dom-manipulation.js";
import { IFlights } from "./models/flight.js";
import { fetchStream$, pollStream$ } from "./services/flight-service.js";

fetchStream$.subscribe({
  next: (flight: IFlights[]): void => getAPIResponseAndUpdatePage(flight),
  complete: () => minimiseLoadingScreen(),
});

pollStream$.subscribe((flight: IFlights[]): void => {
  getAPIResponseAndUpdatePage(flight);
});

export function getAPIResponseAndUpdatePage(flight: IFlights[]): void {
  const currentFlightCodes = [];
  for (let flightInfo of flight) {
    appendFlightInformationToFlightInfoContainer(flightInfo);
    currentFlightCodes.push(flightInfo.icao24);
  }
  addEventListenerToFlightInfoButtons(flight);
  removeOldOutOfScopeFlightInfoRow(currentFlightCodes);
}
