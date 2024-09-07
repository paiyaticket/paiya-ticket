import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { UserData } from '../models/UserProfile';
import { asyncData, asyncError } from '../utils/async-observable-helpers';

describe('UserService', () => {

    const EMAIL = "user@gmail.com";
    const ID = "454d7a6sda34354ad4s";
    const FIRSTNAME = "John";
    const LASTTNAME = "Doe";

    let userService: UserService;
    let httpClientSpy : jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        userService = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(userService).toBeTruthy();
    });

    beforeEach(() => {
        const httpSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "patch", "delete"]);
        TestBed.configureTestingModule({
            providers : [UserService, {provide : HttpClient, useValue : httpSpy}]
        })
        userService = TestBed.inject(UserService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    })

    it("#getUserProfile should return expected userProfile by email", (done : DoneFn) => {
        const expectedUser = buildUserProfile();

        httpClientSpy.get.and.returnValue(asyncData(expectedUser));

        userService.getUserProfile(EMAIL).subscribe((data) => {
            expect(data).withContext("user with matching email").toBe(expectedUser);
            done();
        });
        
    });

    it("#getUserProfile should return an Error if not found", (done : DoneFn) => {
        const expectedError = new HttpErrorResponse({
            status : 404,
            statusText : "No such element found"
        })

        httpClientSpy.get.and.returnValue(asyncError(expectedError));

        userService.getUserProfile(EMAIL).subscribe({
            next: (user) => {
                done.fail()
            },
            error : (error) => {
                expect(error).toBe(expectedError);
                done();
            }
        })

        expect(httpClientSpy.get).toHaveBeenCalled();
    });
    

    it("#isUserProfileAlreadyExist should return true", (done : DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(true));

        userService.isUserProfileAlreadyExist(EMAIL).subscribe( data => {
            expect(data).toBe(true);
            done();
        });
    });

    it("#isUserProfileAlreadyExist should return false", (done : DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(false));

        userService.isUserProfileAlreadyExist(EMAIL).subscribe( data => {
            expect(data).toBe(false);
            done();
        });
    });

    

    
    xit("#saveUserProfileIfNotExist should save (isUserProfileAlreadyExist = false)", (done : DoneFn) => {
        const user = buildUserProfile();
        httpClientSpy.get.and.returnValue(of(false));
        httpClientSpy.post;

        userService.saveUserProfileIfNotExist(user);
        done();

        expect(httpClientSpy.get).toHaveBeenCalled();

    });
    
    


    function buildUserProfile() {
        const expectedUser : UserData = new UserData();
        expectedUser.email = EMAIL;
        expectedUser.firstname = FIRSTNAME;
        expectedUser.lastname = LASTTNAME;
    
        return expectedUser;
    }
});
