import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { FaUtensils, FaCalendarAlt } from "react-icons/fa";
import "../../styles/AboutStyle.css";

const Section1 = () => {
  return (
    <section className="about-hero">
      {/* Animated background elements */}
      <div className="hero-bg-elements">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>
      
      <Container>
        <Row className="align-items-center g-5">
          <Col lg={6} className="order-lg-1 order-2">
            <Fade direction="up" duration={800} cascade triggerOnce>
              <div className="hero-content">
                <h1 className="hero-title mb-4">
                  Crafting <span className="text-highlight">Delicious Memories</span> Since 2010
                </h1>
                <p className="hero-text mb-5">
                  From our humble beginnings as a single food truck to becoming Miami's favorite burger destination, 
                  we've stayed true to our roots - serving handcrafted burgers made with love and premium ingredients.
                </p>
                
                <div className="hero-stats d-flex gap-5 mb-5">
                  <div className="stat-item">
                    <div className="stat-number">13+</div>
                    <div className="stat-label">Years Serving</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">50K+</div>
                    <div className="stat-label">Happy Customers</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Fresh Ingredients</div>
                  </div>
                </div>

                <div className="hero-cta d-flex flex-wrap gap-3">
                  <Link to="/menu" className="btn btn-primary btn-lg px-4 py-3">
                    <FaUtensils className="me-2" />
                    Explore Our Menu
                  </Link>
                  <Link to="/reservation" className="btn btn-outline-light btn-lg px-4 py-3">
                    <FaCalendarAlt className="me-2" />
                    Reserve a Table
                  </Link>
                </div>
              </div>
            </Fade>
          </Col>
          
          <Col lg={6} className="order-lg-2 order-1">
            <Fade direction="left" duration={800} triggerOnce>
              <div className="hero-image-wrapper">
                <div className="main-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                    alt="Our restaurant" 
                    className="img-fluid main-image"
                  />
                  <div className="image-badge">
                    <span>Since 2010</span>
                  </div>
                </div>
                <div className="floating-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                    alt="Our food truck" 
                    className="img-fluid floating-image"
                  />
                  <div className="floating-badge">
                    <span>Our Humble Start</span>
                  </div>
                </div>
              </div>
            </Fade>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section1;