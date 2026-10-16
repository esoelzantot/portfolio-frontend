import { inject, Injectable } from '@angular/core';
import { MongodbService } from './mongodb.service';
import { Observable } from 'rxjs';

export interface IEducation {
  mainTitle: string;
  subTitle: string;
  calendar: string;
}

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  mongodb = inject(MongodbService);

  private educationsURL = 'educations';

  getAllEducations(): Observable<Array<IEducation>> {
    return this.mongodb.getData<Array<IEducation>>(this.educationsURL);
  }
}
