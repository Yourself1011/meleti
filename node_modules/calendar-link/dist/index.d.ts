import { CalendarEvent, NormalizedCalendarEvent } from "./interfaces";
export declare const eventify: (event: CalendarEvent) => NormalizedCalendarEvent;
export declare const google: (calendarEvent: CalendarEvent) => string;
export declare const outlook: (calendarEvent: CalendarEvent) => string;
export declare const office365: (calendarEvent: CalendarEvent) => string;
export declare const yahoo: (calendarEvent: CalendarEvent) => string;
export declare const ics: (calendarEvent: CalendarEvent) => string;
export { CalendarEvent };
