import { SET_LOADING_STATE } from '../constants/updating';
import { updating as initialState } from '../initial-state';

const miscReducer = (state = { ...initialState }, action) => {
    switch (action.type) {
        case SET_LOADING_STATE:
            return {
              loading: action.updating,
              lastUpdatedDate: action.updatedDate
            };

        default:
            return state;
    }
};

export default miscReducer;
