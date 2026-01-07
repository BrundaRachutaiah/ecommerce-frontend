// src/pages/Checkout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import API from "../api/apiService";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { showAlert } = useAlert();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     SAFE CART ITEMS
  =============================== */
  const safeCart = Array.isArray(cart) ? cart : [];
  const validCartItems = safeCart.filter(
    (item) =>
      item &&
      item.product &&
      typeof item.product.name === "string" &&
      typeof item.product.price === "number" &&
      typeof item.quantity === "number"
  );

  const itemsPrice = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge =
    itemsPrice > 1000 ? 0 : validCartItems.length > 0 ? 99 : 0;

  const totalPrice = itemsPrice + deliveryCharge;

  /* ===============================
     FETCH ADDRESSES
  =============================== */
  useEffect(() => {
    API.get("/addresses")
      .then((res) => {
        const list = res.data?.data?.addresses || [];
        setAddresses(list);
        if (list.length > 0) setSelectedAddress(list[0]);
      })
      .catch(() => showAlert("Failed to load addresses", "danger"));
  }, [showAlert]);

  /* ===============================
     PLACE ORDER
  =============================== */
  const placeOrder = async () => {
    if (!selectedAddress) {
      showAlert("Select an address", "warning");
      return;
    }

    if (validCartItems.length === 0) {
      showAlert("Cart is empty", "warning");
      return;
    }

    setLoading(true);
    try {
      await API.post("/orders", {
        orderItems: validCartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: selectedAddress,
        paymentMethod: "COD",
        itemsPrice,
        shippingPrice: deliveryCharge,
        totalPrice,
      });

      showAlert("Order placed successfully 🎉", "success");
      await clearCart();
      navigate("/");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to place order",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        {/* ================= ORDER SUMMARY ================= */}
        <Col md={validCartItems.length > 0 ? 8 : 12}>
          <h5>Order Summary</h5>

          {validCartItems.length === 0 ? (
            <Alert variant="info">Your cart is empty</Alert>
          ) : (
            validCartItems.map((item) => (
              <Card key={item.product._id} className="mb-2">
                <Card.Body>
                  <strong>{item.product.name}</strong>
                  <p className="mb-0">
                    ₹{item.product.price} × {item.quantity}
                  </p>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* ================= PRICE DETAILS (ONLY IF CART HAS ITEMS) ================= */}
        {validCartItems.length > 0 && (
          <Col md={4}>
            <Card>
              <Card.Body>
                <h6>Price Details</h6>
                <hr />
                <p>
                  Price ({validCartItems.length} items)
                  <span className="float-end">₹{itemsPrice}</span>
                </p>
                <p>
                  Delivery
                  <span className="float-end">
                    {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                  </span>
                </p>
                <hr />
                <h6>
                  Total
                  <span className="float-end">₹{totalPrice}</span>
                </h6>
                <Button
                  className="w-100 mt-3"
                  disabled={loading}
                  onClick={placeOrder}
                >
                  {loading ? "Placing..." : "Place Order"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Checkout;