// src/pages/Home.jsx
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apiService";
import Loader from "../components/common/Loader";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesRes = await API.get("/categories");

        if (
          categoriesRes.data &&
          categoriesRes.data.data &&
          Array.isArray(categoriesRes.data.data.categories)
        ) {
          setCategories(categoriesRes.data.data.categories);
        } else if (Array.isArray(categoriesRes.data.categories)) {
          setCategories(categoriesRes.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setError(error.message || "Failed to load data.");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <Container fluid className="mt-3">
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Something went wrong</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      {/* ================= CATEGORY STRIP ================= */}
      <Row className="justify-content-center text-center mb-4">
        {categories.length === 0 ? (
          <Col xs={12}>
            <p className="text-muted">No categories available</p>
          </Col>
        ) : (
          categories.map((cat, index) => (
            <Col
              key={`category-${cat._id || index}`}
              md={2}
              sm={4}
              xs={6}
              className="mb-3"
            >
              <Card
                className="border-0 shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/products?category=${cat._id || cat.id}`)
                }
              >
                <Card.Img
                  variant="top"
                  src={
                    cat.image ||
                    `https://picsum.photos/seed/category-${index}/300/200`
                  }
                  style={{ height: "120px", objectFit: "cover" }}
                />
                <Card.Body className="p-2">
                  <small className="fw-semibold">{cat.name}</small>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* ================= HERO BANNER ================= */}
<Row className="mb-5">
  <Col>
    <div
      style={{
        height: "350px",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1606813902914-5f4b62c8a4ad?auto=format&fit=crop&w=1600&q=80"
        alt="Hero Banner"
        loading="lazy"
        onError={(e) => {
          e.target.src = "/hero-banner.jpg"; // fallback
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  </Col>
</Row>


      {/* ================= COLLECTION SECTION ================= */}
      <Row className="mb-5">
        {/* NEW ARRIVALS */}
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm p-4 h-100">
            <Row className="align-items-center">
              <Col md={4}>
                <img
                  src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"
                  alt="New Arrivals"
                  className="img-fluid rounded"
                  style={{ height: "120px", objectFit: "cover" }}
                />
              </Col>
              <Col md={8}>
                <small className="text-uppercase text-muted">
                  New Arrivals
                </small>
                <h5 className="mt-2">Summer Collection</h5>
                <p className="text-muted small">
                  Check out our best summer collection to stay stylish this
                  season.
                </p>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* SALE ITEMS */}
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm p-4 h-100">
            <Row className="align-items-center">
              <Col md={4}>
                <img
                  src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
                  alt="Sale Items"
                  className="img-fluid rounded"
                  style={{ height: "120px", objectFit: "cover" }}
                />
              </Col>
              <Col md={8}>
                <small className="text-uppercase text-muted">
                  Special Offers
                </small>
                <h5 className="mt-2">Sale Items</h5>
                <p className="text-muted small">
                  Get amazing discounts on selected items. Limited time offer!
                </p>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;