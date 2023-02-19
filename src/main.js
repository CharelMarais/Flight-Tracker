import {
  addEventListenerToFlightInfoButtons,
  appendFlightInformationToFlightInfoContainer,
  minimiseLoadingScreen,
  removeOldOutOfScopeFlightInfoRow,
} from "./dom-manipulation.js";
import { getFlightInfo } from "./services/flight-service.js";

function getAPIResponsAndUpdatePage() {
  getFlightInfo()
    .then((res) => res.json())
    .then((responseJSON) => {
      const currentFlightCodes = [];
      for (let flight of responseJSON.states) {
        appendFlightInformationToFlightInfoContainer(flight);
        currentFlightCodes.push(flight[0]);
      }
      addEventListenerToFlightInfoButtons(responseJSON.states);
      // removeOldOutOfScopeFlightInfoRow(currentFlightCodes);
    })
    .catch((error) => console.error(error))
    .finally(() => {
      minimiseLoadingScreen();
    });
}

getAPIResponsAndUpdatePage();

// setInterval(getAPIResponsAndUpdatePage, 30000);
