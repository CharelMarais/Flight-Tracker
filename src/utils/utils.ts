export function calculateDirection(deg: number):string {
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
    default:
      return "N";
  }
}

export function convertMeterPerSecondToKilomentersPerHour(mps: number) {
  return Math.round(mps * 3.6);
}
