import { SET_CALENDAR_DAY, SET_CALENDAR_MONTH, SET_CALENDAR_YEAR } from '../constants/calendar';
import { calendar as initialState } from '../initial-state';

const calendarReducer = (state = { ...initialState }, action) => {
    switch (action.type) {
      case SET_CALENDAR_DAY:
          return { ...state, day: action.day};
        case SET_CALENDAR_MONTH:
            return { ...state, month: action.month};
        case SET_CALENDAR_YEAR:
            return { ...state, year: action.year };
        default:
            return state;
    }
};

export default calendarReducer;
