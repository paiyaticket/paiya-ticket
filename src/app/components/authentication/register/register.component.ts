import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AutenticationService } from '../../../services/autentication.service';
import { OrganizerLayoutService } from '../../../layouts/organizer-mode-layout/service/organizer.layout.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        RouterLink,
        FormsModule,
        PasswordModule,
        DividerModule
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {

    email: string = '';
	password: string = '';

    private layoutService: OrganizerLayoutService = inject(OrganizerLayoutService); 
    private authService: AutenticationService = inject(AutenticationService);

	signUp(){
		this.authService.createUserWithEmailAndPassword(this.email, this.password);
	}


}
