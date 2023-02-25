import { interval, Observable, switchMap } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { IFlightAPIStream, IFlights } from "../models/flight";

const timer$ = interval(30000);

export const fetchStream$: Observable<IFlights[]> = fromFetch(
  "https://opensky-network.org/api/states/all?lamin=-35.8229&lomin=16.2562&lamax=-22.8389&lomax=33.3526"
).pipe(
  switchMap((response) => {
    // if (response.ok) {     // This will be re-implemented on the observable branch

    return response.json() as Promise<IFlightAPIStream>;

    // } else {
    //   return of({ error: true, message: `Error ${response.status}` });
    // }
  }),
  map((result) => {
    const flightArray = result.states.map((flightInfo) => {
      const flight: IFlights = {
        icao24: flightInfo.icao24 ?? "none",
        callsign: flightInfo.callsign ?? "none",
        origin_country: flightInfo.origin_country ?? "none",
        time_position: flightInfo.time_position ?? 0,
        last_contact: flightInfo.last_contact ?? 0,
        longitude: flightInfo.longitude ?? 0,
        latitude: flightInfo.latitude ?? 0,
        baro_altitude: flightInfo.baro_altitude ?? 0,
        on_ground: flightInfo.on_ground ?? true,
        velocity: flightInfo.velocity ?? 0,
        true_track: flightInfo.true_track ?? 0,
        vertical_rate: flightInfo.vertical_rate ?? 0,
        sensors: flightInfo.sensors ?? 0,
        geo_altitude: flightInfo.geo_altitude ?? 0,
        squak: flightInfo.squak ?? "none",
        spi: flightInfo.spi ?? false,
        position_source: flightInfo.position_source ?? 0,
        category: flightInfo.category ?? 0,
      };
      return flight;
    });
    return flightArray;
  })
);

export const pollStream$ = timer$.pipe(concatMap(() => fetchStream$));
