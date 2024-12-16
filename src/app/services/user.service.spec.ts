import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { UserData } from '../models/user-data';
import { asyncData, asyncError } from '../utils/async-observable-helpers';

describe('UserService', () => {

    const EMAIL = "user@gmail.com";
    const ID = "454d7a6sda34354ad4s";
    const FIRSTNAME = "John";
    const LASTTNAME = "Doe";

    let service: UserService;
    let httpClientSpy : jasmine.SpyObj<HttpClient>;

    beforeAll(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "patch", "delete"]);

        TestBed.configureTestingModule({
            providers : [UserService, {provide : HttpClient, useValue : httpClientSpy}]
        });

        service = TestBed.inject(UserService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("#getUserProfile should return expected userProfile by email", (done : DoneFn) => {
        const expectedUser = buildUserProfile();

        httpClientSpy.get.and.returnValue(asyncData(expectedUser));

        service.getUserProfile(EMAIL).subscribe((data) => {
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

        service.getUserProfile(EMAIL).subscribe({
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

        service.isUserProfileAlreadyExist(EMAIL).subscribe( data => {
            expect(data).toBe(true);
            done();
        });
    });

    it("#isUserProfileAlreadyExist should return false", (done : DoneFn) => {
        httpClientSpy.get.and.returnValue(asyncData(false));

        service.isUserProfileAlreadyExist(EMAIL).subscribe( data => {
            expect(data).toBe(false);
            done();
        });
    });

    

    
    it("#saveUserProfileIfNotExist should save (isUserProfileAlreadyExist = false)", (done : DoneFn) => {
        const user = buildUserProfile();
        httpClientSpy.get.and.returnValue(of(false));
        httpClientSpy.post.and.returnValue(of(user));

        service.saveUserProfileIfNotExist(user);
        done();

        expect(httpClientSpy.get).toHaveBeenCalled();
        expect(httpClientSpy.post).toHaveBeenCalled();

    });
    
    


    function buildUserProfile() {
        const expectedUser : UserData = new UserData();
        expectedUser.email = EMAIL;
        expectedUser.firstname = FIRSTNAME;
        expectedUser.lastname = LASTTNAME;
    
        return expectedUser;
    }
});
