import { EventType } from "../enumerations/event-type";
import { TimeSlot } from "./time-slot";
import { CashAccount } from "./cash-account";
import { EventOrganizer } from "./event-organizer";
import { ImageCover } from "./image-cover";
import { OnlineAddress } from "./online-address";
import { PhysicalAddress } from "./physical-address";
import { PublishSettings } from "./publishSettings";
import { Question } from "./question";
import { Scheduling } from "./scheduling";
import { EventStatut } from "../enumerations/event-statut";

export class Event {
    id !: string;
    title : string | undefined;
    eventType : EventType | undefined;
    eventCategory : string | undefined;
    tags : string[] = [];
    imageCovers : ImageCover[] = [];
    videoLink : string | undefined;
    summary : string | undefined;
    description : string | undefined;
    publicationDate : string | undefined;
    published : boolean = false;
    eventStatut : EventStatut = EventStatut.DRAFT;

    startTime : string | undefined;
    endTime : string | undefined;
    scheduling : Scheduling | undefined;
    timeZone : string | undefined;
    timeZoneOffset : number | undefined;

    eventPageLanguage : string | undefined;
    physicalAddress : PhysicalAddress | undefined;
    onlineAdresse : OnlineAddress | undefined;
    eventOrganizer : EventOrganizer | undefined;
    cashAccounts : CashAccount[] = new Array<CashAccount>();

    publishSettings : PublishSettings | undefined;

    agenda : TimeSlot[] = new Array<TimeSlot>();
    faq : Question[] = new Array<Question>();

    owner : string | undefined;
    createdDate : string | undefined;
    lastModifiedDate : string | undefined;
}
