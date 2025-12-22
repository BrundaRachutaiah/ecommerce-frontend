import { Navbar, Nav, Container, Form, FormControl, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = e.target.search.value;
    if (keyword.trim()) {
      navigate(`/products?search=${keyword}`);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          MyShoppingSite
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
          <Nav className="ms-auto align-items-center gap-2">
            {/* Login Button */}
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>

            {/* Wishlist */}
            <Nav.Link as={Link} to="/wishlist">
              ❤️
            </Nav.Link>

            {/* Cart */}
            <Nav.Link as={Link} to="/cart">
              🛒
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">👤 Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
