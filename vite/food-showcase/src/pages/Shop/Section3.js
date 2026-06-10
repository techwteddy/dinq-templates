import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const offers = [
  {
    id: 1,
    title: "Combo Pack",
    description: "Secret Sauce + Cookbook + T-Shirt",
    originalPrice: 52.97,
    offerPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Sauce Lovers",
    description: "3 bottles of our Secret Sauce",
    originalPrice: 23.97,
    offerPrice: 19.99,
    image:
      "https://images.unsplash.com/photo-1576186726115-4d51596775d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Gift Bundle",
    description: "Perfect gift set with cookbook and t-shirt",
    originalPrice: 44.98,
    offerPrice: 34.99,
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const Section3 = () => {
  return (
    <section id="offers" className="shop-offers py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Special Offers</h2>
            <p className="lead">Limited time deals and bundles</p>
            <div className="divider mx-auto"></div>
          </Col>
        </Row>
        <Row>
          {offers.map((offer) => (
            <Col lg={4} md={6} key={offer.id} className="mb-4">
              <div className="offer-card">
                <div className="offer-img">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="img-fluid"
                  />
                </div>
                <div className="offer-body">
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-desc">{offer.description}</p>
                  <div className="offer-pricing">
                    <span className="original-price">
                      ${offer.originalPrice.toFixed(2)}
                    </span>
                    <span className="current-price">
                      ${offer.offerPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="discount-badge">
                      Save{" "}
                      {Math.round(
                        (1 - offer.offerPrice / offer.originalPrice) * 100
                      )}
                      %
                    </span>
                    <button className="btn btn-sm btn-danger">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Section3;
