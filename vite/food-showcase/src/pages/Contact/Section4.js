import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Section4 = () => {
  return (
    <section className="contact-map py-5 bg-light">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Find Us</h2>
            <p className="lead">Visit our restaurant location</p>
            <div className="divider mx-auto"></div>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="map-container">
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.210321184052!2d-80.19130798497912!3d25.76161578363538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b6823bcf83f7%3A0xef0b288e10bb269c!2s5505%20Waterford%20District%20Dr%2C%20Miami%2C%20FL%2033126%2C%20USA!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section4;
