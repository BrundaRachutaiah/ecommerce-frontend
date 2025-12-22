import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import API from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // For now, we'll use a mock user since we don't have authentication
        // In a real app, you would fetch this from your API
        const mockUser = {
          name: "Test User",
          email: "test@example.com",
          phone: "1234567890",
        };
        
        setUser(mockUser);
      } catch (error) {
        console.error("Error fetching user data:", error);
        showAlert("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [showAlert]);

  if (loading) {
    return (
      <Card className="mb-4">
        <Card.Body>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6>User Information</h6>
          <Button variant="outline-primary" size="sm">
            Edit Profile
          </Button>
        </div>
        <hr />

        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
      </Card.Body>
    </Card>
  );
};

export default UserInfo;