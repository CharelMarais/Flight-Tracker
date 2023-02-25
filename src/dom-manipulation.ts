import { IFlights } from "./models/flight";
import {
  resetMapLocationView,
  setMapAndMarkerToCurrentFlightLocation,
} from "./services/leaflet-service";
import {
  calculateDirection,
  convertMeterPerSecondToKilomentersPerHour,
} from "./utils/utils.js";

export function appendFlightInformationToFlightInfoContainer(flight: IFlights) {
  const flightInfoDiv = document.getElementById("flights-info");
  const flightButtonExistence = document.getElementById(flight.icao24 + flight.callsign);
  if (flightInfoDiv) {
    if (!flightButtonExistence) {
      createNewFlightInfoRow(flight, flightInfoDiv);
    } else {
      appendExistingFlightInfoRow(flight);
    }
  }
}

// double null checks to be removed in observable brance

function createNewFlightInfoRow(flight: IFlights, flightInfoDiv: HTMLElement) {
  if (flight.icao24) {
    flightInfoDiv.innerHTML += `
  <div id="${
    flight.icao24
  }" class="single-flight grid grid-cols-4 py-1 text-[0.8rem] md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      <span>${flight.callsign || "None"}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight.vertical_rate ?? 0.0
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight.velocity ?? 0
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight.true_track ?? 0
      )}</span>
      <span>${flight.true_track ?? 0}°</span>
      <span class="hidden lg:contents">${flight.baro_altitude ?? 0.0}m</span>
      <button id="${
        flight.icao24 + (flight.callsign ?? 0)
      }" class="track-button uppercase font-bold cursor-pointer border-none">track</button> 
    </div>`;
  }
}

function appendExistingFlightInfoRow(flight: IFlights) {
  const exsitingFlightInfoRow = document.getElementById(flight.icao24);
  if (exsitingFlightInfoRow) {
    exsitingFlightInfoRow.innerHTML = `
    <span>${flight.callsign || "None"}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight.vertical_rate ?? 0.0
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight.velocity ?? 0
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight.true_track ?? 0
      )}</span>
      <span>${flight.true_track ?? 0}°</span>
      <span class="hidden lg:contents">${flight.baro_altitude ?? 0.0}m</span>
      <button id="${
        flight.icao24 + (flight.callsign ?? 0)
      }" class="track-button uppercase">track</button> 
    `;
  }
}

export function removeOldOutOfScopeFlightInfoRow(inScopeFlightCodes: string[]) {
  const flightInfoDivs = document.querySelectorAll(".single-flight");
  flightInfoDivs.forEach((flightRow) => {
    const inScope = inScopeFlightCodes.includes(flightRow.id);
    if (!inScope) {
      const singleFlightToRemove = document.getElementById(flightRow.id);
      singleFlightToRemove!.remove();
    }
  });
}

export function addEventListenerToFlightInfoButtons(flights: IFlights[]) {
  const viewButtons = document.querySelectorAll(".track-button");
  viewButtons.forEach((button) => {
    const relInfo = flights.find(
      (flight) => flight.icao24 + flight.callsign === button.id
    );
    if (relInfo) {
      button.addEventListener("click", () => {
        toggleFlightFocus(event as MouseEvent, relInfo);
      });
    }
  });
}

export async function minimiseLoadingScreen() {
  const loadScreen = document.getElementById("loading");
  loadScreen!.classList.add("animate-loadAnime");
}

function toggleFlightFocus(event: MouseEvent, fltInfo: IFlights) {
  const mapElement = document.getElementById("map");
  const button = event.target as HTMLElement;

  if (button!.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement!.style.visibility = "hidden";
    button.innerText = "track";
    resetMapLocationView();
  } else {
    // if a button is clicked
    mapElement!.style.visibility = "visible";
    button!.innerText = "close";
    setMapAndMarkerToCurrentFlightLocation(fltInfo.latitude, fltInfo.longitude, fltInfo.true_track);
  }
  showAndHideButtonsAfterClick(button!.innerText);
}

function showAndHideButtonsAfterClick(innerText: string) {
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
