import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart } = useCart();

  // Price calculations
  const itemsPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge = itemsPrice > 1000 ? 0 : 99;
  const totalPrice = itemsPrice + deliveryCharge;

  return (
    <Container className="mt-4">
      <h4 className="mb-4">My Cart ({cart.length})</h4>

      <Row>
        {/* 🔹 CART ITEMS */}
        <Col md={8}>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <Card className="mb-3" key={item.product._id}>
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="img-fluid"
                      />
                    </Col>

                    <Col md={4}>
                      <h6>{item.product.name}</h6>
                      <p className="fw-bold">₹{item.product.price}</p>
                    </Col>

                    <Col md={3}>
                      <div className="d-flex align-items-center">
                        <Button
                          size="sm"
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.quantity - 1,
                              item.size
                            )
                          }
                          disabled={item.quantity === 1}
                        >
                          −
                        </Button>

                        <span className="mx-2">{item.quantity}</span>

                        <Button
                          size="sm"
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.quantity + 1,
                              item.size
                            )
                          }
                        >
                          +
                        </Button>
                      </div>
                    </Col>

                    <Col md={2}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          removeFromCart(item.product._id, item.size)
                        }
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>

        {/* 🔹 PRICE DETAILS */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <h6>Price Details</h6>
              <hr />

              <p>
                Price ({cart.length} items)
                <span className="float-end">₹{itemsPrice}</span>
              </p>

              <p>
                Delivery Charges
                <span className="float-end">
                  {deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}
                </span>
              </p>

              <hr />

              <h6>
                Total Amount
                <span className="float-end">₹{totalPrice}</span>
              </h6>

              <Button className="w-100 mt-3" onClick={() => navigate("/checkout")}>
                Place Order  
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
