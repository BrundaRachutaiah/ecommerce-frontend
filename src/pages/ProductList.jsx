import { useEffect, useState, useCallback } from "react";
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

  /* ===============================
      FILTER STATE (URL → STATE)
  =============================== */
  const [filters, setFilters] = useState({
    categories: searchParams.get("category")
      ? searchParams.get("category").split(",")
      : [],
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "",
    search: searchParams.get("search") || "",
  });

  /* ===============================
      SYNC URL → FILTER STATE
  =============================== */
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: searchParams.get("category")
        ? searchParams.get("category").split(",")
        : [],
      rating: searchParams.get("rating") || "",
      sort: searchParams.get("sort") || "",
      search: searchParams.get("search") || "",
    }));
  }, [searchParams]);

  /* ===============================
      FETCH CATEGORIES
  =============================== */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.error("Category error:", err);
      }
    };
    fetchCategories();
  }, []);

  /* ===============================
      FETCH PRODUCTS
  =============================== */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.categories.length)
          params.append("category", filters.categories.join(","));
        if (filters.sort) params.append("sort", filters.sort);
        if (filters.search) params.append("search", filters.search);

        const res = await API.get(`/products?${params.toString()}`);
        setProducts(res.data.data.products || []);
      } catch (err) {
        console.error("Products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.categories, filters.sort, filters.search]);

  /* ===============================
      FRONTEND FILTER (RATING)
  =============================== */
  useEffect(() => {
    let temp = [...products];
    if (filters.rating) {
      temp = temp.filter(
        p => Number(p.rating) >= Number(filters.rating)
      );
    }
    setFilteredProducts(temp);
  }, [products, filters.rating]);

  /* ===============================
      URL SYNC
  =============================== */
  const syncUrlParams = useCallback((updatedFilters) => {
    const params = new URLSearchParams();

    if (updatedFilters.categories.length)
      params.set("category", updatedFilters.categories.join(","));
    if (updatedFilters.rating) params.set("rating", updatedFilters.rating);
    if (updatedFilters.sort) params.set("sort", updatedFilters.sort);
    if (updatedFilters.search) params.set("search", updatedFilters.search);

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  /* ===============================
      HANDLERS
  =============================== */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    syncUrlParams(updated);
  };

  const handleCategoryChange = (catId) => {
    setFilters(prev => {
      const updatedCategories = prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId];

      const updated = { ...prev, categories: updatedCategories };
      syncUrlParams(updated);
      return updated;
    });
  };

  const clearFilters = () => {
    const cleared = { categories: [], rating: "", sort: "", search: "" };
    setFilters(cleared);
    setSearchParams({}, { replace: true });
  };

  return (
    <Container fluid className="mt-4 px-3 px-lg-4">
      <Row>
        {/* FILTER SIDEBAR */}
        <Col
          lg={2}
          md={3}
          sm={12}
          className="border-end mb-4 mb-md-0 px-3"
        >
          <h6 className="mb-3">Filters</h6>

          <Form onSubmit={(e) => e.preventDefault()}>
            {/* CATEGORY */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Category</Form.Label>
              <div className="ps-1">
                {categories.map(cat => (
                  <Form.Check
                    key={cat._id}
                    type="checkbox"
                    label={cat.name}
                    className="mb-2"
                    checked={filters.categories.includes(cat._id)}
                    onChange={() => handleCategoryChange(cat._id)}
                  />
                ))}
              </div>
            </Form.Group>

            {/* RATING */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Rating</Form.Label>
              {["4", "3", "2"].map(r => (
                <Form.Check
                  key={r}
                  type="radio"
                  name="rating"
                  value={r}
                  label={`${r}★ & above`}
                  className="mb-2"
                  checked={filters.rating === r}
                  onChange={handleFilterChange}
                />
              ))}
            </Form.Group>

            {/* SORT */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Sort by Price</Form.Label>
              <Form.Check
                type="radio"
                name="sort"
                value="price_low_high"
                label="Low to High"
                className="mb-2"
                checked={filters.sort === "price_low_high"}
                onChange={handleFilterChange}
              />
              <Form.Check
                type="radio"
                name="sort"
                value="price_high_low"
                label="High to Low"
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
          </Form>
        </Col>

        {/* PRODUCT LIST */}
        <Col lg={10} md={9} sm={12} className="ps-lg-4 pt-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h6 className="mb-0">
              Showing Products ({filteredProducts.length})
            </h6>
            {loading && (
              <span className="text-muted small">Updating...</span>
            )}
          </div>

          {loading && products.length === 0 ? (
            <Loader />
          ) : (
            <Row className="g-4">
              {filteredProducts.length === 0 ? (
                <Col className="text-center my-5">
                  <h5>No products found</h5>
                </Col>
              ) : (
                filteredProducts.map(product => (
                  <Col
                    key={product._id}
                    xl={3}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                  >
                    <ProductCard product={product} />
                  </Col>
                ))
              )}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductList;