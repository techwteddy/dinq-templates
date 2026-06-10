import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";

const sides = [
  {
    id: 1,
    name: "Tasty Fries",
    description: "Golden crispy fries with sea salt and our special seasoning",
    price: 3.99,
    image: "https://www.recipetineats.com/tachyon/2022/09/Fries-with-rosemary-salt_1.jpg?resize=900%2C1125&zoom=0.72",
    featured: true
  },
  {
    id: 2,
    name: "Onion Rings",
    description: "Crispy beer-battered rings with ranch dipping sauce",
    price: 4.99,
    image: "https://www.allrecipes.com/thmb/enmDcltygGF5cR9yMu3DAsfOwD0=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-82659-old-fashioned-onion-rings-DDMFS-beauty-3x4-0392e762554545be97798821fccb7e67.jpg"
  },
  {
    id: 3,
    name: "Cheesy Nachos",
    description: "Tortilla chips loaded with melted cheese, jalapeños, and salsa",
    price: 5.99,
    image: "https://www.spendwithpennies.com/wp-content/uploads/2022/02/Easy-Homemade-Nachos-SpendWithPennies-7-1024x1536.jpg",
    featured: true
  },
  {
    id: 4,
    name: "Mozzarella Sticks",
    description: "Breaded mozzarella sticks with marinara sauce",
    price: 5.99,
    image: "https://www.allrecipes.com/thmb/ZiFhHliWVbS_T9hhw-Fc3GLJVNU=/0x512/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/23596-fried-mozzarella-cheese-sticks-DDMFS-4x3-842a0eaebf6b435a8d3a8b04325e13eb.jpg"
  },
  {
    id: 5,
    name: "Sweet Potato Fries",
    description: "Cinnamon-dusted fries with maple dipping sauce",
    price: 4.99,
    image: "https://cookieandkate.com/images/2010/12/crispy-baked-sweet-potato-fries-with-ketchup-1.jpg"
  },
  {
    id: 6,
    name: "Garlic Bread",
    description: "Toasted bread with garlic butter and parsley",
    price: 3.99,
    image: "https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4-750x750.jpg"
  }
];

const SidesMenu = () => {
  return (
    <section id="sides" className="menu-section py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <Fade direction="up" duration={800} triggerOnce>
              <h2 className="section-title mb-3">TASTY SIDES</h2>
              <p className="section-subtitle text-muted">Perfect companions to your burger</p>
              <div className="divider mx-auto my-4"></div>
            </Fade>
          </Col>
        </Row>
        <Row className="g-4">
          {sides.map((side, index) => (
            <Col lg={4} md={6} key={side.id}>
              <Fade direction="up" duration={800} delay={index * 100} triggerOnce>
                <div className={`menu-item card h-100 border-0 shadow-sm ${side.featured ? "featured" : ""}`}>
                  <div className="menu-item-img card-img-top overflow-hidden">
                    <img
                      src={side.image}
                      alt={side.name}
                      className="img-fluid w-100"
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    {side.featured && (
                      <div className="featured-badge bg-danger">POPULAR</div>
                    )}
                  </div>
                  <div className="menu-item-content card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="card-title mb-0">{side.name}</h4>
                      <span className="price text-danger fw-bold">${side.price.toFixed(2)}</span>
                    </div>
                    <p className="card-text text-muted mb-3">{side.description}</p>
                    <button className="btn btn-outline-danger w-100">
                      Add to Order
                    </button>
                  </div>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>
      </Container>

      <style>{`
        .menu-section {
          background-color: #f8f9fa;
        }
        .section-title {
          font-weight: 700;
          color: #212529;
          letter-spacing: 1px;
        }
        .section-subtitle {
          font-size: 1.1rem;
        }
        .divider {
          width: 80px;
          height: 3px;
          background-color: #dc3545;
        }
        .menu-item {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 10px;
          overflow: hidden;
        }
        .menu-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .menu-item-img {
          position: relative;
        }
        .featured-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 5px 10px;
          border-radius: 20px;
          color: white;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .btn-outline-danger {
          border-width: 2px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: white;
        }
      `}</style>
    </section>
  );
};

export default SidesMenu;
