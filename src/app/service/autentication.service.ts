import { Injectable, Optional } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AutenticationService {

    constructor(@Optional() private auth : Auth, private router : Router) { }

    toggleGoogleSignIn(){
        const provider = new GoogleAuthProvider();
        signInWithPopup(this.auth, provider).then((user) => {
            if(user)
                this.router.navigateByUrl('/');
        }).catch(this.handleError);
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
