import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const moveToCart = async (productId) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-4">My Wishlist</h4>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <Row>
          {wishlist.map((item) => (
            <Col md={3} key={item.product._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={item.product.image}
                  style={{ height: "220px", objectFit: "cover" }}
                />

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-6">
                    {item.product.name}
                  </Card.Title>

                  <p className="fw-bold">₹{item.product.price}</p>

                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-100 mb-2"
                      onClick={() => moveToCart(item.product._id)}
                    >
                      Move to Cart
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      onClick={() =>
                        removeFromWishlist(item.product._id)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;
