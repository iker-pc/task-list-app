import calendarReducer from './calendar-reducer';
import categoriesReducer from './categories-reducer';
import tasksListsReducer from './tasks-lists-reducer';
import miscReducer from './updating-reducer';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    calendar: calendarReducer,
    categoriesInfo: categoriesReducer,
    tasks: tasksListsReducer,
    misc: miscReducer,
});

export default rootReducer;
