import {
  resetMapLocationView,
  setMapAndMarkerToCurrentFlightLocation,
} from "./services/leaflet-service";
import {
  calculateDirection,
  convertMeterPerSecondToKilomentersPerHour,
} from "./utils/utils.js";

export function appendFlightInformationToFlightInfoContainer(flight) {
  const flightInfoDiv = document.getElementById("flights-info");
  const flightButtonExistence = document.getElementById(flight[0] + flight[1]);
  if (flightInfoDiv) {
    if (!flightButtonExistence) {
      createNewFlightInfoRow(flight, flightInfoDiv);
    } else {
      appendExistingFlightInfoRow(flight);
    }
  }
}

function createNewFlightInfoRow(flight, flightInfoDiv) {
  if (flight[0]) {
    flightInfoDiv.innerHTML += `
  <div id="${
    flight[0]
  }" class="single-flight grid grid-cols-4 py-1 text-[0.8rem] md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      <span>${flight[1] || "None"}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight[11] ?? 0.0
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight[9] ?? 0
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight[10] ?? 0
      )}</span>
      <span>${flight[10] ?? 0}°</span>
      <span class="hidden lg:contents">${flight[7] ?? 0.0}m</span>
      <button id="${
        flight[0] + (flight[1] ?? 0)
      }" class="track-button uppercase font-bold cursor-pointer border-none">track</button> 
    </div>`;
  }
}

function appendExistingFlightInfoRow(flight) {
  const exsitingFlightInfoRow = document.getElementById(flight[0]);
  if (exsitingFlightInfoRow) {
    exsitingFlightInfoRow.innerHTML = `
    <span>${flight[1] || "None"}</span>
      <span class="hidden xl:contents">${convertMeterPerSecondToKilomentersPerHour(
        flight[11] ?? 0.0
      )}km/h</span>
      <span>${convertMeterPerSecondToKilomentersPerHour(
        flight[9] ?? 0
      )}km/h</span>
      <span class="hidden md:contents">${calculateDirection(
        flight[10] ?? 0
      )}</span>
      <span>${flight[10] ?? 0}°</span>
      <span class="hidden lg:contents">${flight[7] ?? 0.0}m</span>
      <button id="${
        flight[0] + (flight[1] ?? 0)
      }" class="track-button uppercase">track</button> 
    `;
  }
}

export function removeOldOutOfScopeFlightInfoRow(inScopeFlightCodes) {
  const flightInfoDivs = document.querySelectorAll(".single-flight");
  flightInfoDivs.forEach((flightRow) => {
    const inScope = inScopeFlightCodes.includes(flightRow.id);
    if (!inScope) {
      const singleFlightToRemove = document.getElementById(flightRow.id);
      singleFlightToRemove.remove();
    }
  });
}

export function addEventListenerToFlightInfoButtons(flights) {
  const viewButtons = document.querySelectorAll(".track-button");
  viewButtons.forEach((button) => {
    const relInfo = flights.find(
      (flight) => flight[0] + flight[1] === button.id
    );
    if (relInfo) {
      button.addEventListener("click", () => {
        toggleFlightFocus(event, relInfo);
      });
    }
  });
}

export async function minimiseLoadingScreen() {
  const loadScreen = document.getElementById("loading");
  loadScreen.classList.add("animate-loadAnime");
}

function toggleFlightFocus(event, fltInfo) {
  const mapElement = document.getElementById("map");
  const button = event.target;

  if (button.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement.style.visibility = "hidden";
    button.innerText = "track";
    resetMapLocationView();
  } else {
    // if a button is clicked
    mapElement.style.visibility = "visible";
    button.innerText = "close";
    setMapAndMarkerToCurrentFlightLocation(fltInfo[6], fltInfo[5], fltInfo[10]);
  }
  showAndHideButtonsAfterClick(button.innerText);
}

function showAndHideButtonsAfterClick(innerText) {
  const buttons = document.querySelectorAll(".track-button");
  buttons.forEach((button) => {
    if (button.id !== event.target.id && innerText !== "TRACK") {
      button.parentNode.classList.add("hidden");
    } else {
      button.parentNode.classList.remove("hidden");
    }
  });
}
