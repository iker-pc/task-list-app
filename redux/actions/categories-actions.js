import { SET_CATEGORIES } from '../constants/categories';

export const setCategories = (categoriesInfo) => ({
   type: SET_CATEGORIES,
   categoriesInfo
});
