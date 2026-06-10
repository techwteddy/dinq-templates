import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Section1 = () => {
  return (
    <section className="contact-hero">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <h1 className="display-4 fw-bold mb-4">Contact Us</h1>
            <p className="lead">
              We'd love to hear from you! Reach out with questions, feedback, or just to say hello.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section1;