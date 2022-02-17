import { SET_CATEGORIES } from '../constants/categories';
import { categories as initialState } from '../initial-state';

const categoriesReducer = (state = { ...initialState }, action) => {
    switch (action.type) {
        case SET_CATEGORIES:
            return {
              id: action.categoriesInfo.id,
              userId: action.categoriesInfo.userId,
              categories: action.categoriesInfo.categories
            }
        default:
            return state;
    }
};

export default categoriesReducer;
