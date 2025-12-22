// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import API from "../api/apiService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAlert } from "../context/AlertContext";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showAlert } = useAlert();
  
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [recommended, setRecommended] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data.data.product);
        
        // Set default size if available
        if (res.data.data.product.sizes && res.data.data.product.sizes.length > 0) {
          setSize(res.data.data.product.sizes[0]);
        }
        
        // Fetch recommended products
        const recommendedRes = await API.get(`/products/recommended/${id}`);
        setRecommended(recommendedRes.data.data.products || []);
        
        // Fetch featured products
        const featuredRes = await API.get("/products/featured?limit=8");
        setFeaturedProducts(featuredRes.data.data.products || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const result = await addToCart(product._id, qty, size);
      showAlert(result.message);
    } catch (error) {
      showAlert("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    // Add to cart and navigate to checkout
    addToCart(product._id, qty, size).then(() => {
      navigate("/checkout");
    });
  };

  const handleWishlist = async () => {
    try {
      if (isInWishlist(product._id)) {
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

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-warning" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning" />);
    }
    
    return stars;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Product not found</Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        {/* 🔹 PRODUCT IMAGE */}
        <Col md={5}>
          <div className="position-relative">
            <img
              src={product.image}
              alt={product.name}
              className="img-fluid border rounded"
            />
            <Button
              variant="light"
              className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
              onClick={handleWishlist}
            >
              {isInWishlist(product._id) ? (
                <FaHeart className="text-danger" />
              ) : (
                <FaRegHeart />
              )}
            </Button>
          </div>
        </Col>

        {/* 🔹 PRODUCT DETAILS */}
        <Col md={7}>
          <h4 className="fw-bold">{product.name}</h4>

          <div className="d-flex align-items-center mb-3">
            <div className="me-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-muted">({product.numReviews} reviews)</span>
          </div>

          <div className="mb-3">
            <h3 className="fw-bold text-danger">₹{product.price}</h3>
            {product.originalPrice && (
              <div>
                <span className="text-decoration-line-through text-muted">
                  ₹{product.originalPrice}
                </span>
                <span className="badge bg-success ms-2">
                  {Math.round(
                    ((product.originalPrice - product.price) / product.originalPrice) * 100
                  )}% off
                </span>
              </div>
            )}
          </div>

          {/* SIZE SELECTION */}
          {product.sizes?.length > 0 && (
            <div className="mb-3">
              <h6>Size</h6>
              <div className="d-flex flex-wrap">
                {product.sizes.map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? "dark" : "outline-secondary"}
                    className="me-2 mb-2"
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="mb-4">
            <h6>Quantity</h6>
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => setQty(Math.max(1, qty - 1))}
                disabled={qty <= 1}
              >
                -
              </Button>
              <Form.Control
                type="number"
                min="1"
                max={product.countInStock}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="mx-3 text-center"
                style={{ width: "60px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                disabled={qty >= product.countInStock}
              >
                +
              </Button>
            </div>
            <small className="text-muted">
              {product.countInStock > 0 
                ? `${product.countInStock} pieces available` 
                : "Out of stock"}
            </small>
          </div>

          {/* ACTION BUTTONS */}
          <div className="d-flex mb-4">
            <Button
              variant="danger"
              size="lg"
              className="me-3 px-4"
              onClick={handleBuyNow}
              disabled={product.countInStock === 0}
            >
              Buy Now
            </Button>
            <Button
              variant="outline-danger"
              size="lg"
              className="px-4"
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
            >
              Add to Cart
            </Button>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <h6>Description</h6>
            <p className="text-muted">{product.description}</p>
          </div>

          {/* PRODUCT DETAILS */}
          <div className="mb-4">
            <h6>Product Details</h6>
            <ul className="text-muted">
              <li>Material: Premium Quality Fabric</li>
              <li>Style: Modern Fit</li>
              <li>Season: All Season</li>
              <li>Wash Care: Machine Wash</li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* 🔹 FEATURED PRODUCTS SECTION */}
      <Row className="mt-5 mb-4">
        <Col>
          <h4 className="mb-4">Featured Products</h4>
          {featuredProducts.length === 0 ? (
            <p className="text-muted">No featured products available</p>
          ) : (
            <Row>
              {featuredProducts.map((product, index) => (
                <Col key={`featured-${product._id || product.id || index}`} md={3} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* 🔹 RELATED PRODUCTS */}
      <Row className="mb-5">
        <Col>
          <h4 className="mb-4">More items you may like</h4>
          {recommended.length === 0 ? (
            <p className="text-muted">No related products found</p>
          ) : (
            <Row>
              {recommended.map((item, index) => (
                <Col key={`recommended-${item._id || item.id || index}`} md={3} className="mb-4">
                  <ProductCard product={item} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;