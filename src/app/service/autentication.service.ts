import { inject, Injectable, Optional } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { UserData } from '../models/user-data';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

    private auth: Auth = inject(Auth);
	private router: Router = inject(Router);
    private userService : UserService = inject(UserService);

    constructor() { }

    createUserWithEmailAndPassword(email:string, password:string){
        createUserWithEmailAndPassword(this.auth, email, password)
        .then((result) => {
            if(result){
                let userData = this.getAuthenticatedUserData(result.user);
                this.userService.saveUserProfileIfNotExist(userData);
                this.redirectToHomePage();
            }
        })
        .catch((error) => {
            console.error(`User creation with Email and Password failed. ErrorCode : ${error.code} | ErrorMessage : ${error.message}`);
            this.router.navigate(['/auth/login']);
        });
    }

    loginWithGoogle(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(this.auth, provider)
        .then((result) => {
            if(result){
                let userData = this.getAuthenticatedUserData(result.user);
                this.userService.saveUserProfileIfNotExist(userData);
                this.redirectToHomePage();
            }
        })
        .catch(this.handleError);
    }

    loginWithEmailAndPassword(email: string, password: string) {
        signInWithEmailAndPassword(this.auth, email, password)
        .then((result) => {
            let userProfile = this.getAuthenticatedUserData(result.user);
            this.userService.saveUserProfileIfNotExist(userProfile);
            // this.sessionService.add("currentUser", userProfile);
            if(result)
                this.redirectToHomePage();
        })
        .catch((error) => {
            this.handleError(error);
            this.router.navigate(['/auth/login']);
		});
    }

    async loginAnonymously() {
        try {
            const result = await signInAnonymously(this.auth);
            if (result)
                this.redirectToHomePage();
        } catch (error) {
            this.handleError(error);
            this.router.navigate(['/auth/login']);
        };
    }

    logout() {
        signOut(this.auth)
        .then((result) => {
            // this.sessionService.clear();
        })
        .catch((error) => this.handleError(error))
        .finally(()=> this.router.navigate(['/auth/login']))
    }

    updateProfileDisplayNameAndPhotoURLInFireBase(user : UserData){
        if(this.auth.currentUser){
            updateProfile(this.auth.currentUser, {
                displayName: `${user.firstname} ${user.lastname}`, 
                photoURL: user.photoUrl
            }).then(() => {
                console.log("profile updated on side of Firebase");
            }).catch((error) => {
                throw new Error("Cannot update user profile on side of Firebase");
            });
        }
    }

    private redirectToHomePage(){
        this.router.navigate(['my-events']);
    }

    getAuthenticatedUserData(user: User) : UserData {
        var userProfile: UserData = new UserData();
        userProfile.id = user.uid;
        userProfile.displayname = user.displayName;
        userProfile.email = user.email;
        userProfile.phoneNumber = user.phoneNumber;
        userProfile.photoUrl = user.photoURL;
        userProfile.avatarLabel = (user.displayName) ? user.displayName?.charAt(0) : user.email?.charAt(0);

        return userProfile;
    }

    handleError (error : any) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert(
            'You have already signed up with a different auth provider for that email.',
          );
          // If you are using multiple auth providers on your app you should handle linking
          // the user's accounts here.
        } else {
          console.error(error);
        }
    }




}
