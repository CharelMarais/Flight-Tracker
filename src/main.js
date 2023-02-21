import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
} from "./dom-manipulation.js";
import { getFlightInfo } from "./services/flight-service.js";

getFlightInfo()
  .then((res) => res.json())
  .then((responseJSON) => {
    localStorage.setItem(responseJSON.states);
    for (let flight of responseJSON.states) {
      appendFlightInformationToFlightInfoContainer(flight);
    }
    addEventListenerToFlightInfoButtons(responseJSON.states);
  })
  .catch((error) => console.error(error))
  .finally(() => {
    minimiseLoadingScreen();
  });
