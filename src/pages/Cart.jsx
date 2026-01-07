import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/AlertContext";

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

  /* ============================
     MOVE TO WISHLIST
  ============================ */
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
    <Container className="mt-4">
      <h4 className="mb-4">My Cart ({cartCount})</h4>

      <Row>
        <Col md={8}>
          {cartCount === 0 ? (
            <div className="text-center my-5">
              <p>Your cart is empty</p>
              <Button type="button" onClick={() => navigate("/products")}>
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
                    <Col md={3}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="img-fluid rounded"
                      />
                    </Col>

                    <Col md={4}>
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

                    <Col md={3}>
                      <div className="d-flex align-items-center mb-2">
                        <Button
                          type="button"
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

                        <span className="mx-2">{item.quantity}</span>

                        <Button
                          type="button"
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
                        type="button"
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={(e) => handleMoveToWishlist(e, item)}
                      >
                        Move to Wishlist
                      </Button>
                    </Col>

                    <Col md={2}>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline-danger"
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

        <Col md={4}>
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
                type="button"
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