import { IFlight } from "./models/flight";
import { fetchStream$ } from "./services/flight-service";
import {
  resetMapLocationView,
  setMapAndMarkerToCurrentFlightLocation,
} from "./services/leaflet-service";
import {
  calculateDirection,
  convertMeterPerSecondToKilomentersPerHour,
} from "./utils/utils";

class FlightInfoTable extends HTMLElement {
  constructor() {
  super();
  // Create the Shadow Root
  const shadowRoot = this.attachShadow({ mode: "open" });
  shadowRoot.innerHTML += `
  <style>
    .single-flight {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      font-size: 0.8rem;
      padding-left: 0.2rem;
    }

    .vertical-rate {
      display: none;
    }

    .direction {
      display: none;
    }

    .altitude {
      display: none;
    }

    .track-button {
      text-transform: uppercase;
      font-weight: 700;
      cursor: pointer;
      border-style: none;
      background: transparent;
      font-size: 0.8rem;
      color: #faf755;
    }

    @media (min-width: 480px) {
      .single-flight {
        grid-template-columns: repeat(5, minmax(0, 1fr));
      }

      .direction {
        display: contents;
      }
    }

    @media (min-width: 769px) {
      .single-flight {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }

      .altitude {
        display: contents;
      }
    }

    @media (min-width: 1024px) {
      .single-flight {
        grid-template-columns: repeat(7, minmax(0, 1fr));
      }

      .vertical-rate {
        display: contents;
      }
    }
  </style>`;
  }
}
// Register the custom element
customElements.define("flight-info-table", FlightInfoTable);

// Sybscribe to api output and update table with new or updated info
export const flightArraySubcription = fetchStream$.subscribe((flightArray) => {
  const shadowHost = document.querySelector("#flights-info");
  if (!shadowHost) return;
  cleanUpFlightListData(flightArray, shadowHost);
  upsertFlightListData(flightArray, shadowHost);
});

function upsertFlightListData(flightArray: IFlight[], shadowHost: Element) {
  const shadowRoot = shadowHost.shadowRoot as ShadowRoot;

  flightArray.map((flight) => {
    const exsitingFlightInfoRow = shadowRoot.getElementById(
      flight.icao24
    ) as HTMLElement;
    const flightButton = shadowRoot.getElementById(
      flight.icao24 + flight.callsign
    ) as HTMLElement;

    if (!shadowRoot) return;
    if (!flightButton) {
      shadowRoot.innerHTML += createNewFlightInfoRow(flight);
    } else {
      exsitingFlightInfoRow.innerHTML = appendExistingFlightInfoRow(flight);
    }
  });
  minimiseLoadingScreen();
  addEventListenerToFlightInfoButtons(flightArray, shadowRoot);
}

function cleanUpFlightListData(flightArray: IFlight[], shadowHost: Element) {
  const shadowRoot = shadowHost.shadowRoot as ShadowRoot;
  const inScopeFlightCodes: string[] = [];
  const flightInfoDivs = shadowRoot.querySelectorAll(".single-flight");

  flightArray.map((flight) => inScopeFlightCodes.push(flight.icao24));
  flightInfoDivs.forEach((flightRow) => {
    const inScope = inScopeFlightCodes.includes(flightRow.id);
    if (!inScope) {
      const singleFlightToRemove = shadowRoot.getElementById(flightRow.id);
      singleFlightToRemove?.remove();
    }
  });
}

function createNewFlightInfoRow(flight: IFlight): string {
  if (!flight.icao24) return "";
  return `
  <div id="${
    flight.icao24
  }" class="single-flight">
      <span>${flight.callsign}</span>
      <span class="vertical-rate">${convertMeterPerSecondToKilomentersPerHour(
        flight.vertical_rate
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight.velocity
      )}km/h</span>
      <span class="direction">${calculateDirection(
        flight.true_track
      )}</span>
      <span>${flight.true_track}°</span>
      <span class="altitude">${flight.baro_altitude}m</span>
      <button id="${
        flight.icao24 + flight.callsign
      }" class="track-button">track</button> 
    </div>`;
}

function appendExistingFlightInfoRow(flight: IFlight): string {
  return `
  <span>${flight.callsign}</span>
  <span class="vertical-rate">${convertMeterPerSecondToKilomentersPerHour(
    flight.vertical_rate
  )}km/h</span>
  <span>${convertMeterPerSecondToKilomentersPerHour(
    flight.velocity
  )}km/h</span>
  <span class="direction">${calculateDirection(
    flight.true_track
  )}</span>
  <span>${flight.true_track}°</span>
  <span class="altitude">${flight.baro_altitude}m</span>
  <button id="${
    flight.icao24 + flight.callsign
  }" class="track-button">track</button> 
    `;
}

function addEventListenerToFlightInfoButtons(flights: IFlight[], shadowRoot: ShadowRoot): void {
  const viewButtons = shadowRoot.querySelectorAll(".track-button");
  viewButtons?.forEach((button) => {
    
    const relInfo = flights.find(
      (flight) => flight.icao24 + flight.callsign === button.id
    );
    if (!relInfo) return;
    button.addEventListener("click", (event) => {
      toggleFlightFocus(event as MouseEvent, relInfo, shadowRoot);
    });
  });
}

function minimiseLoadingScreen(): void {
  const loadScreen = document.getElementById("loading");

  if (!loadScreen || loadScreen.classList.contains("loaded")) return;
  loadScreen.classList.add("animate-loadAnime");
  loadScreen.classList.add("loaded");
}

function toggleFlightFocus(event: MouseEvent, fltInfo: IFlight, shadowRoot: ShadowRoot): void {
  const mapElement = document.getElementById("map");
  const button = event.target as HTMLElement;
  if (!mapElement) return;
  if (button.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement.style.visibility = "hidden";
    button.innerText = "track";
    resetMapLocationView();
  } else {
    // if a button is clicked
    mapElement.style.visibility = "visible";
    button.innerText = "close";
    setMapAndMarkerToCurrentFlightLocation(
      fltInfo.latitude,
      fltInfo.longitude,
      fltInfo.true_track
    );
  }
  showAndHideButtonsAfterClick(button?.innerText, button, shadowRoot);
}

function showAndHideButtonsAfterClick(
  innerText: string,
  target: HTMLElement,
  shadowRoot: ShadowRoot
): void {
  const buttons = shadowRoot.querySelectorAll(".track-button");
  buttons.forEach((button) => {
    if (!button.parentElement) return;
    if (button.id !== target.id && innerText !== "TRACK") {
      button.parentElement.style.display = "none";
    } else {
      button.parentElement.style.display = "grid";
    }
  });
}
