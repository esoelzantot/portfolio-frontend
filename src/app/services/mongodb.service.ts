import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/** JSend-style envelope returned by the backend: `{ status, data: { <key>: payload } }`. */
export interface ApiResponse<K extends string, T> {
  status: string;
  data: Record<K, T>;
}

@Injectable({
  providedIn: 'root',
})
export class MongodbService {
  http = inject(HttpClient);

  private apiURL = environment.apiUrl;

  /** GETs `/api/<key>` and unwraps `data.<key>` from the response. */
  getData<T, K extends string = string>(key: K): Observable<T> {
    return this.http
      .get<ApiResponse<K, T>>(`${this.apiURL}/${key}`)
      .pipe(map((response) => response.data[key]));
  }
}
