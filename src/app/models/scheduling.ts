export class Scheduling {
    eventReccurency : EventReccurency | undefined;
    scheduledInstances : ScheduledInstance [] = [];
}

export class ScheduledInstance {
    date: Date | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
}

export enum EventReccurency {
    ONCE = "ONCE",
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}