import {
  resetMapLocationView,
  setMapAndMarkerToCurrentFlightLocation,
} from "./services/leaflet-service";
import {
  calculateDirection,
  convertMeterPerSecondToKilomentersPerHour,
} from "./utils/utils.js";

export function appendFlightInformationToFlightInfoContainer(flight) {
  const flightInfo = document.getElementById("flights-info");
  if (flightInfo) {
    flightInfo.innerHTML += `
          <div class="single-flight">
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
              <button id="${
                flight[1]
              }" class="view-button">track flight</button> 
            </div>`;
  }
}

export function addEventListenerToFlightInfoButtons(flights) {
  const viewButtons = document.querySelectorAll(".view-button");
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
  const buttons = document.querySelectorAll(".view-button");
  buttons.forEach((button) => {
    if (button.id !== event.target.id && innerText !== "VIEW") {
      button.parentNode.classList.add("hidden");
    } else {
      button.parentNode.classList.remove("hidden");
    }
  });
}
