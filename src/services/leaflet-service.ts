import L, { Map, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

export const map: Map = L.map("map").setView([-35, 25], 2);

const planeIcon = document.createElement("div") as HTMLElement;
planeIcon.id = "plane-icon";
planeIcon.innerHTML = `
<svg
class="loading-plane text-secondary text-[2rem]"
stroke="currentColor"
fill="currentColor"
stroke-width="0"
viewBox="0 0 512 512"
height="1em"
width="1em"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M448 336v-40L288 192V79.2c0-17.7-14.8-31.2-32-31.2s-32 13.5-32 31.2V192L64 296v40l160-48v113.6l-48 31.2V464l80-16 80 16v-31.2l-48-31.2V288l160 48z"
></path>
</svg>
`;
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
