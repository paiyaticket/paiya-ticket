import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AutenticationService } from '../../../service/autentication.service';
import { DividerModule } from 'primeng/divider';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DividerModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

    email: string = "";
	password: string = "";

    private router : Router = inject(Router);

    authService : AutenticationService = inject(AutenticationService);

    signinWithGoogle(){
        this.authService.loginWithGoogle();
    }

    signinWithEmailAndPassword() : void{
        console.info(`Email : ${this.email} and Password : ${this.password}`);
		this.authService.loginWithEmailAndPassword(this.email, this.password);
	}

    signinWithAnonymusAccount(){
        this.authService.loginAnonymously();
    }

    register(){
        this.router.navigateByUrl('/auth/register');
    }
}
