export interface EventOrganizer {
    id ?: string | undefined;
    name : string | undefined;
    details : string | undefined;
    email : string | undefined;
    phoneNumbers : string [];
    staffMembers : string [];
    socialMedia : SocialMedia [];
    createdBy ?: string | undefined;
    createdDate ?: string | undefined;
    lastModifiedDate ?: string | undefined;
}

export interface SocialMedia {
    name : string | undefined;
    link : string | undefined;
    icon : string | undefined;
}