import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/apiService";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "",
    search: searchParams.get("search") || "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (filters.category) params.append("category", filters.category);
        if (filters.rating) params.append("rating", filters.rating);
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.search) params.append("search", filters.search);
        
        const res = await API.get(`/products?${params.toString()}`);
        setProducts(res.data.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? value : "",
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append("category", filters.category);
    if (filters.rating) params.append("rating", filters.rating);
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.search) params.append("search", filters.search);
    
    setSearchParams(params);
    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      rating: "",
      sort: "",
      search: "",
    });
    setSearchParams({});
    navigate("/products");
  };

  if (loading) return <Loader />;

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* 🔹 FILTERS */}
        <Col md={2} className="border-end">
          <h6>Filters</h6>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            {categories.map((cat) => (
              <Form.Check
                key={cat._id}
                type="checkbox"
                label={cat.name}
                name="category"
                value={cat._id}
                checked={filters.category === cat._id}
                onChange={handleFilterChange}
              />
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Check
              type="radio"
              label="4★ & above"
              name="rating"
              value="4"
              checked={filters.rating === "4"}
              onChange={handleFilterChange}
            />
            <Form.Check
              type="radio"
              label="3★ & above"
              name="rating"
              value="3"
              checked={filters.rating === "3"}
              onChange={handleFilterChange}
            />
            <Form.Check
              type="radio"
              label="2★ & above"
              name="rating"
              value="2"
              checked={filters.rating === "2"}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Sort by Price</Form.Label>
            <Form.Check
              type="radio"
              label="Low to High"
              name="sort"
              value="price_low_high"
              checked={filters.sort === "price_low_high"}
              onChange={handleFilterChange}
            />
            <Form.Check
              type="radio"
              label="High to Low"
              name="sort"
              value="price_high_low"
              checked={filters.sort === "price_high_low"}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </Col>

        {/* 🔹 PRODUCTS */}
        <Col md={10}>
          <h6 className="mb-3">
            Showing All Products ({products.length})
          </h6>

          {products.length === 0 ? (
            <div className="text-center my-5">
              <h5>No products found</h5>
              <p>Try adjusting your filters or search terms</p>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <Row>
              {products.map((product) => (
                <Col md={3} key={product._id} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;