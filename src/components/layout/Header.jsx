import { Navbar, Nav, Container, Badge, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const navigate = useNavigate();

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // ✅ Cart quantity sum
  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const wishlistCount = wishlist.length;

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          ShopEase
        </Navbar.Brand>

        {/* SEARCH */}
        <Form className="mx-auto w-50">
          <Form.Control type="search" placeholder="Search" />
        </Form>

        <Nav className="ms-auto align-items-center gap-3">
          {/* PROFILE (ONLY WHEN LOGGED IN) */}
          {isLoggedIn && (
            <Nav.Link as={Link} to="/profile">
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