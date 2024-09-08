import { CashAccount } from "./cash-account";
import { EventOrganizer } from "./event-organizer";
import { OnlineAddress } from "./online-address";
import { PhysicalAddress } from "./physical-address";

export class Event {
    id : string | undefined;
    title : string | undefined;
    eventType : string | undefined;
    eventCategory : string | undefined;
    tags : string[] = [];
    imageCover : string | undefined;
    resume : string | undefined;
    description : string | undefined;
    publicationDate : string | undefined;
    visibility : boolean = false;
    eventPageLanguage : string | undefined;
    startingDateTime : string | undefined;
    endingDateTime : string | undefined;
    timeZone : string | undefined;
    physicalAddress : PhysicalAddress | undefined;
    onlineAdresse : OnlineAddress | undefined;
    eventOrganizer : EventOrganizer | undefined;
    cashAccounts : CashAccount[] = [];
}
