import { Observable, of, switchMap, timer } from "rxjs";
import { catchError, concatMap, map } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { IFlightAPIStream, IFlights } from "../models/flight";

export const fetchStream$: Observable<IFlights[]> = timer(0, 30000).pipe(
  concatMap(() =>
    fromFetch(
      "https://opensky-network.org/api/states/all?lamin=-35.8229&lomin=16.2562&lamax=-22.8389&lomax=33.3526"
    ).pipe(
      switchMap((response) => {
        if (response.ok) {
          return response.json() as Promise<IFlightAPIStream>;
        } else {
          return of(
            JSON.parse(
              localStorage.getItem("flights") ?? "none"
            ) as IFlightAPIStream
          );
        }
      }),
      map((result): IFlights[] => {
        localStorage.setItem("flights", JSON.stringify(result));
        const flightArray = result.states.map((flightInfo): IFlights => {
          const flight: IFlights = {
            icao24: (flightInfo[0] as string) ?? "none",
            callsign: (flightInfo[1] as string) || "none",
            origin_country: (flightInfo[2] as string) ?? "none",
            time_position: (flightInfo[3] as number) ?? 0,
            last_contact: (flightInfo[4] as number) ?? 0,
            longitude: (flightInfo[5] as number) ?? 0,
            latitude: (flightInfo[6] as number) ?? 0,
            baro_altitude: (flightInfo[7] as number) ?? 0,
            on_ground: (flightInfo[8] as boolean) ?? true,
            velocity: (flightInfo[9] as number) ?? 0,
            true_track: (flightInfo[10] as number) ?? 0,
            vertical_rate: (flightInfo[11] as number) ?? 0,
            sensors: (flightInfo[12] as number[]) ?? 0,
            geo_altitude: (flightInfo[13] as number) ?? 0,
            squak: (flightInfo[14] as string) ?? "none",
            spi: (flightInfo[15] as boolean) ?? false,
            position_source: (flightInfo[16] as number) ?? 0,
            category: (flightInfo[17] as number) ?? 0,
          };
          return flight;
        });
        return flightArray;
      })
    )
  )
);
