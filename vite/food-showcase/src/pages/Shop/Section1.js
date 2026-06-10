import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Section1 = () => {
  return (
    <section className="shop-hero">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="display-4 fw-bold mb-4">Our Shop</h1>
            <p className="lead mb-4">
              Take a piece of our restaurant home with you - merchandise,
              sauces, and more!
            </p>
            <div className="shop-cta">
              <Link to="#featured" className="btn btn-danger btn-lg px-4 me-2">
                Featured Items
              </Link>
              <Link to="#offers" className="btn btn-outline-light btn-lg px-4">
                Special Offers
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section1;
