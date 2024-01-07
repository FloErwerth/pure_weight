import TimeAgo, { Style } from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import de from "javascript-time-ago/locale/de.json";
import { IsoDate } from "../types/date";
import { Language } from "../store/reducers/settings/types";
import * as Locale from "expo-localization";
import { convertDate } from "./date";

TimeAgo.addLocale(en);
TimeAgo.addLocale(de);
TimeAgo.addLabels("de", "full_day", {
    second: {
        past: {
            one: "vor {0} Sekunde",
            other: "vor {0} Sekunden",
        },
        future: {
            one: "in {0} Sekunde",
            other: "in {0} Sekunden",
        },
    },
    minute: {
        past: {
            one: "vor {0} Minute",
            other: "vor {0} Minuten",
        },
        future: {
            one: "in {0} Minute",
            other: "in {0} Minuten",
        },
    },
    hour: {
        past: {
            one: "vor {0} Stunde",
            other: "vor {0} Stunden",
        },
        future: {
            one: "in {0} Stunde",
            other: "in {0} Stunden",
        },
    },
    day: {
        past: {
            one: "heute",
            other: "heute",
        },
        future: {
            one: "heute",
            other: "heute",
        },
    },
    week: {
        past: {
            one: "vor {0} Woche",
            other: "vor {0} Wochen",
        },
        future: {
            one: "in {0} Woche",
            other: "in {0} Wochen",
        },
    },
    month: {
        past: {
            one: "vor {0} Monat",
            other: "vor {0} Monaten",
        },
        future: {
            one: "in {0} Monat",
            other: "in {0} Monaten",
        },
    },
    year: {
        past: {
            one: "vor {0} Jahr",
            other: "vor {0} Jahren",
        },
        future: {
            one: "in {0} Jahr",
            other: "in {0} Jahren",
        },
    },
});
TimeAgo.addLabels("en", "full_day", {
    second: {
        past: {
            one: "{0} second ago",
            other: "{0} seconds ago",
        },
        future: {
            one: "{0} second later",
            other: "{0} seconds later",
        },
    },
    minute: {
        past: {
            one: "{0} minute ago",
            other: "{0} minutes ago",
        },
        future: {
            one: "{0} minute later",
            other: "{0} minutes later",
        },
    },
    hour: {
        past: {
            one: "{0} hour ago",
            other: "{0} hours ago",
        },
        future: {
            one: "{0} hour later",
            other: "{0} hours later",
        },
    },
    day: {
        past: {
            one: "today",
            other: "today",
        },
        future: {
            one: "today",
            other: "today",
        },
    },
    week: {
        past: {
            one: "{0} week ago",
            other: "{0} weeks ago",
        },
        future: {
            one: "{0} week later",
            other: "{0} weeks later",
        },
    },
    month: {
        past: {
            one: "{0} month ago",
            other: "{0} months ago",
        },
        future: {
            one: "{0} month later",
            other: "{0} months later",
        },
    },
    year: {
        past: {
            one: "{0} year ago",
            other: "{0} years earlier",
        },
        future: {
            one: "{0} year later",
            other: "{0} years later",
        },
    },
});
const customStyle: Style = {
    steps: [
        {
            formatAs: "day",
        },
        {
            formatAs: "day",
        },
        {
            formatAs: "day",
        },
        {
            formatAs: "day",
        },
        {
            formatAs: "day",
        },
        {
            formatAs: "week",
        },
        {
            formatAs: "month",
        },
        {
            formatAs: "year",
        },
    ],
    labels: "full_day",
};

export function getSinceDate(isoDate?: IsoDate, language?: Language): string {
    if (!isoDate) {
        return "";
    }
    const timeAgo = new TimeAgo(language ?? Locale.locale);
    return timeAgo.format(convertDate.toDate(isoDate), customStyle);
}
