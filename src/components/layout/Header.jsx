import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const navigate = useNavigate();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  // ✅ AUTH CHECK
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = e.target.search.value;
    if (keyword.trim()) {
      navigate(`/products?search=${keyword}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          ShopEase
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-content" />

        <Navbar.Collapse id="navbar-content">
          {/* Search Bar */}
          <Form className="d-flex mx-auto w-50" onSubmit={handleSearch}>
            <FormControl
              type="search"
              name="search"
              placeholder="Search"
              className="me-2"
            />
          </Form>

          {/* Right Side Actions */}
          <Nav className="ms-auto align-items-center gap-3">

            {/* 🔐 AUTH SECTION */}
            {!isLoggedIn ? (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/profile">
                  👤 Profile
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}

            {/* Wishlist */}
            <Nav.Link
              as={Link}
              to="/wishlist"
              className="position-relative"
            >
              ❤️
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

            {/* Cart */}
            <Nav.Link
              as={Link}
              to="/cart"
              className="position-relative"
            >
              🛒
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
