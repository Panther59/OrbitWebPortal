import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { CredentialResponse } from 'google-one-tap';
import { AuthService, TokenService } from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { getMessage } from 'app/global';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  returnUrl = '';
  allowImpersonate = !environment.production;
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
  });
  get email() {
    return this.loginForm.get('email')!;
  }
  isSubmitting = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private authService: AuthService,
    private tokenService: TokenService,
    private _ngZone: NgZone,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngAfterViewInit() {
    const script1 = this._renderer2.createElement('script');
    script1.src = `https://accounts.google.com/gsi/client`;
    script1.async = `true`;
    script1.defer = `true`;
    this._renderer2.appendChild(this._document.body, script1);
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '';

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
    this.loginUser(response.credential, undefined);
  }

  login() {
    this.loginUser(undefined, this.loginForm.value.email);
  }

  loginUser(credential?: string, email?: string) {
    this.isSubmitting = true;

    this.authService.LoginWithGoogle(credential, email).subscribe(
      (x: any) => {
        this._ngZone.run(() => {
          if (Boolean(this.returnUrl) == false || this.returnUrl == '') {
            this.returnUrl = '/dashboard';
          }
          this.router.navigate([this.returnUrl]);
        });
      },
      (error: any) => {
        console.log(error);
        const message = getMessage(error);
        this.toast.error(message);
        this.isSubmitting = false;
      }
    );
  }
}
