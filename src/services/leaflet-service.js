export var map = L.map("map").setView([-35, 25], 2);
var MyIcon = L.icon({
  iconUrl: "../../assets/img/icons8-plane-24.png",
  iconSize: [25, 25],
  iconAnchor: [25, 25],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
export var marker = L.marker([-35, 25], { icon: MyIcon }).addTo(map);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
