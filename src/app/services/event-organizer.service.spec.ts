import { TestBed } from '@angular/core/testing';

import { EventOrganizerService } from './event-organizer.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('EventOrganizerService', () => {
    let service: EventOrganizerService;
    let httpClientSpy : jasmine.SpyObj<HttpClient>;
    const id : string = '454d7a6sda34354ad4s';

    beforeAll(()=>{
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "patch", "delete"]);
        TestBed.configureTestingModule({
            providers : [EventOrganizerService, {provide : HttpClient, useValue : httpClientSpy}]
        })
        service = TestBed.inject(EventOrganizerService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    });


    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#save method persist a new event organizer', (done : DoneFn) => {
        let expectedEventOrganizer = buildEventOrganizer();
        
        httpClientSpy.post.and.returnValue(of(expectedEventOrganizer));

        service.save(expectedEventOrganizer).subscribe({
            next(value) {
                expect(value).toBe(expectedEventOrganizer);
                expect(httpClientSpy.post).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            },
        })
    });

    it('#listByUserEmail method returns a list of event organizers', (done : DoneFn) => {
        let expectedEventOrganizers = [buildEventOrganizer()];
        let userEmail = 'user@gmail.com';

        httpClientSpy.get.and.returnValue(of(expectedEventOrganizers));

        service.listByUserEmail(userEmail).subscribe({
            next(value) {
                expect(value).toEqual(expectedEventOrganizers);
                expect(httpClientSpy.get).toHaveBeenCalled();
                expect(httpClientSpy.get.calls.first().args[0]).toBe(service.resourcePath);
                expect(httpClientSpy.get.calls.first().args[1]?.params).toEqual({
                    "owner" : userEmail
                });
                done();
            },
            error(err) {
                done.fail(err);
            }
        })
    });

    it('#findById method returns an event organizer', (done : DoneFn) => {
        httpClientSpy.get.and.returnValue(of(buildEventOrganizer()));

        service.findById(id).subscribe({
            next(value) {
                expect(value).toEqual(buildEventOrganizer());
                expect(httpClientSpy.get.calls.first().args[0]).toBe(`${service.resourcePath}/${id}`);
                expect(httpClientSpy.get).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            }
        })
    } );

    it('#update method should update an event organizer', (done : DoneFn) => {
        httpClientSpy.patch.and.returnValue(of(buildEventOrganizer()));

        service.update(buildEventOrganizer()).subscribe({
            next(value) {
                expect(value).toEqual(buildEventOrganizer());
                expect(httpClientSpy.patch).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            }
        });
    } );

    it('#delete method should delete an event organizer', (done : DoneFn) => {
        httpClientSpy.delete.and.returnValue(of(null));

        service.delete(id).subscribe({
            next() {
                expect().nothing();
                expect(httpClientSpy.delete.calls.first().args[0]).toBe(`${service.resourcePath}/${id}`);
                expect(httpClientSpy.delete).toHaveBeenCalled();
                done();
            },
            error(err) {
                done.fail(err);
            }
        });
    } );

});

export function buildEventOrganizer(){
    return {
        id: '454d7a6sda34354ad4s',
        name: 'GAOU Production',
        details: 'Lorem ipsum dolor amit set',
        email: 'gaou@gmail.com',
        phoneNumbers: ['+2250707141516'],
        staffMembers: ['asalfo@gmail.com', 'boude@gmail.com'],
        socialMedia: [],
        createdBy: 'user@gmail.com'
    }
}
