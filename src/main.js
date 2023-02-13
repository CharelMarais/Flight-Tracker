import "./styles.scss";
import { getFlightInfo } from "./services/flight-service.js";
import {
  calculateDirection,
  getRelatedButtonFlightInfo,
  viewButtonCreateMapOfClicked,
} from "./utils/utils.js";

const flightsInfoArray = [];

getFlightInfo()
  .then((res) => res.json())
  .then((responseJSON) => {
    for (let flight of responseJSON.states) {
      if (flight[2] === "South Africa") {
        const flightInfo = document.getElementById("flights-info");
        flightInfo.innerHTML += `
          <div class="single-flight">
              <span>${flight[1] === "" ? "None" : flight[1]}</span>
              <span class="media f">${
                flight[11] === null ? 0.0 : flight[11]
              }m/s</span>
              <span>${flight[9]}m/s</span>
              <span class="media m">${calculateDirection(flight[10])}</span>
              <span>${flight[10]}°</span>
              <span class="media l">${
                flight[7] === null ? 0.0 : flight[7]
              }m</span>
              <button id="${flight[1]}" class ="view-button">view</button>
            </div>`;
        flightsInfoArray[flightsInfoArray.length] = flight;
      }
    }
    const viewButtons = document.querySelectorAll(".view-button");
    viewButtons.forEach((button) => {
      const relInfo = getRelatedButtonFlightInfo(button.id, flightsInfoArray);
      button.addEventListener("click", () => {
        viewButtonCreateMapOfClicked(event, relInfo);
      });
    });
  })
  .catch((error) => console.error(error))
  .finally(() => {});
