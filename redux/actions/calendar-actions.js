import { SET_CALENDAR_DAY, SET_CALENDAR_MONTH, SET_CALENDAR_YEAR } from '../constants/calendar';

export const setCalendarDay = (day) => ({
   type: SET_CALENDAR_DAY,
   day
});

export const setCalendarMonth = (month) => ({
   type: SET_CALENDAR_MONTH,
   month
});

export const setCalendarYear = (year) => ({
    type: SET_CALENDAR_YEAR,
    year
});
