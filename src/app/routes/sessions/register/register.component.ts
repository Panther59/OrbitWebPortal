import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginService } from '@core';
import { environment } from '@env/environment';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, AfterViewInit {


  constructor(
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document,
    private loginService: LoginService,
    private _ngZone: NgZone,
    private router: Router){}

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
      google.accounts!.id.renderButton( document!.getElementById('loginBtn')!, { theme: 'outline', size: 'large', width: 200 } );
      // @ts-ignore
      google.accounts.id.prompt();
    };
  }
  async handleCredentialResponse(response: CredentialResponse) {
    await this.loginService.registerWithGoogle(response.credential).subscribe(
      (x: any) => {
        this._ngZone.run(() => {
          this.router.navigate(['/login']);
        });
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }
}
