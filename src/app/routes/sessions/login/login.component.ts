import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService, LoginService, TokenService } from '@core/authentication';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { CredentialResponse } from 'google-one-tap';
import { UserTokenRequest, Token, User } from '../../../core/authentication/interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  allowImpersonate = !environment.production;
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
  });
  get email() {
    return this.loginForm.get('email')!;
  }
  isSubmitting = false;
  constructor(
    private fb: FormBuilder,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    private tokenService: TokenService,
    private _ngZone: NgZone,
    private router: Router
  ) {}

  ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = `https://accounts.google.com/gsi/client`;
    script1.async = `true`;
    script1.defer = `true`;
    this._renderer2.appendChild(this._document.body, script1);
  }

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts!.id.renderButton(document!.getElementById('loginBtn')!, {
        theme: 'outline',
        size: 'large',
        width: 200,
      });
      // @ts-ignore
      google.accounts.id.prompt();
    };
  }
  async handleCredentialResponse(response: CredentialResponse) {
    this.authService.LoginWithGoogle(response.credential).subscribe(
      (x: any) => {
        this._ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  login() {
    this.isSubmitting = true;

    this.authService.LoginWithGoogle(undefined, this.loginForm.value.email).subscribe(
      (x: any) => {
        this._ngZone.run(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      (error: any) => {
        console.log(error);
        this.isSubmitting = false;
      }
    );
  }
}
