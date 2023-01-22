import { Toast } from "native-base";
import MyToast from "../componets/toasts/toast";

export function showMyToast({ status, title, description }) {
  Toast.show({
    render: ({}) => {
      return (
        <MyToast status={status} title={title} description={description} />
      );
    },
  });
}
