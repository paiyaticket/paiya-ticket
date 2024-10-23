export class PublishSettings {
    eventVisibility : EventVisibility | undefined;
    publishMoment : PublishMoment | undefined;
    date : Date | undefined;
    time : string | undefined;
    timezone : string | undefined;
}

export enum EventVisibility{
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE"
}

export enum PublishMoment{
    NOW = "NOW",
    SCHEDULED = "SCHEDULED"
}