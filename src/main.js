import "./styles.scss";
import { getFlightInfo } from "./services/flight-service.js";

var map = L.map("map").setView([-35, 25], 2);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function viewButtonCreateMapOfClicked(event, fltInfo) {
  if (event.target.innerText === "CLOSE") {
    // If button has already been clicked
    map.removeLayer(marker);
    event.target.innerText = "view";
    const openButtons = document.querySelectorAll(".view-button");
    openButtons.forEach((buttonOpen) => {
      buttonOpen.parentNode.classList.remove("hidden");
    });
    map.flyTo([-35, 23], 2);
  } else {
    // if a button is still to be clicked
    event.target.innerText = "close";
    const closeButtons = document.querySelectorAll(".view-button");
    closeButtons.forEach((buttonClose) => {
      if (buttonClose.id !== event.target.id) {
        buttonClose.parentNode.classList.add("hidden");
      }
    });
    map.flyTo([fltInfo[6], fltInfo[5]], 6);
    L.marker([fltInfo[6], fltInfo[5]]).addTo(map);
  }
}

function relatedInfo(btnId, relatedInfoArr) {
  let info;
  relatedInfoArr.map((arrItem) => {
    if (arrItem[1] === btnId) {
      info = arrItem;
    }
  });
  return info;
}

const flightsInfoArray = [];

getFlightInfo()
  .then((res) => res.json())
  .then((responseJSON) => {
    let count = 0;
    for (let flight of responseJSON.states) {
      if (flight[2] === "South Africa") {
        const flightInfo = document.getElementById("flights-info");
        flightInfo.innerHTML += `
          <div class="single-flight">
              <span>${flight[1] === "" ? "None" : flight[1]}</span>
              <span>${flight[9]}m/s</span>
              <span>${flight[10]}°</span>
              <button id="${flight[1]}" class ="view-button">view</button>
            </div>`;
        flightsInfoArray[flightsInfoArray.length] = flight;
      }
    }
  })
  .catch((error) => console.error(error))
  .finally(() => {
    const viewButtons = document.querySelectorAll(".view-button");
    viewButtons.forEach((button) => {
      const relInfo = relatedInfo(button.id, flightsInfoArray);
      button.addEventListener("click", () => {
        viewButtonCreateMapOfClicked(event, relInfo);
      });
    });
  });
