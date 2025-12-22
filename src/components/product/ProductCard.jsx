// src/components/product/ProductCard.jsx
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; 
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAlert } from "../../context/AlertContext";
import "../../index.css"

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showAlert } = useAlert();

  const isWishlisted = isInWishlist(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    try {
      if (isWishlisted) {
        const result = await removeFromWishlist(product._id);
        showAlert(result.message);
      } else {
        const result = await addToWishlist(product._id);
        showAlert(result.message);
      }
    } catch (error) {
      showAlert("An error occurred with wishlist operation");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const result = await addToCart(product._id);
      showAlert(result.message);
    } catch (error) {
      showAlert("Failed to add to cart");
    }
  };

  // Generate a unique key for this product card
  const uniqueKey = `product-${product._id || product.id || Math.random().toString(36).substr(2, 9)}`;

  return (
    <Card className="product-card h-100 border-0 shadow-sm" key={uniqueKey}>
      <div className="position-relative">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="product-img"
        />
        <Button
          variant="light"
          className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
          onClick={handleWishlist}
        >
          {isWishlisted ? (
            <FaHeart className="text-danger" />
          ) : (
            <FaRegHeart />
          )}
        </Button>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6">{product.name}</Card.Title>
        <Card.Text className="fw-bold text-danger">₹{product.price}</Card.Text>
        <div className="mt-auto">
          <Button
            variant="outline-danger"
            size="sm"
            className="w-100"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;