import { interval, switchMap } from "rxjs";
import { concatMap } from "rxjs/operators";
import { fromFetch } from "rxjs/fetch";

const timer$ = interval(30000);

export const fetchStream$ = fromFetch(
  "https://opensky-network.org/api/states/all?lamin=-35.8229&lomin=16.2562&lamax=-22.8389&lomax=33.3526"
).pipe(
  switchMap((response) => {
    if (response.ok) {
      return response.json();
    } else {
      return of({ error: true, message: `Error ${response.status}` });
    }
  })
);

export const pollStream$ = timer$.pipe(concatMap(() => fetchStream$));
