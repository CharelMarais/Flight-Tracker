import { interval, Observable, of, switchMap } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";
import { IFlightAPIStream, IFlights } from "../models/flight";

const timer$ = interval(30000);

export const fetchStream$: Observable<IFlightAPIStream> = fromFetch(
  "https://opensky-network.org/api/states/all?lamin=-35.8229&lomin=16.2562&lamax=-22.8389&lomax=33.3526"
).pipe(
  switchMap((response) => {
    // if (response.ok) {
      return response.json() as Promise<IFlightAPIStream>;
    // } else {
    //   return of({ error: true, message: `Error ${response.status}` });
    // }
  })
,map((result) => {
    const flightArray = result.states.map(state => {
      const flight: IFlights = {

      }
      return flight;
    });
    return flightArray;
  })
);

export const pollStream$ = timer$.pipe(concatMap(() => fetchStream$));

fetchStream$.subscribe(ress);
