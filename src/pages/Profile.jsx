import { Container, Row, Col } from "react-bootstrap";
import UserInfo from "../components/profile/UserInfo";
import AddressList from "../components/profile/AddressList";
import OrderHistory from "../components/profile/OrderHistory";

const Profile = () => {
  return (
    <Container className="mt-4">
      <h4 className="mb-4">My Profile</h4>

      <Row>
        <Col md={4}>
          <UserInfo />
        </Col>

        <Col md={8}>
          <AddressList />
          <OrderHistory />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
