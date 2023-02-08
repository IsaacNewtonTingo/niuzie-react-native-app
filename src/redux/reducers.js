import { SET_NOTIFICATION_NUMBER } from "./actions";

const initialState = {
  notificationNumber: 0,
};

function useReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION_NUMBER:
      return { ...state, notificationNumber: action.payload };

    default:
      return state;
  }
}

export default useReducer;
