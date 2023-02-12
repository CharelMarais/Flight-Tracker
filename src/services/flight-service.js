const BASE_URL = "https://opensky-network.org/api/states/all";

export function getFlightInfo() {
  return fetch(`${BASE_URL}`);
}
