import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Section1 = () => {
  return (
    <section className="blog-hero">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="display-4 fw-bold mb-4">The Burger Blog</h1>
            <p className="lead">
              Stories, recipes, and behind-the-scenes looks at our restaurant
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section1;