import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CurrencyTable } from '../models/exchange-rate.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyViewService {
  api = 'http://api.nbp.pl/api/exchangerates/';

  constructor(private readonly http: HttpClient) {}

  getCurrencyView(date: string): Observable<CurrencyTable> {
    return this.http
      .get<CurrencyTable[]>(this.api + 'tables/A/' + date)
      .pipe(map((table: CurrencyTable[]) => table[0]));
  }

  getExchangeRate(code: string): Observable<CurrencyTable> {
    return this.http.get<CurrencyTable>(this.api + `rates/a/${code}/`);
  }
}
