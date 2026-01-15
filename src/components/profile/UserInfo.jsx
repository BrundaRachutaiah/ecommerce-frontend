import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

const DEFAULT_USER = {
  name: "Guest User",
  email: "guest@shopease.com",
  phone: "N/A",
};

const UserInfo = () => {
  const [user, setUser] = useState(DEFAULT_USER);

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser({
          name: parsed.name || DEFAULT_USER.name,
          email: parsed.email || DEFAULT_USER.email,
          phone: parsed.phone || DEFAULT_USER.phone,
        });
      } catch (err) {
        // fallback to static data if JSON is invalid
        setUser(DEFAULT_USER);
      }
    }
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body>
        <h6>User Information</h6>
        <hr />

        <p>
          <strong>Name:</strong> {user.name}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
      </Card.Body>
    </Card>
  );
};

export default UserInfo;