import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Section2 = () => {
  return (
    <section className="contact-info py-5 bg-light">
      <Container>
        <Row className="g-4">
          <Col md={3}>
            <div className="info-card d-flex flex-column justify-content-between text-center p-4 h-100 shadow-sm">
              <div className="info-icon mb-3 text-danger fs-1">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <h3>Location</h3>
              <p>5505 Waterford District Dr</p>
              <p>Miami, FL 33126</p>
              <p className="text-muted">Located near Downtown Burger Street</p>
              <Link to="/directions" className="btn btn-outline-danger mt-3">
                Get Directions
              </Link>
            </div>
          </Col>

          <Col md={3}>
            <div className="info-card d-flex flex-column justify-content-between text-center p-4 h-100 shadow-sm">
              <div className="info-icon mb-3 text-danger fs-1">
                <i className="bi bi-telephone-fill"></i>
              </div>
              <h3>Phone</h3>
              <p>Main: (91) 555-1234</p>
              <p>Orders: (91) 555-5678</p>
              <p className="text-muted">Available 9am – 11pm Daily</p>
              <Link to="tel:3055551234" className="btn btn-outline-danger mt-3">
                Call Us
              </Link>
            </div>
          </Col>

          <Col md={3}>
            <div className="info-card d-flex flex-column justify-content-between text-center p-4 h-100 shadow-sm">
              <div className="info-icon mb-3 text-danger fs-1">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h3>Email</h3>
              <p>info@burgerwala.com</p>
              <p>orders@burgerwala.com</p>
              <p className="text-muted">Responses within 24 hours</p>
              <Link
                to="mailto:info@burgerwala.com"
                className="btn btn-outline-danger mt-3"
              >
                Email Us
              </Link>
            </div>
          </Col>

          <Col md={3}>
            <div className="info-card d-flex flex-column justify-content-between text-center p-4 h-100 shadow-sm">
              <div>
                <div className="info-icon mb-3 text-danger fs-1">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>
                <h3>Location</h3>
                <p>5505 Waterford District Dr</p>
                <p>Miami, FL 33126</p>
                <p className="text-muted">
                  Located near Downtown Burger Street
                </p>
              </div>
              <Link to="/directions" className="btn btn-outline-danger mt-3">
                Get Directions
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section2;
