export function utcDateToZonedDateTime(utcDate : string, timeZone ?: string) : Date {
    const zonedDateTime = (utcDate && timeZone) ? new Date(utcDate).toLocaleString("en-US" , {timeZone: timeZone}) : new Date(utcDate).toLocaleString("en-US");
    return new Date(zonedDateTime);
}

export function isSameDay(date1 : Date, date2 : Date){
    if(!date1 || !date2){
        return false;
    }
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}