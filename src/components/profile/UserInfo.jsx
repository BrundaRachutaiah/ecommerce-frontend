import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body>
        <h6>User Information</h6>
        <hr />
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone || "N/A"}</p>
      </Card.Body>
    </Card>
  );
};

export default UserInfo;