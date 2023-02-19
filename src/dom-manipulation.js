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
  const flightButtonExistence = document.getElementById(flight[1]);
  if (flightInfoDiv && !flightButtonExistence) {
    createNewFlightInfoRow(flight, flightInfoDiv);
  } else {
    appendExistingFlightInfoRow(flight);
  }
}

function createNewFlightInfoRow(flight, flightInfoDiv) {
  flightInfoDiv.innerHTML += `
  <div id="${flight[0]}" class="single-flight">
      <span>${flight[1] || "None"}</span>
      <span class="media full-screen">${convertMeterPerSecondToKilomentersPerHour(
        flight[11] ?? 0.0
      )}m/s</span>
      <span>${flight[9] ?? 0}m/s</span>
      <span class="media medium-screen-size">${calculateDirection(
        flight[10]
      )}</span>
      <span>${flight[10] ?? 0}°</span>
      <span class="media large-screen-size">${flight[7] ?? 0.0}m</span>
      <button id="${flight[1]}" class="track-button">track flight</button> 
    </div>`;
}

function appendExistingFlightInfoRow(flight) {
  const exsitingFlightInfoRow = document.getElementById(flight[0]);
  if (exsitingFlightInfoRow) {
    exsitingFlightInfoRow.innerHTML = `
    <span>${flight[1] || "None"}</span>
    <span class="media full-screen">${convertMeterPerSecondToKilomentersPerHour(
      flight[11] ?? 0.0
    )}m/s</span>
    <span>${flight[9] ?? 0}m/s</span>
    <span class="media medium-screen-size">${calculateDirection(
      flight[10]
    )}</span>
    <span>${flight[10] ?? 0}°</span>
    <span class="media large-screen-size">${flight[7] ?? 0.0}m</span>
    <button id="${flight[1]}" class="track-button">track flight</button> 
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
    const relInfo = flights.find((flight) => flight[1] === button.id);
    button.addEventListener("click", () => {
      toggleFlightFocus(event, relInfo);
    });
  });
}

export function minimiseLoadingScreen() {
  const loadScreen = document.getElementById("loading");
  loadScreen.style.animationName = "loadAnime";
}

function toggleFlightFocus(event, fltInfo) {
  const mapElement = document.getElementById("map");
  const button = event.target;

  if (button.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement.style.visibility = "hidden";
    button.innerText = "track flight";
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
    if (button.id !== event.target.id && innerText !== "TRACK FLIGHT") {
      button.parentNode.classList.add("hidden");
    } else {
      button.parentNode.classList.remove("hidden");
    }
  });
}
