import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import API from "../api/apiService";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/common/Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "",
    search: searchParams.get("search") || "",
  });

  /* ===============================
     FETCH CATEGORIES
  =============================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===============================
     FETCH PRODUCTS (BASE DATA)
  =============================== */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.search) params.append("search", filters.search);

        setSearchParams(params);

        const res = await API.get(`/products?${params.toString()}`);
        setProducts(res.data.data.products || []);
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.sort, filters.search, setSearchParams]);

  /* ===============================
     APPLY FRONTEND FILTERS (FIXED)
  =============================== */
  useEffect(() => {
    let temp = [...products];

    // ✅ FIXED RATING FILTER (string → number)
    if (filters.rating) {
      temp = temp.filter(
        (product) =>
          Number(product.rating) >= Number(filters.rating)
      );
    }

    setFilteredProducts(temp);
  }, [products, filters.rating]);

  /* ===============================
     HANDLE FILTER CHANGE
  =============================== */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /* ===============================
     CLEAR FILTERS
  =============================== */
  const clearFilters = () => {
    setFilters({
      category: "",
      rating: "",
      sort: "",
      search: "",
    });
    setSearchParams({});
  };

  if (loading) return <Loader />;

  return (
    <Container fluid className="mt-4">
      <Row>
        {/* ================= FILTERS ================= */}
        <Col md={2} className="border-end">
          <h6>Filters</h6>

          {/* CATEGORY (Single select) */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            {categories.map((cat) => (
              <Form.Check
                key={cat._id}
                type="radio"
                name="category"
                label={cat.name}
                value={cat._id}
                checked={filters.category === cat._id}
                onChange={handleFilterChange}
              />
            ))}
          </Form.Group>

          {/* RATING */}
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            {["4", "3", "2"].map((r) => (
              <Form.Check
                key={r}
                type="radio"
                name="rating"
                label={`${r}★ & above`}
                value={r}
                checked={filters.rating === r}
                onChange={handleFilterChange}
              />
            ))}
          </Form.Group>

          {/* SORT */}
          <Form.Group className="mb-3">
            <Form.Label>Sort by Price</Form.Label>
            <Form.Check
              type="radio"
              name="sort"
              label="Low to High"
              value="price_low_high"
              checked={filters.sort === "price_low_high"}
              onChange={handleFilterChange}
            />
            <Form.Check
              type="radio"
              name="sort"
              label="High to Low"
              value="price_high_low"
              checked={filters.sort === "price_high_low"}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Button
            variant="outline-secondary"
            size="sm"
            className="w-100"
            onClick={clearFilters}
          >
            Clear Filters
          </Button>
        </Col>

        {/* ================= PRODUCTS ================= */}
        <Col md={10}>
          <h6 className="mb-3">
            Showing Products ({filteredProducts.length})
          </h6>

          {filteredProducts.length === 0 ? (
            <div className="text-center my-5">
              <h5>No products found</h5>
              <Button variant="outline-primary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <Row>
              {filteredProducts.map((product) => (
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