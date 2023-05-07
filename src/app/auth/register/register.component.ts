import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, NgZone, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { LoginService } from 'app/_services';
import { DialogMessageService } from 'app/app-dialogs/_services/dialog-messsage.service';
import { getMessage } from 'app/global';
import { CredentialResponse } from 'google-one-tap';
import { ToastrService } from 'ngx-toastr';

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
    private dialogMessageService: DialogMessageService,
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
    await this.loginService.registerWithGoogle(response.credential).subscribe(
      (x: any) => {
        this._ngZone.run(() => {
          this.dialogMessageService.showMessage(
            'Register',
            'Registration was successful, login now using same account'
          );
          this.router.navigate(['/auth/login']);
        });
      },
      async (error: any) => {
        console.log(error);
        const message = getMessage(error);
        await this.dialogMessageService.showMessage('Register', message);
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
