export interface TimeSlot{
    startTime : string | undefined;
    endTime : string | undefined;
    title : string | undefined;
    description : string | undefined;
    speakers : Speaker[] | undefined;
}

export interface Speaker{
    completeName : string | undefined;
    photo : string | undefined;
    description : string | undefined;
}
