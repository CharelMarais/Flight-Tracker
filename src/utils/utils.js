import { map, marker } from "../services/leaflet-service";

export function getRelatedButtonFlightInfo(btnId, relatedInfoArr) {
  let info;
  relatedInfoArr.map((arrItem) => {
    if (arrItem[1] === btnId) {
      info = arrItem;
    }
  });
  return info;
}

export function calculateDirection(deg) {
  switch (true) {
    case deg < 11.25:
      return "N";
    case deg < 33.75:
      return "NNE";
    case deg < 56.25:
      return "NE";
    case deg < 78.75:
      return "ENE";
    case deg < 101.25:
      return "E";
    case deg < 123.75:
      return "ESE";
    case deg < 146.25:
      return "SE";
    case deg < 168.75:
      return "SSE";
    case deg < 191.25:
      return "S";
    case deg < 213.75:
      return "SSW";
    case deg < 236.25:
      return "SW";
    case deg < 258.75:
      return "WSW";
    case deg < 281.25:
      return "W";
    case deg < 303.75:
      return "WNW";
    case deg < 326.25:
      return "NW";
    case deg < 348.75:
      return "NNW";
    case deg < 360:
      return "N";
  }
}

export function viewButtonCreateMapOfClicked(event, fltInfo) {
  const mapElement = document.getElementById("map");

  if (event.target.innerText === "CLOSE") {
    // If button has already been clicked
    mapElement.style.visibility = "hidden";
    event.target.innerText = "view";
    const openButtons = document.querySelectorAll(".view-button");
    openButtons.forEach((buttonOpen) => {
      buttonOpen.parentNode.classList.remove("hidden");
    });
    map.flyTo([-35, 23], 2);
  } else {
    // if a button is clicked
    mapElement.style.visibility = "visible";
    event.target.innerText = "close";
    const closeButtons = document.querySelectorAll(".view-button");
    closeButtons.forEach((buttonClose) => {
      if (buttonClose.id !== event.target.id) {
        buttonClose.parentNode.classList.add("hidden");
      }
    });
    map.flyTo([fltInfo[6], fltInfo[5]], 10);
    marker.setLatLng([fltInfo[6], fltInfo[5]]);
  }
}
