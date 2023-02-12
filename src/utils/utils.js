export function dateToEpoch(date) {
  let epochDate = date.getTime() / 1000;
  return Math.round(epochDate);
}

export function epochToDate(epoch) {
  return Date(epoch);
}
