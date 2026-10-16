import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MongodbService } from './mongodb.service';

export interface IWork {
  mainTitle: string;
  subTitle: string;
  calendar: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  mongodb = inject(MongodbService);

  private worksURL = 'works';

  getAllWorks(): Observable<Array<IWork>> {
    return this.mongodb.getData<Array<IWork>>(this.worksURL);
  }
}
