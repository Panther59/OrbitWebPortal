import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'app/_models';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getAll() {
    return this.http.get<Array<User>>(this.baseUrl + 'api/users');
  }

  me() {
    return this.http.get<User>(this.baseUrl + 'api/users/me');
  }
}
