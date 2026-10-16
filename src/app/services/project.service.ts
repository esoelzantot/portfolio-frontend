import { inject, Injectable } from '@angular/core';
import { MongodbService } from './mongodb.service';
import { Observable } from 'rxjs';

export interface IProject {
  imgSrc: string;
  title: string;
  modalTitle: string;
  description: string;
  features: string[];
  githubURL: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  mongodb = inject(MongodbService);

  private projectsURL = 'projects';

  getAllProjects(): Observable<Array<IProject>> {
    return this.mongodb.getData<Array<IProject>>(this.projectsURL);
  }
}
