import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputMaskModule } from 'primeng/inputmask';
import { UserData } from '../../../models/user-data';
import { User, Auth, onAuthStateChanged, UserProfile } from '@angular/fire/auth';
import { MessageService } from 'primeng/api';
// @ts-ignore
import { Country } from '../../../models/country';
import { UserService } from '../../../service/user.service';
import { COUNTRIES } from '../../../data/countries.data';
import { GENDERS } from '../../../data/gender.data';
import { LANGUAGES } from '../../../data/language.data';
import { AutenticationService } from '../../../service/autentication.service';

@Component({
    selector: 'app-user-data',
    standalone: true,
    imports: [
        CommonModule,
        FieldsetModule,
        ReactiveFormsModule,
        ButtonModule,
        DividerModule,
        InputTextModule,
        SelectButtonModule,
        DropdownModule,
        InputGroupModule,
        InputGroupAddonModule,
        InputMaskModule
    ],
    templateUrl: './user-data.component.html',
    styleUrl: './user-data.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDataComponent {

    userProfile : UserData = new UserData();

    userProfileForm : FormGroup = new FormGroup({
        lastname : new FormControl('', [Validators.required]),
        firstname : new FormControl('', [Validators.required]),
        gender: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        language: new FormControl('Français'),
        address: new FormGroup({
            country: new FormControl<Country | null>(null),
            city: new FormControl(''),
            state: new FormControl(''),
            postal: new FormControl(''),
            addressDetail: new FormControl(''),
        })
    });

    currentUser : User | undefined;

    selectedCountryMobileCode : string | undefined;
    mask :  string = "+99999999999?99";    

    countries : Country[] = COUNTRIES;
    genderOptions :any[] = GENDERS;
    languageOptions :any[] = LANGUAGES;

    constructor(private userService : UserService, 
                private auth : Auth, 
                private messageService : MessageService,
                private authService : AutenticationService){
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
            }
        });
    }

    ngOnInit(): void {
        this.initUserProfileForm();
    }

    initUserProfileForm(){
        onAuthStateChanged(this.auth, (user) => {
            if (user) {
                this.currentUser = user;
                
                if(this.currentUser.email !== null)
                    this.userService.getUserProfile(this.currentUser.email).subscribe((userData : UserData) => {
                        this.userProfileForm.patchValue(userData);
                    });
            }
        });
    }

    onCountrySelect(event : DropdownChangeEvent){
        this.selectedCountryMobileCode = event.value.mobileCode;
        this.mask = `${this.selectedCountryMobileCode}99999999?99`;
    }

    onSubmit(){
        this.userProfile = this.userProfileForm.value;
        this.userProfile.id = this.currentUser?.uid;
        this.userProfile.email = this.currentUser?.email;
        this.userProfile.displayname = `${this.userProfile.firstname?.split(' ')[0]} ${this.userProfile.lastname}`;
        this.userService.updateUserProfile(this.userProfile).subscribe(() => {
            if(this.userProfile.displayname !== this.currentUser?.displayName)
                this.authService.updateProfileDisplayNameAndPhotoURLInFireBase(this.userProfile);
            this.messageService.add({ severity: 'success', summary: $localize `Succès`, detail: $localize `Profile mis à jour.` });
        });
    }

    reset() : void {
        this.initUserProfileForm();
    }

    


    // GETTERS
    get lastname() {
        return this.userProfileForm.get('lastname');
    }

    get firstname() {
        return this.userProfileForm.get('firstname');
    }

    get gender() {
        return this.userProfileForm.get('gender');
    }

    get phoneNumber() {
        return this.userProfileForm.get('phoneNumber');
    }

    get language() {
        return this.userProfileForm.get('language');
    }
}
