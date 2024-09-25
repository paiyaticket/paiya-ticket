import { EventType } from "../enumerations/event-type";
import { AgendaPhase } from "./agenda-phase";
import { CashAccount } from "./cash-account";
import { EventOrganizer } from "./event-organizer";
import { OnlineAddress } from "./online-address";
import { PhysicalAddress } from "./physical-address";
import { PublishSettings } from "./publishSettings";
import { Question } from "./question";
import { Scheduling } from "./scheduling";

export class Event {
    id : string | undefined;
    title : string | undefined;
    eventType : EventType | undefined;
    eventCategory : string | undefined;
    tags : string[] = [];
    imageCover : string | undefined;
    summary : string | undefined;
    description : string | undefined;
    publicationDate : string | undefined;
    published : boolean = false;

    startTime : string | undefined;
    endTime : string | undefined;
    scheduling : Scheduling | undefined;
    timeZone : string | undefined;
    timeZoneOffset : number | undefined;

    eventPageLanguage : string | undefined;
    physicalAddress : PhysicalAddress | undefined;
    onlineAdresse : OnlineAddress | undefined;
    eventOrganizer : EventOrganizer | undefined;
    cashAccounts : CashAccount[] = [];

    publishSettings : PublishSettings | undefined;

    agenda : AgendaPhase[] = [];
    faq : Question[] = [];

    owner : string | undefined;
    createdDate : string | undefined;
    lastModifiedDate : string | undefined;
}
