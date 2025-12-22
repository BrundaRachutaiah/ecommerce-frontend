import { useEffect, useState } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import API from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";

const AddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/addresses");
      setAddresses(res.data.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showAlert("Failed to load addresses");
    }
  };

  const addAddress = async () => {
    if (!form.name || !form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country) {
      showAlert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/addresses/add", form);
      setAddresses(res.data.data.addresses || []);
      showAlert("Address added successfully");
      setShowAddModal(false);
      setForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error adding address:", error);
      showAlert("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async () => {
    if (!form.name || !form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country) {
      showAlert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await API.put(`/addresses/${editingAddress._id}`, form);
      setAddresses(res.data.data.addresses || []);
      showAlert("Address updated successfully");
      setShowEditModal(false);
      setEditingAddress(null);
      setForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
      });
    } catch (error) {
      console.error("Error updating address:", error);
      showAlert("Failed to update address");
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
      setAddresses(addresses.filter(addr => addr._id !== addressId));
      showAlert("Address deleted successfully");
    } catch (error) {
      console.error("Error deleting address:", error);
      showAlert("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setForm({
      name: address.name,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault || false,
    });
    setShowEditModal(true);
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>Saved Addresses</h6>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              Add New Address
            </Button>
          </div>
          <hr />

          {addresses.length === 0 ? (
            <p>No addresses saved yet</p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>{addr.name}</strong>
                    {addr.isDefault && <span className="badge bg-primary ms-2">Default</span>}
                    <p className="mb-0 small">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                    </p>
                    <p className="mb-0 small">
                      {addr.city}, {addr.state}, {addr.postalCode}
                    </p>
                    <p className="mb-0 small">
                      {addr.country}
                    </p>
                    {addr.phone && <p className="mb-0 small">Phone: {addr.phone}</p>}
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditAddress(addr)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => deleteAddress(addr._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* Add Address Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(form).map((key) => (
            <Form.Group key={key} className="mb-2">
              <Form.Control
                type={key === 'isDefault' ? 'checkbox' : 'text'}
                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={key === 'isDefault' ? undefined : form[key]}
                checked={key === 'isDefault' ? form[key] : undefined}
                onChange={(e) =>
                  setForm({ 
                    ...form, 
                    [key]: key === 'isDefault' ? e.target.checked : e.target.value 
                  })
                }
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addAddress} disabled={loading}>
            {loading ? "Adding..." : "Add Address"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Address Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(form).map((key) => (
            <Form.Group key={key} className="mb-2">
              <Form.Control
                type={key === 'isDefault' ? 'checkbox' : 'text'}
                placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={key === 'isDefault' ? undefined : form[key]}
                checked={key === 'isDefault' ? form[key] : undefined}
                onChange={(e) =>
                  setForm({ 
                    ...form, 
                    [key]: key === 'isDefault' ? e.target.checked : e.target.value 
                  })
                }
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={updateAddress} disabled={loading}>
            {loading ? "Updating..." : "Update Address"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddressList;