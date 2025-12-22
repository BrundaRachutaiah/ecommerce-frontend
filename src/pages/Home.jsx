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
  
  // Use useRef to track if data has been fetched
  const hasFetchedData = useRef(false);

  useEffect(() => {
    // Prevent multiple API calls in development mode
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        console.log("Fetching categories from:", API.defaults.baseURL + "/categories");
        const categoriesRes = await API.get("/categories");
        console.log("Categories response:", categoriesRes.data);
        
        // Check if categories data exists and is an array
        if (categoriesRes.data && categoriesRes.data.data && Array.isArray(categoriesRes.data.data.categories)) {
          setCategories(categoriesRes.data.data.categories);
        } else {
          console.error("Categories data is not in expected format:", categoriesRes.data);
          // Try alternative path if data structure is different
          if (categoriesRes.data && Array.isArray(categoriesRes.data.categories)) {
            setCategories(categoriesRes.data.categories);
          } else {
            setCategories([]);
          }
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        setError(error.message || "Failed to load data. Please try again later.");
        
        // Set empty arrays as fallback
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid className="mt-3">
      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <button 
              className="btn btn-outline-danger" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </Alert>
      )}
      
      {/* 🔹 CATEGORY STRIP */}
      <Row className="justify-content-center text-center mb-4">
        {categories.length === 0 ? (
          <Col xs={12}>
            <p className="text-muted">No categories available</p>
          </Col>
        ) : (
          categories.map((cat, index) => (
            <Col key={`category-${cat._id || cat.id || index}`} md={2} sm={4} xs={6} className="mb-3">
              <Card
                className="border-0 shadow-sm h-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products?category=${cat._id || cat.id}`)}
              >
                <Card.Img
                  variant="top"
                  src={cat.image || `https://picsum.photos/seed/category${index}/200/120.jpg`}
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

      {/* 🔹 HERO / BANNER SECTION */}
      <Row className="mb-5">
        <Col>
          <div
            style={{
              height: "350px",
              backgroundColor: "#d9d9d9",
              borderRadius: "6px",
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <h3 className="text-muted">Hero Banner Area</h3>
          </div>
        </Col>
      </Row>

      {/* 🔹 COLLECTION SECTION */}
      <Row className="mb-5">
        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm p-4">
            <Row>
              <Col md={4}>
                <div
                  style={{
                    height: "120px",
                    backgroundColor: "#efefef",
                  }}
                />
              </Col>
              <Col md={8}>
                <small className="text-uppercase text-muted">
                  New Arrivals
                </small>
                <h5 className="mt-2">Summer Collection</h5>
                <p className="text-muted small">
                  Check out our best summer collection to stay stylish this season
                </p>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="border-0 shadow-sm p-4">
            <Row>
              <Col md={4}>
                <div
                  style={{
                    height: "120px",
                    backgroundColor: "#efefef",
                  }}
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