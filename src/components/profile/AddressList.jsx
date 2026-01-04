import { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import API from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";

const AddressList = () => {
  const { showAlert } = useAlert();

  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ FORM STATE (MATCHES BACKEND SCHEMA EXACTLY)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses");
      setAddresses(res.data?.data?.addresses || []);
      setError("");
    } catch (err) {
      console.error("Error fetching addresses:", err);
      const errorMessage = err.response?.data?.message || "Failed to load addresses";
      setError(errorMessage);
      showAlert(errorMessage, "danger");
    }
  };

  const addAddress = async () => {
    // ✅ STRONG FRONTEND VALIDATION
    if (
      !form.name ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.country
    ) {
      const errorMessage = "Please fill all required fields";
      setError(errorMessage);
      showAlert(errorMessage, "warning");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Sending address data:", form);
      
      const response = await API.post("/addresses/add", {
        name: form.name,
        phone: form.phone,               // ✅ REQUIRED
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,     // ✅ REQUIRED
        country: form.country,
        isDefault: form.isDefault,
      });

      console.log("Address response:", response.data);

      showAlert("Address added successfully", "success");
      setShowModal(false);

      // Reset form
      setForm({
        name: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });

      fetchAddresses();
    } catch (err) {
      console.error("Error adding address:", err);
      
      // Get detailed error information
      let errorMessage = "Failed to add address";
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
        
        // If there's detailed error information, show it
        if (err.response.data?.error) {
          console.error("Detailed error:", err.response.data.error);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("Error request:", err.request);
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", err.message);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      await API.delete(`/addresses/${addressId}`);
      showAlert("Address deleted successfully", "success");
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete address";
      setError(errorMessage);
      showAlert(errorMessage, "danger");
    }
  };

  return (
    <>
      {/* ADDRESS LIST */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <h6>Saved Addresses</h6>
            <Button size="sm" onClick={() => setShowModal(true)}>
              Add Address
            </Button>
          </div>
          <hr />

          {error && <Alert variant="danger">{error}</Alert>}

          {addresses.length === 0 ? (
            <p>No address saved</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="border p-2 mb-2 rounded position-relative">
                {addr.isDefault && (
                  <span className="badge bg-primary position-absolute top-0 end-0 m-2">
                    Default
                  </span>
                )}
                <strong>{addr.name}</strong>
                <p className="mb-0 small">
                  {addr.addressLine1}, {addr.city}, {addr.state} –{" "}
                  {addr.postalCode}
                </p>
                <p className="mb-0 small">📞 {addr.phone}</p>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => deleteAddress(addr._id)}
                >
                  Delete
                </Button>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* ADD ADDRESS MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                placeholder="Address Line 1"
                value={form.addressLine1}
                onChange={(e) =>
                  setForm({ ...form, addressLine1: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address Line 2 (Optional)</Form.Label>
              <Form.Control
                placeholder="Address Line 2 (optional)"
                value={form.addressLine2}
                onChange={(e) =>
                  setForm({ ...form, addressLine2: e.target.value })
                }
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                    placeholder="Postal Code"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    placeholder="Country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Check
              type="checkbox"
              label="Set as default address"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={addAddress} disabled={loading}>
            {loading ? "Saving..." : "Save Address"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddressList;