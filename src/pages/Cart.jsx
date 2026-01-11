import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { FaHeart } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, getCartCount, loading } = useCart();
  const { addToWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const cartCount = getCartCount();
  const safeCart = Array.isArray(cart) ? cart : [];

  const validCartItems = safeCart.filter(
    (item) =>
      item &&
      item.product &&
      typeof item.product.price === "number" &&
      typeof item.quantity === "number"
  );

  const itemsPrice = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryCharge =
    itemsPrice > 1000 ? 0 : cartCount > 0 ? 99 : 0;

  const totalPrice = itemsPrice + deliveryCharge;

  const handleMoveToWishlist = async (e, item) => {
    e.preventDefault();
    try {
      await addToWishlist(item.product._id);
      await removeFromCart(item.product._id, item.size);
      showAlert("Moved to wishlist", "success");
    } catch {
      showAlert("Failed to move to wishlist", "danger");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status" />
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h4 className="mb-4">My Cart ({cartCount})</h4>

      <Row>
        {/* ================= CART ITEMS ================= */}
        <Col lg={8} md={7} sm={12} xs={12}>
          {cartCount === 0 ? (
            <div className="text-center my-5">
              <p>Your cart is empty</p>
              <Button onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            validCartItems.map((item) => (
              <Card
                key={`${item.product._id}-${item.size || "na"}`}
                className="mb-3"
              >
                <Card.Body>
                  <Row className="align-items-center">
                    {/* IMAGE */}
                    <Col md={3} sm={4} xs={12} className="text-center mb-3 mb-md-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* DETAILS */}
                    <Col md={4} sm={8} xs={12} className="mb-3 mb-md-0">
                      <h6>{item.product.name}</h6>
                      <p className="fw-bold mb-1">
                        ₹{item.product.price}
                      </p>
                      {item.size && (
                        <small className="text-muted">
                          Size: {item.size}
                        </small>
                      )}
                    </Col>

                    {/* QUANTITY + WISHLIST */}
                    <Col md={3} sm={6} xs={12} className="mb-3 mb-md-0">
                      <div className="d-flex align-items-center mb-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQty(
                              item.product._id,
                              item.quantity - 1,
                              item.size
                            )
                          }
                        >
                          −
                        </Button>

                        <span className="mx-2 fw-bold">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          variant="outline-secondary"
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

                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="w-100"
                        onClick={(e) => handleMoveToWishlist(e, item)}
                      >
                        <FaHeart className="me-1" />
                        Move to Wishlist
                      </Button>
                    </Col>

                    {/* REMOVE */}
                    <Col
                      md={2}
                      sm={6}
                      xs={12}
                      className="text-md-end text-start"
                    >
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="w-100 w-md-auto"
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

        {/* ================= PRICE SUMMARY ================= */}
        <Col lg={4} md={5} sm={12} xs={12} className="mt-4 mt-md-0">
          <Card>
            <Card.Body>
              <h6>Price Details</h6>
              <hr />
              <p>
                Price ({cartCount} items)
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
              <Button
                className="w-100 mt-3"
                disabled={cartCount === 0}
                onClick={() => navigate("/checkout")}
              >
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