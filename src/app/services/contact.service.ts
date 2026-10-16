import { inject, Injectable } from '@angular/core';
import { MongodbService } from './mongodb.service';
import { Observable } from 'rxjs';

export interface IContact {
  phone: string;
  email: string;
  location: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  mongodb = inject(MongodbService);

  private contactURL = 'contact';

  getContactData(): Observable<IContact> {
    return this.mongodb.getData<IContact>(this.contactURL);
  }
}
