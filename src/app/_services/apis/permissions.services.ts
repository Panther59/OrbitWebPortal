import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserTokenRequest, Token, User, Menu, UserRole } from 'app/_models';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getAll() {
    return this.http.get<Array<UserRole>>(this.baseUrl + 'api/roles');
  }

  getAllForUser(userId: number) {
    return this.http.get<Array<UserRole>>(this.baseUrl + 'api/roles/' + userId);
  }
}
