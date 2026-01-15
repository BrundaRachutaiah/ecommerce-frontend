import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import API from "../../api/apiService";
import Loader from "../common/Loader";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => {
        const fetchedOrders = res.data?.data?.orders || [];
        const sortedOrders = [...fetchedOrders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Loader />;

  return (
    // ✅ BEST FIX: push footer down cleanly
    <Card className="mb-5">
      <Card.Body className="pb-4">
        <h6>Order History</h6>
        <hr />

        {orders.length === 0 ? (
          <p className="mb-4">No orders placed yet</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="mb-4 small">
              <strong>Order ID:</strong> {order._id}
              <br />
              <strong>Order Date:</strong> {formatDate(order.createdAt)}
              <br />
              <strong>Total:</strong> ₹{order.totalPrice}
              <br />
              <strong>Status:</strong>{" "}
              {order.isDelivered ? "Delivered" : "Processing"}

              {Array.isArray(order.orderItems) &&
                order.orderItems.length > 0 && (
                  <div className="mt-2">
                    <strong>Items Ordered:</strong>
                    <ul className="ps-3 mb-0">
                      {order.orderItems.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <hr />
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderHistory;