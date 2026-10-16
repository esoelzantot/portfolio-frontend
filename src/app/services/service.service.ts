import { inject, Injectable } from '@angular/core';
import { MongodbService } from './mongodb.service';
import { Observable } from 'rxjs';

export interface IService {
  title: string;
  modalTitle: string;
  modalDescription: string;
  provisions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  mongodb = inject(MongodbService);

  private servicesURL = 'services';

  getAllServices(): Observable<Array<IService>> {
    return this.mongodb.getData<Array<IService>>(this.servicesURL);
  }
}
