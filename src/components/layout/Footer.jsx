import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-light pt-4 pb-3">
      <Container>
        <Row>
          {/* Brand Info */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">ShopEase</h5>
            <p className="small">
              Your one-stop destination for quality products at the best prices.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-light text-decoration-none">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-light text-decoration-none">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-light text-decoration-none">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-light text-decoration-none">
                  Cart
                </Link>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Contact</h6>
            <p className="small mb-1">Email: support@myshoppingsite.com</p>
            <p className="small">Phone: +91 98765 43210</p>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <div className="text-center small">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;