import { tap } from "rxjs/operators";
import { IFlights } from "./models/flight";
import { fetchStream$ } from "./services/flight-service";
import {
  resetMapLocationView,
  setMapAndMarkerToCurrentFlightLocation,
} from "./services/leaflet-service";
import {
  calculateDirection,
  convertMeterPerSecondToKilomentersPerHour,
} from "./utils/utils";

// Sybscribe to api output and update table with new or updated info
fetchStream$.subscribe((flightArray) => {
  flightArray.map((flight) => {
    const flightInfoDiv = document.getElementById("flights-info");
    const flightButtonExistence = document.getElementById(
      flight.icao24 + flight.callsign
    );
    if (!flightInfoDiv) return;
    if (!flightButtonExistence) {
      createNewFlightInfoRow(flight, flightInfoDiv);
    } else {
      appendExistingFlightInfoRow(flight);
    }
  });
  addEventListenerToFlightInfoButtons(flightArray);
});

// Remove Old Out Of Scope Flight Info Row
fetchStream$.subscribe((flightArray) => {
  const inScopeFlightCodes: string[] = [];
  const flightInfoDivs = document.querySelectorAll(".single-flight");

  flightArray.map((flight) => inScopeFlightCodes.push(flight.icao24));
  flightInfoDivs.forEach((flightRow) => {
    const inScope = inScopeFlightCodes.includes(flightRow.id);
    if (!inScope) {
      const singleFlightToRemove = document.getElementById(flightRow.id);
      singleFlightToRemove!.remove();
    }
  });
});

function createNewFlightInfoRow(
  flight: IFlights,
  flightInfoDiv: HTMLElement
): void {
  if (!flight.icao24) return;
  flightInfoDiv.innerHTML += `
  <div id="${
    flight.icao24
  }" class="single-flight grid grid-cols-4 py-1 text-[0.8rem] md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      <span>${flight.callsign}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight.vertical_rate
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight.velocity
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight.true_track
      )}</span>
      <span>${flight.true_track}°</span>
      <span class="hidden lg:contents">${flight.baro_altitude}m</span>
      <button id="${
        flight.icao24 + flight.callsign
      }" class="track-button uppercase font-bold cursor-pointer border-none">track</button> 
    </div>`;

  if (flightInfoDiv.innerHTML !== "") {
    minimiseLoadingScreen();
  }
}

function appendExistingFlightInfoRow(flight: IFlights): void {
  const exsitingFlightInfoRow = document.getElementById(flight.icao24);
  if (!exsitingFlightInfoRow) return;
  exsitingFlightInfoRow.innerHTML = `
    <span>${flight.callsign}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight.vertical_rate
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight.velocity
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight.true_track
      )}</span>
      <span>${flight.true_track}°</span>
      <span class="hidden lg:contents">${flight.baro_altitude}m</span>
      <button id="${
        flight.icao24 + flight.callsign
      }" class="track-button uppercase">track</button> 
    `;
}

export function addEventListenerToFlightInfoButtons(flights: IFlights[]): void {
  const viewButtons = document.querySelectorAll(".track-button");
  viewButtons.forEach((button) => {
    const relInfo = flights.find(
      (flight) => flight.icao24 + flight.callsign === button.id
    );
    if (!relInfo) return;
    button.addEventListener("click", () => {
      toggleFlightFocus(event as MouseEvent, relInfo);
    });
  });
}

export function minimiseLoadingScreen(): void {
  const loadScreen = document.getElementById("loading");

  if (!loadScreen || loadScreen.classList.contains("loaded")) return;
  loadScreen.classList.add("animate-loadAnime");
  loadScreen.classList.add("loaded");
}

function toggleFlightFocus(event: MouseEvent, fltInfo: IFlights): void {
  const mapElement = document.getElementById("map");
  const button = event.target as HTMLElement;

  if (button.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement!.style.visibility = "hidden";
    button.innerText = "track";
    resetMapLocationView();
  } else {
    // if a button is clicked
    mapElement!.style.visibility = "visible";
    button.innerText = "close";
    setMapAndMarkerToCurrentFlightLocation(
      fltInfo.latitude,
      fltInfo.longitude,
      fltInfo.true_track
    );
  }
  showAndHideButtonsAfterClick(button!.innerText);
}

function showAndHideButtonsAfterClick(innerText: string): void {
  const buttons = document.querySelectorAll(".track-button");
  buttons.forEach((button) => {
    const eventTarget = event!.target as HTMLElement;
    if (button.id !== eventTarget.id && innerText !== "TRACK") {
      button.parentElement!.classList.add("hidden");
    } else {
      button.parentElement!.classList.remove("hidden");
    }
  });
}
