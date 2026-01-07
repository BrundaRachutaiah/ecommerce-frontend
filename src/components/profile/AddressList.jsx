import { useEffect, useState } from "react";
import { Card, Button, Form, Modal, Alert, Row, Col } from "react-bootstrap";
import API from "../../api/apiService";
import { useAlert } from "../../context/AlertContext";

const AddressList = ({ onSelect }) => {
  const { showAlert } = useAlert();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const list = res.data?.data?.addresses || [];
      setAddresses(list);

      const defaultAddr = list.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        onSelect?.(defaultAddr);
      }
    } catch (err) {
      showAlert("Failed to load addresses", "danger");
    }
  };

  /* ======================
     ADD / UPDATE ADDRESS
  ====================== */
  const saveAddress = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.postalCode ||
      !form.country
    ) {
      showAlert("Please fill all required fields", "warning");
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/addresses/${editingId}`, form);
        showAlert("Address updated successfully", "success");
      } else {
        await API.post("/addresses/add", form);
        showAlert("Address added successfully", "success");
      }

      setShowModal(false);
      resetForm();
      fetchAddresses();
    } catch {
      showAlert("Failed to save address", "danger");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
    setIsEdit(false);
    setEditingId(null);
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditingId(addr._id);
    setIsEdit(true);
    setShowModal(true);
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await API.delete(`/addresses/${id}`);
    showAlert("Address deleted", "success");
    fetchAddresses();
  };

  const handleSelect = (addr) => {
    setSelectedAddressId(addr._id);
    onSelect?.(addr);
  };

  return (
    <>
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between">
            <h6>Saved Addresses</h6>
            <Button size="sm" onClick={() => setShowModal(true)}>
              Add Address
            </Button>
          </div>
          <hr />

          {addresses.length === 0 ? (
            <p>No address saved</p>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-2 mb-2 rounded ${
                  selectedAddressId === addr._id ? "border-primary" : ""
                }`}
              >
                <Form.Check
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressId === addr._id}
                  onChange={() => handleSelect(addr)}
                  label={
                    <>
                      <strong>{addr.name}</strong>
                      <p className="mb-0 small">
                        {addr.addressLine1}, {addr.city},{" "}
                        {addr.state} – {addr.postalCode}
                      </p>
                      <small>📞 {addr.phone}</small>
                    </>
                  }
                />

                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleEdit(addr)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => deleteAddress(addr._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </Card.Body>
      </Card>

      {/* ADD / EDIT MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit Address" : "Add Address"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {Object.keys(form).map(
              (key) =>
                key !== "isDefault" && (
                  <Form.Group className="mb-2" key={key}>
                    <Form.Control
                      placeholder={key}
                      value={form[key] || ""}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                    />
                  </Form.Group>
                )
            )}

            <Form.Check
              label="Set as default"
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
          <Button onClick={saveAddress} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddressList;