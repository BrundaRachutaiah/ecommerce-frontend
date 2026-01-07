import { useEffect, useState } from "react";
import { Navbar, Nav, Container, Badge, Form } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  /* ===============================
     LOGIN CHECK
  =============================== */
  const checkIsLoggedIn = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo || userInfo === "null" || userInfo === "undefined") {
      return false;
    }
    return true;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkIsLoggedIn());

  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn());
  }, [location.pathname]);

  /* ===============================
     SEARCH STATE
  =============================== */
  const [searchTerm, setSearchTerm] = useState("");

  /* ===============================
     COUNTS
  =============================== */
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const wishlistCount = wishlist.length;

  /* ===============================
     LOGOUT
  =============================== */
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  /* ===============================
     SEARCH HANDLER
  =============================== */
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    // Navigate to product listing with search query
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          ShopEase
        </Navbar.Brand>

        {/* SEARCH */}
        <Form
          className="mx-auto w-50"
          onSubmit={handleSearchSubmit}
        >
          <Form.Control
            type="search"
            placeholder="Search products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>

        <Nav className="ms-auto align-items-center gap-3">
          {/* PROFILE */}
          {isLoggedIn && (
            <Nav.Link as={Link} to="/profile" title="My Profile">
              <FaUserCircle size={22} />
            </Nav.Link>
          )}

          {/* LOGIN / LOGOUT */}
          {!isLoggedIn ? (
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          ) : (
            <Nav.Link onClick={logoutHandler}>
              Logout
            </Nav.Link>
          )}

          {/* WISHLIST */}
          <Nav.Link as={Link} to="/wishlist" className="position-relative">
            <FaHeart size={18} />
            {wishlistCount > 0 && (
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {wishlistCount}
              </Badge>
            )}
          </Nav.Link>

          {/* CART */}
          <Nav.Link as={Link} to="/cart" className="position-relative">
            <FaShoppingCart size={18} />
            {cartCount > 0 && (
              <Badge
                bg="primary"
                pill
                className="position-absolute top-0 start-100 translate-middle"
              >
                {cartCount}
              </Badge>
            )}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;