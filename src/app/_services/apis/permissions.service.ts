import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserTokenRequest, Token, User, Menu, UserRole, Role, Organization } from 'app/_models';
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

  getAllRoles() {
    return this.http.get<Array<Role>>(this.baseUrl + 'api/roles');
  }

  getAll() {
    return this.http.get<Array<UserRole>>(this.baseUrl + 'api/roles/users');
  }

  getAllForUser(userId: number) {
    return this.http.get<Array<UserRole>>(`${this.baseUrl}api/roles/users?userId=${userId}`);
  }

  getAllOrgsForUser(userId: number) {
    return this.http.get<Array<Organization>>(`${this.baseUrl}api/roles/orgs?userId=${userId}`);
  }

  saveRole(role: UserRole) {
    return this.http.put<UserRole>(this.baseUrl + 'api/roles/users', role);
  }
}
