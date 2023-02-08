export const SET_NOTIFICATION_NUMBER = "SET_NOTIFICATION_NUMBER";

export const setNotificationNumber = (notificationNumber) => (dispatch) => {
  dispatch({
    type: SET_NOTIFICATION_NUMBER,
    payload: notificationNumber,
  });
};
