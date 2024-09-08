export class EventOrganizer {
    id : string | undefined;
    name : string | undefined;
    details : string | undefined;
    email : string | undefined;
    phoneNumbers : string [] = [];
    staffMembers : string [] = [];
    socialMedia : SocialMedia [] = [];
    createdBy : string | undefined | null;
    createdDate : string | undefined;
    lastModifiedDate : string | undefined;
}

export class SocialMedia {
    name : string | undefined;
    link : string | undefined;
    icon : string | undefined;
}