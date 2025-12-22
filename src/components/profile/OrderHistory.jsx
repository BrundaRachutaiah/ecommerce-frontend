import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import API from "../../api/apiService";
import Loader from "../common/Loader";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders")
      .then((res) => setOrders(res.data.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <Card>
      <Card.Body>
        <h6>Order History</h6>
        <hr />

        {orders.length === 0 ? (
          <p>No orders placed yet</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="mb-3 small">
              <strong>Order ID:</strong> {order._id}
              <br />
              <strong>Total:</strong> ₹{order.totalPrice}
              <br />
              <strong>Status:</strong>{" "}
              {order.isDelivered ? "Delivered" : "Processing"}
              <hr />
            </div>
          ))
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderHistory;
