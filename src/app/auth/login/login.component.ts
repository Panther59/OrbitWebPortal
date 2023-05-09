/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { CredentialResponse } from 'google-one-tap';
import {
  AuthService,
  ClientService,
  CompanyService,
  LoginService,
  PermissionsService,
  SettingsService,
  TokenService,
} from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { getMessage } from 'app/global';
import { Organization, Token } from 'app/_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  returnUrl = '';
  userId?: number;
  allowImpersonate = !environment.production;
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    org: [''],
  });
  organizations?: Organization[];
  selectedOrganization?: Organization;
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
    private loginService: LoginService,
    private settingsService: SettingsService,
    private permissionsService: PermissionsService,
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

  loginForOrg() {
    if (this.loginForm.valid) {
      const org = this.organizations?.find(x => x.id === this.loginForm.value.org);
      if (org) {
        this.isSubmitting = true;
        this.authService.loginForOrg(org).subscribe(
          x => {
              const setting = this.settingsService.getUserSetting(this.userId!) ?? {};
              setting.userId = this.userId!;
              setting.selectedOrganization = org;
              this.settingsService.setUserSetting(this.userId!, setting);
            this.router.navigateByUrl('/');
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
  }

  loginUser(credential?: string, email?: string) {
    this.isSubmitting = true;

    this.loginService.loginWithGoogle(credential, email).subscribe(
      (x: Token) => {
        if (x.userID) {
          this.userId = x.userID;
          this.tokenService.partialSave(x);
          this.permissionsService.getAllOrgsForUser(x.userID).subscribe(orgs => {
            this.organizations = orgs;
            this.loginForm.controls.org.addValidators(Validators.required);
            const userSettings = this.settingsService.getUserSetting(x.userID!);
            if (userSettings) {
              if (userSettings.selectedOrganization) {
                this.selectedOrganization = this.organizations.find(
                  x =>
                    x.type == userSettings.selectedOrganization!.type &&
                    x.id == userSettings.selectedOrganization!.id
                );

                if (!this.selectedOrganization && this.organizations.length === 1) {
                  this.selectedOrganization = this.organizations[0];
                }
              }
            }
            this.isSubmitting = false;
          });
        }
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
