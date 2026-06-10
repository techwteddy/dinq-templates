import React from "react";
import { Container, Row, Col, Form } from "react-bootstrap";

const Section3 = () => {
  return (
    <section className="blog-newsletter py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h2 className="mb-4">Subscribe to Our Newsletter</h2>
            <p className="lead mb-5">
              Get the latest blog posts, recipes, and special offers delivered
              to your inbox
            </p>
            <Form className="newsletter-form">
              <div className="d-flex">
                <Form.Control
                  type="email"
                  placeholder="Your email address"
                  className="form-control-lg"
                  required
                />
                <button type="submit" className="btn btn-danger btn-lg ms-2">
                  Subscribe
                </button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section3;
