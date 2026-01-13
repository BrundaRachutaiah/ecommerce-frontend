import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";
import { FaHeart, FaMinus, FaPlus } from "react-icons/fa";

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

  const deliveryCharge = itemsPrice > 1000 ? 0 : cartCount > 0 ? 99 : 0;
  const totalPrice = itemsPrice + deliveryCharge;

  const handleMoveToWishlist = async (e, item) => {
    // Explicitly prevent default to stop any form/anchor triggers
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToWishlist(item.product._id);
      await removeFromCart(item.product._id, item.size);
      showAlert("Moved to wishlist", "success");
    } catch {
      showAlert("Failed to move to wishlist", "danger");
    }
  };

  const handleUpdateQty = async (e, productId, newQty, size) => {
    e.preventDefault();
    e.stopPropagation();
    // Logic is handled by context; UI won't unmount because of the 
    // refined loading check below
    await updateQty(productId, newQty, size);
  };

  // FIX: If we have items already, don't show the full-page loader.
  // This prevents the "page reload" flicker when updating quantities.
  if (loading && safeCart.length === 0) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading your cart...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <div className="d-flex align-items-center mb-4">
        <h4 className="mb-0">My Cart ({cartCount})</h4>
        {/* Subtle loader for background updates */}
        {loading && <Spinner animation="border" size="sm" className="ms-3" />}
      </div>

      <Row>
        {/* ================= CART ITEMS ================= */}
        <Col lg={8} md={7} sm={12} xs={12}>
          {cartCount === 0 ? (
            <div className="text-center my-5 p-5 border rounded bg-light">
              <p className="lead">Your cart is empty</p>
              <Button variant="primary" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            validCartItems.map((item) => (
              <Card
                key={`${item.product._id}-${item.size || "na"}`}
                className="mb-3 shadow-sm"
              >
                <Card.Body>
                  <Row className="align-items-center">
                    {/* IMAGE */}
                    <Col md={3} sm={4} xs={4}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="img-fluid rounded"
                        style={{ maxHeight: "120px", objectFit: "cover" }}
                      />
                    </Col>

                    {/* DETAILS */}
                    <Col md={4} sm={8} xs={8}>
                      <h6 className="text-truncate">{item.product.name}</h6>
                      <p className="fw-bold mb-1">₹{item.product.price}</p>
                      {item.size && (
                        <small className="text-muted d-block mb-2">
                          Size: {item.size}
                        </small>
                      )}
                    </Col>

                    {/* QUANTITY + WISHLIST */}
                    <Col md={3} sm={6} xs={12} className="mt-3 mt-md-0">
                      <div className="d-flex align-items-center mb-2">
                        <Button
                          type="button" // Force type button to prevent form submission
                          size="sm"
                          variant="outline-secondary"
                          disabled={item.quantity <= 1 || loading}
                          onClick={(e) =>
                            handleUpdateQty(e, item.product._id, item.quantity - 1, item.size)
                          }
                        >
                          <FaMinus size={10} />
                        </Button>

                        <span className="mx-3 fw-bold">{item.quantity}</span>

                        <Button
                          type="button"
                          size="sm"
                          variant="outline-secondary"
                          disabled={loading}
                          onClick={(e) =>
                            handleUpdateQty(e, item.product._id, item.quantity + 1, item.size)
                          }
                        >
                          <FaPlus size={10} />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        variant="link"
                        className="text-decoration-none p-0 text-primary"
                        disabled={loading}
                        onClick={(e) => handleMoveToWishlist(e, item)}
                      >
                        <FaHeart className="me-1" />
                        Move to Wishlist
                      </Button>
                    </Col>

                    {/* REMOVE */}
                    <Col md={2} sm={6} xs={12} className="text-md-end mt-2 mt-md-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-danger"
                        disabled={loading}
                        onClick={(e) => {
                            e.preventDefault();
                            removeFromCart(item.product._id, item.size);
                        }}
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
          <Card className="shadow-sm border-0 bg-light">
            <Card.Body>
              <h6 className="fw-bold">PRICE DETAILS</h6>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Price ({cartCount} items)</span>
                <span>₹{itemsPrice}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Charges</span>
                <span className={deliveryCharge === 0 ? "text-success" : ""}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <h6 className="fw-bold">Total Amount</h6>
                <h6 className="fw-bold">₹{totalPrice}</h6>
              </div>
              <Button
                variant="primary"
                className="w-100 py-2 fw-bold"
                disabled={cartCount === 0 || loading}
                onClick={() => navigate("/checkout")}
              >
                PLACE ORDER
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;