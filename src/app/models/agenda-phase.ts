export class AgendaPhase{
    order : string | undefined;
    startTime : string | undefined;
    endTime : string | undefined;
    title : string | undefined;
    icon : string | undefined;
    description : string | undefined;
    spekers : Speaker | undefined;
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
