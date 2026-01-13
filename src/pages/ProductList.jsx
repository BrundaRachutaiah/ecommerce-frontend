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
      FETCH CATEGORIES (Once)
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
        if (filters.categories.length > 0)
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
      temp = temp.filter(p => Number(p.rating) >= Number(filters.rating));
    }
    setFilteredProducts(temp);
  }, [products, filters.rating]);

  /* ===============================
      URL SYNC (STABLE)
  =============================== */
  const syncUrlParams = useCallback((updatedFilters) => {
    const params = new URLSearchParams();

    if (updatedFilters.categories.length > 0)
      params.set("category", updatedFilters.categories.join(","));
    if (updatedFilters.rating) params.set("rating", updatedFilters.rating);
    if (updatedFilters.sort) params.set("sort", updatedFilters.sort);
    if (updatedFilters.search) params.set("search", updatedFilters.search);

    // replace: true prevents pushing a new entry to browser history
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
    <Container fluid className="mt-4">
      <Row>
        <Col lg={2} md={3} sm={12} className="border-end mb-4 mb-md-0">
          <h6>Filters</h6>
          {/* Prevent form default submit which triggers reload */}
          <Form onSubmit={(e) => e.preventDefault()}>
            {/* CATEGORY */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              {categories.map(cat => (
                <div key={cat._id} className="mb-2">
                  <Form.Check
                    type="checkbox"
                    id={`cat-${cat._id}`}
                    label={cat.name}
                    checked={filters.categories.includes(cat._id)}
                    onChange={() => handleCategoryChange(cat._id)}
                  />
                </div>
              ))}
            </Form.Group>

            {/* RATING */}
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              {["4", "3", "2"].map(r => (
                <Form.Check
                  key={r}
                  type="radio"
                  name="rating"
                  label={`${r}★ & above`}
                  value={r}
                  id={`rating-${r}`}
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
                id="sort-low"
                label="Low to High"
                value="price_low_high"
                checked={filters.sort === "price_low_high"}
                onChange={handleFilterChange}
              />
              <Form.Check
                type="radio"
                name="sort"
                id="sort-high"
                label="High to Low"
                value="price_high_low"
                checked={filters.sort === "price_high_low"}
                onChange={handleFilterChange}
              />
            </Form.Group>

            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="w-100"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Form>
        </Col>

        <Col lg={10} md={9} sm={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6>Showing Products ({filteredProducts.length})</h6>
            {/* Minimal loader indicator inside the view so the UI stays stable */}
            {loading && products.length > 0 && <span className="text-muted small">Updating...</span>}
          </div>

          {loading && products.length === 0 ? (
            <Loader />
          ) : (
            <Row>
              {filteredProducts.length === 0 ? (
                <Col className="text-center my-5">
                  <h5>No products found</h5>
                </Col>
              ) : (
                filteredProducts.map(product => (
                  <Col key={product._id} xl={3} lg={4} md={6} sm={6} xs={12} className="mb-4">
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