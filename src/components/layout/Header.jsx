import { useState } from "react";
import { Navbar, Nav, Container, Badge, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const navigate = useNavigate();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

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
      SEARCH HANDLER (FIXED)
  =============================== */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    navigate(
      `/products?search=${encodeURIComponent(trimmed)}&_=${Date.now()}`
    );

    // ✅ FIX: clear input after search
    setSearchTerm("");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
      <Container fluid className="px-2 px-md-4">
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          ShopEase
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

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

          {/* RIGHT SIDE ICONS */}
          <Nav className="ms-lg-auto align-items-start align-items-lg-center gap-3 my-2 my-lg-0">
            {/* PROFILE */}
            <Nav.Link as={Link} to="/profile" title="Profile">
              <FaUserCircle size={22} />
            </Nav.Link>

            {/* WISHLIST */}
            <Nav.Link as={Link} to="/wishlist" className="position-relative">
              <FaHeart size={18} />
              {wishlistCount > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: "0.7rem" }}
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
                  style={{ fontSize: "0.7rem" }}
                >
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;