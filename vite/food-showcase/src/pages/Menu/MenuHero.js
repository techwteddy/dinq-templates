import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";

const MenuHero = () => {
  return (
    <section className="menu-hero position-relative">
      <div className="hero-overlay"></div>
      <Container className="position-relative">
        <Row className="justify-content-center text-center">
          <Col lg={8}>
            <Fade direction="down" duration={800} triggerOnce>
              <h1 className="display-3 fw-bold mb-4 text-white">
                <span className="text-danger">TASTY BURGER</span> MENU
              </h1>
              <p className="lead mb-5 text-white">
                Crafted with 100% premium beef and fresh ingredients. Every bite
                is a flavor explosion!
              </p>
            </Fade>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default MenuHero;
