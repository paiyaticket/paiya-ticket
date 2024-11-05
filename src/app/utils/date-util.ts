export function utcDateToZonedDateTime(utcDate : string, timeZone : string) : Date {
    const zonedDateTime = new Date(utcDate).toLocaleString("en-US" , {timeZone: timeZone});
    return new Date(zonedDateTime);
}