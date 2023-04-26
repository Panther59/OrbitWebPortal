import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from 'app/_models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getAll(): Observable<Array<Organization>> {
    return this.http.get<Array<Organization>>(this.baseUrl + 'api/company');
  }

  addUpdate(org: Organization): Observable<Organization> {
    return this.http.put<Organization>(this.baseUrl + 'api/company', org);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/company/' + id);
  }
}
