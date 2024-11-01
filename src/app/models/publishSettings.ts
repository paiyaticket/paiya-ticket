export class PublishSettings {
    eventVisibility : EventVisibility | undefined;
    whenToPublish : PublishMoment | undefined;
    publicationScheduledDate : string | undefined;
}

export enum EventVisibility{
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export enum PublishMoment{
    NOW = "NOW",
    SCHEDULED = "SCHEDULED"
}