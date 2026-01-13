import { useState } from "react";
import { Card, Button } from "react-bootstrap";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAlert } from "../../context/AlertContext";
import "../../index.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const [adding, setAdding] = useState(false);

  const isWishlisted = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        showAlert("Removed from wishlist", "danger");
      } else {
        await addToWishlist(product._id);
        showAlert("Added to wishlist", "success");
      }
    } catch {
      showAlert("Wishlist operation failed", "danger");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (adding) return;

    setAdding(true);
    try {
      await addToCart(product._id);
    } finally {
      setAdding(false);
    }
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-warning me-1" />);
      } else if (rating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-warning me-1" />
        );
      } else {
        stars.push(<FaStar key={i} className="text-secondary me-1" />);
      }
    }
    return stars;
  };

  return (
    <Card className="product-card h-100 border-0 shadow-sm">
      {/* IMAGE WRAPPER */}
      <div className="product-img-wrapper position-relative">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
        />

        {/* Updated Button with flexbox centering classes */}
        <Button
          variant="light"
          className="wishlist-btn d-flex align-items-center justify-content-center shadow-sm"
          onClick={handleWishlist}
          style={{ padding: 0 }} // Ensures padding doesn't offset the centered icon
        >
          {isWishlisted ? (
            <FaHeart className="text-danger" />
          ) : (
            <FaRegHeart />
          )}
        </Button>
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="product-title">
          {product.name}
        </Card.Title>

        <div className="d-flex align-items-center mb-2">
          {renderStars(product.rating)}
          <small className="ms-1 text-muted">
            ({product.rating})
          </small>
        </div>

        <Card.Text className="fw-bold text-danger mb-3">
          ₹{product.price}
        </Card.Text>

        <Button
          variant="outline-danger"
          size="sm"
          className="w-100 mt-auto"
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? "Adding..." : "Add to Cart"}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;