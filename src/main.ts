import { minimiseLoadingScreen } from "./dom-manipulation.js";
import { IFlights } from "./models/flight.js";
import { fetchStream$ } from "./services/flight-service.js";

fetchStream$.subscribe({
  next: (flights: IFlights[]): void => {
    localStorage.setItem("flights", JSON.stringify(flights));
  },
  complete: () => minimiseLoadingScreen(),
});
minimiseLoadingScreen();
