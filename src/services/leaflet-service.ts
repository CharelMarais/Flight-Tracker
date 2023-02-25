import L, { Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

export const map: Map = L.map("map").setView([-35, 25], 2);

const planeIcon = document.createElement("div") as HTMLElement;
planeIcon.id = "plane-icon";
planeIcon.innerHTML = `<img src="../../assets/img/icons8-plane-24.png" alt="plane icon">`;
const divIcon = L.divIcon({
  html: planeIcon,
  iconSize: [24, 24],
  className: "plane-icon",
});

export const marker: Marker = L.marker([-35, 25], { icon: divIcon }).addTo(map);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

export function resetMapLocationView(): void {
  map.flyTo([-35, 23], 2);
}

export function setMapAndMarkerToCurrentFlightLocation(
  lat = 0,
  lon = 0,
  heading = 0
): void {
  map.flyTo([lat, lon], 10);
  marker.setLatLng([lat, lon]);
  planeIcon.style.transform = `rotate(${heading - 90}deg)`;
}
