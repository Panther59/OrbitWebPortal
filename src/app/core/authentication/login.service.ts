import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserTokenRequest, Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl = '';
  constructor(protected http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>(this.baseUrl + 'auth/login', { username, password, rememberMe });
  }

  loginWithGoogle(credential?: any, email?: string) {
    const req: UserTokenRequest = { googleToken: credential, email };
    return this.http.post<Token>(this.baseUrl + 'api/auth/loginWithGoogle', req);
  }

  registerWithGoogle(credential: string) {
    const req: UserTokenRequest = { googleToken: credential };
    return this.http.post(this.baseUrl + 'api/auth/RegisterWithGoogle', req);
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  me() {
    return this.http.get<User>(this.baseUrl + 'api/users/me');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/assets/data/menu.json').pipe(map(res => res.menu));
  }
}
