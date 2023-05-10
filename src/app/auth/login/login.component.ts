/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { CredentialResponse } from 'google-one-tap';
import {
  AuthService,
  LoginService,
  PermissionsService,
  SettingsService,
  TokenService,
} from 'app/_services';
import { ToastrService } from 'ngx-toastr';
import { Group, getMessage } from 'app/global';
import { Organization, Token } from 'app/_models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  returnUrl = '';
  userId?: number;
  showOrgSelection = false;
  allowImpersonate = !environment.production;
  showImpersonate = this.allowImpersonate;
  loginForm = this.fb.nonNullable.group({
    org: [0, [Validators.required]],
  });
  loginImpForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
  });

  organizations?: Organization[];
  // selectedOrganization?: Organization;
  orgGroups: Group<Organization>[] = [];
  get email() {
    return this.loginImpForm.get('email')!;
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
    this.loginUser(undefined, this.loginImpForm.value.email);
  }

  loginForOrg() {
    if (this.loginForm.valid) {
      const org = this.organizations?.find(x => x.id === this.loginForm.value.org);
      this.loginForOrgData(org);
    }
  }

  loginForOrgData(org?: Organization) {
    if (org) {
      this.isSubmitting = true;
      this.authService.loginForOrg(org).subscribe(
        x => {
          const setting = this.settingsService.getUserSetting(this.userId!) ?? {};
          setting.userId = this.userId!;
          setting.selectedOrganization = org;
          this.settingsService.setUserSetting(this.userId!, setting);
          if (!this.returnUrl || this.returnUrl === '' || this.returnUrl === 'auth/login') {
              this.returnUrl = '/';
          }

          this.router.navigateByUrl(this.returnUrl);
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

  loginUser(credential?: string, email?: string) {
    this._ngZone.run(() => {
      this.isSubmitting = true;

      this.loginService.loginWithGoogle(credential, email).subscribe(
        (x: Token) => {
          if (x.userID) {
            this.userId = x.userID;
            this.tokenService.partialSave(x);
            this.permissionsService.getAllOrgsForUser(x.userID).subscribe(orgs => {
              this.organizations = orgs;
              this.orgGroups = orgs.groupBy('type');
              this.showImpersonate = false;
              const userSettings = this.settingsService.getUserSetting(x.userID!);
              let selectedOrganization: Organization | undefined;
              if (this.organizations.length === 1) {
                selectedOrganization = this.organizations[0];
                this.loginForOrgData(selectedOrganization);
              } else {
                if (userSettings) {
                  if (userSettings.selectedOrganization) {
                    selectedOrganization = this.organizations.find(
                      x =>
                        x.type == userSettings.selectedOrganization!.type &&
                        x.id == userSettings.selectedOrganization!.id
                    );
                  }
                }
              }

              if (selectedOrganization?.id) {
                this.loginForm.patchValue({ org: selectedOrganization?.id });
              }

              this.showOrgSelection = true;
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
    });
  }

  resetUser() {
    this.loginForm.reset();
    this.loginImpForm.reset();
    this.organizations = undefined;
    this.showImpersonate = this.allowImpersonate;
    this.showOrgSelection = false;
  }
}
