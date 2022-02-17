import { SET_LOADING_STATE } from '../constants/updating';

export const setLoadingState = (updating, updatedDate) => ({
   type: SET_LOADING_STATE,
   updating,
   updatedDate
});
