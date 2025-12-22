import { Alert } from "react-bootstrap";
import { useAlert } from "../../context/AlertContext";

const AlertMessage = () => {
  const { alert } = useAlert();

  if (!alert) return null;

  return (
    <Alert
      variant={alert.variant}
      className="position-fixed top-0 start-50 translate-middle-x mt-3"
      style={{ zIndex: 9999 }}
    >
      {alert.message}
    </Alert>
  );
};

export default AlertMessage;
