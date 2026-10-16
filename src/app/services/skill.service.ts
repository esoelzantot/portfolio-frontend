import { inject, Injectable } from '@angular/core';
import { MongodbService } from './mongodb.service';
import { Observable } from 'rxjs';

export interface ISkill {
  category: string;
  experience: string;
  skillsList: ISkillItem[];
}

export interface ISkillItem {
  name: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  mongodb = inject(MongodbService);

  private skillsURL = 'skills';

  getAllSkills(): Observable<Array<ISkill>> {
    return this.mongodb.getData<Array<ISkill>>(this.skillsURL);
  }
}
