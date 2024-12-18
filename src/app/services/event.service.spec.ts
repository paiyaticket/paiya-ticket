import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';
import { HttpClient } from '@angular/common/http';
import { Event } from '@models/event';
import { EventType } from '@enumerations/event-type';
import { of } from 'rxjs';

describe('EventService', () => {
    let service: EventService;
    let httpClientSpy : jasmine.SpyObj<HttpClient>;

    beforeAll(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "patch", "delete"]);

        TestBed.configureTestingModule({
            providers : [EventService, {provide : HttpClient, useValue : httpClientSpy}]
        });

        service = TestBed.inject(EventService);
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('#save method should persist a new event', (done : DoneFn) => {
        let expectedEvent : Event = buildEvent();
        httpClientSpy.post.and.returnValue(of(expectedEvent));

        service.save(expectedEvent).subscribe({
            next(value) {
                expect(value).toBe(expectedEvent);
                expect(httpClientSpy.post).toHaveBeenCalled();
                expect(httpClientSpy.post.calls.first().args[0]).toBe(service.resourcePath);
                done();
            },
            error(err) {
                done.fail(err);
            },
        });
    });

    it('#findByOwner method should return a list of events', (done : DoneFn) => {
        let expectedEvents : Event[] = [buildEvent()];
        let owner = 'user@gmail.com';

        httpClientSpy.get.and.returnValue(of(expectedEvents));

        service.findByOwner(owner).subscribe({
            next(value) {
                expect(value).toBe(expectedEvents);
                expect(httpClientSpy.get).toHaveBeenCalled();
                expect(httpClientSpy.get.calls.first().args[0]).toBe(`${service.resourcePath}/owned-by`);
                expect(httpClientSpy.get.calls.first().args[1]?.params).toEqual({
                    "owner" : owner
                });
                done();
            },
            error(err) {
                done.fail(err);
            }
        })
    } );

    it('#findById method should return an event', (done: DoneFn) => {
        let id = '454d7a6sda34354ad4s';
        let expectedEvent : Event = buildEvent();


        httpClientSpy.get.and.returnValue(of(buildEvent()));

        service.findById(id).subscribe({
            next(value) {
                expect(value).toEqual(expectedEvent);
                expect(httpClientSpy.get).toHaveBeenCalledWith(`${service.resourcePath}/${id}`);
                done();
            },
            error(err) {
                done.fail(err);
            }
        })
    })

    it('#update method should update an event', (done : DoneFn) => {
        let expectedEvent : Event = buildEvent();
        expectedEvent.id = '454d7a6sda34354ad4s';

        httpClientSpy.patch.and.returnValue(of(expectedEvent));

        service.update(expectedEvent).subscribe({
            next(value) {
                expect(value).toBe(expectedEvent);
                expect(httpClientSpy.patch).toHaveBeenCalled();
                expect(httpClientSpy.patch.calls.first().args[0]).toBe(`${service.resourcePath}/${expectedEvent.id}`);
                done();
            },
            error(err) {
                done.fail(err);
            }
        });
    })

    it('#delete method should delete an event', () => {
        let id = '454d7a6sda34354ad4s';

        httpClientSpy.delete.and.returnValue(of(null));

        service.delete(id).subscribe();

        expect(httpClientSpy.delete).toHaveBeenCalled();
        expect(httpClientSpy.delete.calls.first().args[0]).toBe(`${service.resourcePath}/${id}`);
        expect().nothing();
    })
});

export function buildEvent() {
    let event : Event = {
        title : 'Test Event',
        eventType : EventType.SINGLE_EVENT,
        startTime : 1734532001,
        endTime : 1734539201,
        physicalAddress : {
            location : "Parc Des Expositions D'Abidjan, Bd de l'Aéroport, Abidjan, Côte d’Ivoire"
        }
    }

    return event;
}