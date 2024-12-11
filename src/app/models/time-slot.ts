export interface TimeSlot{
    startTime : number | undefined;
    endTime : number | undefined;
    title : string | undefined;
    description : string | undefined;
    speakers : Speaker[] | undefined;
}

export interface Speaker{
    completeName : string | undefined;
    photo : string | undefined;
    description : string | undefined;
}
