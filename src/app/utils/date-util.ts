export function utcDateToZonedDateTime(utcDate : string, timeZone ?: string) : Date {
    const zonedDateTime = (timeZone) ? new Date(utcDate).toLocaleString("en-US" , {timeZone: timeZone}) : new Date(utcDate).toLocaleString("en-US");
    return new Date(zonedDateTime);
}