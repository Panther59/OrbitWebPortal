import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from 'app/_services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticate(state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    return this.authenticate(state);
  }

  private authenticate(state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.check()) {
      // logged in so return true
      return true;
    }

    if (state.url === '/dashboard') {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/auth/login']);
      return false;
    } else {
      // not logged in so redirect to login page with the return url
      const returnUrl = state.url;
      if (returnUrl == '/') {
        this.router.navigate(['/auth/login']);
      } else {
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl } });
      }
      return false;
    }
  }
}
