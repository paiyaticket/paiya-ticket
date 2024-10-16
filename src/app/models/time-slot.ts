export class TimeSlot{
    order : string | undefined;
    startTime : Date | string | undefined;
    endTime : Date | string | undefined;
    title : string | undefined;
    icon : string | undefined;
    description : string | undefined;
    speakers : Speaker[] | undefined;
}

export class Speaker{
    completeName : string | undefined;
    photo : string | undefined;
    description : string | undefined;
    xlink : string | undefined;
    linkedin : string | undefined;
    instagram : string | undefined;
    facebook : string | undefined;
    twitter : string | undefined;
}
