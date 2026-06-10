import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Section3 = () => {
  return (
    <section className="contact-form py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Send Us a Message</h2>
            <p className="lead">We'll get back to you as soon as possible</p>
            <div className="divider mx-auto"></div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="formName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" required />
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formSubject" className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" placeholder="Enter subject" required />
              </Form.Group>
              <Form.Group controlId="formMessage" className="mb-4">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Enter your message" required />
              </Form.Group>
              <div className="text-center">
                <Button variant="danger" type="submit" className="btn-lg px-4">
                  Send Message
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section3;