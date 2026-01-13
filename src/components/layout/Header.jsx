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
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
      <Container fluid className="px-2 px-md-4">
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          ShopEase
        </Navbar.Brand>

        {/* MOBILE TOGGLE */}
        <Navbar.Toggle aria-controls="main-navbar" />

        {/* COLLAPSIBLE CONTENT */}
        <Navbar.Collapse id="main-navbar">
          {/* SEARCH */}
          <Form
            className="mx-lg-3 my-2 my-lg-0 flex-grow-1"
            onSubmit={handleSearchSubmit}
          >
            <Form.Control
              type="search"
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>

          {/* RIGHT SIDE ICONS - Arranged vertically on mobile, horizontal on lg */}
          <Nav className="ms-lg-auto align-items-start align-items-lg-center gap-3 my-2 my-lg-0">
            {/* PROFILE */}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/profile" title="My Profile" className="py-2 py-lg-0">
                <FaUserCircle size={22} />
              </Nav.Link>
            )}

            {/* LOGIN / LOGOUT */}
            {!isLoggedIn ? (
              <Nav.Link as={Link} to="/login" className="py-2 py-lg-0">
                Login
              </Nav.Link>
            ) : (
              <Nav.Link onClick={logoutHandler} className="py-2 py-lg-0">
                Logout
              </Nav.Link>
            )}

            {/* WISHLIST */}
            <Nav.Link as={Link} to="/wishlist" className="position-relative py-2 py-lg-0">
              <div className="d-flex align-items-center">
                <FaHeart size={18} />
                {wishlistCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="ms-2 ms-lg-0 position-lg-absolute top-lg-0 start-lg-100 translate-middle-lg"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </div>
            </Nav.Link>

            {/* CART */}
            <Nav.Link as={Link} to="/cart" className="position-relative py-2 py-lg-0">
              <div className="d-flex align-items-center">
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <Badge
                    bg="primary"
                    pill
                    className="ms-2 ms-lg-0 position-lg-absolute top-lg-0 start-lg-100 translate-middle-lg"
                    style={{ fontSize: "0.7rem" }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;