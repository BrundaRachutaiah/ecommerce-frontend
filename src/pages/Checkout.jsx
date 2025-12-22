import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Alert } from "react-bootstrap";
import API from "../api/apiService";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice } = useCart();
  const { showAlert } = useAlert();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get("/addresses");
        setAddresses(res.data.data.addresses || []);
        
        // Set first address as default if available
        if (res.data.data.addresses.length > 0) {
          setSelectedAddress(res.data.data.addresses[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        showAlert("Failed to load addresses");
      }
    };

    fetchAddresses();
  }, [showAlert]);

  const addAddress = async () => {
    try {
      const res = await API.post("/addresses/add", form);
      setAddresses(res.data.data.addresses || []);
      
      // Set the new address as selected
      const newAddress = res.data.data.addresses[res.data.data.addresses.length - 1];
      setSelectedAddress(newAddress);
      
      showAlert("Address added successfully");
      setForm({
        name: "",
        addressLine1: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      showAlert("Failed to add address");
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      showAlert("Please select an address");
      return;
    }

    if (cart.length === 0) {
      showAlert("Your cart is empty");
      return;
    }

    setLoading(true);
    
    try {
      const itemsPrice = getTotalPrice();
      const taxPrice = itemsPrice * 0.1; // 10% tax
      const shippingPrice = itemsPrice > 1000 ? 0 : 99; // Free shipping for orders over 1000
      
      await API.post("/orders", {
        orderItems: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
        })),
        shippingAddress: selectedAddress,
        paymentMethod: "COD",
        itemsPrice,
        taxPrice,
        shippingPrice,
      });
      
      setOrderPlaced(true);
      showAlert("Order Placed Successfully 🎉");
      
      // Clear cart after successful order
      await clearCart();
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      const message = error.response?.data?.message || "Failed to place order";
      showAlert(message);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container className="mt-4">
        <Alert variant="success" className="text-center">
          <h4>Order Placed Successfully!</h4>
          <p>Thank you for your purchase. You will be redirected to the home page shortly.</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {/* ADDRESS SECTION */}
        <Col md={7}>
          <h5>Select Address</h5>

          {addresses.length === 0 ? (
            <Alert variant="info">
              No addresses saved. Please add a new address.
            </Alert>
          ) : (
            addresses.map((addr) => (
              <Card
                key={addr._id}
                className={`mb-2 ${
                  selectedAddress?._id === addr._id ? "border-primary" : ""
                }`}
                onClick={() => setSelectedAddress(addr)}
                style={{ cursor: "pointer" }}
              >
                <Card.Body>
                  <strong>{addr.name}</strong>
                  <p className="mb-0 small">
                    {addr.addressLine1}, {addr.city}, {addr.state}, {addr.postalCode}
                  </p>
                </Card.Body>
              </Card>
            ))
          )}

          <h6 className="mt-4">Add New Address</h6>

          {Object.keys(form).map((key) => (
            <Form.Control
              key={key}
              placeholder={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              className="mb-2"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          ))}

          <Button onClick={addAddress}>Add Address</Button>
        </Col>

        {/* ORDER SUMMARY */}
        <Col md={5}>
          <Card>
            <Card.Body>
              <h6>Order Summary</h6>
              <hr />

              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <p key={item.product._id} className="small">
                      {item.product.name} × {item.quantity}
                      <span className="float-end">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </p>
                  ))}

                  <hr />
                  
                  <p>
                    Subtotal
                    <span className="float-end">₹{getTotalPrice()}</span>
                  </p>
                  
                  <p>
                    Tax (10%)
                    <span className="float-end">₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </p>
                  
                  <p>
                    Delivery Charges
                    <span className="float-end">
                      {getTotalPrice() > 1000 ? "Free" : `₹99`}
                    </span>
                  </p>
                  
                  <hr />
                  
                  <h6>
                    Total Amount
                    <span className="float-end">
                      ₹{getTotalPrice() > 1000 
                        ? (getTotalPrice() * 1.1).toFixed(2)
                        : (getTotalPrice() * 1.1 + 99).toFixed(2)
                      }
                    </span>
                  </h6>
                  
                  <Button 
                    className="w-100 mt-3" 
                    onClick={placeOrder}
                    disabled={loading || !selectedAddress || cart.length === 0}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;