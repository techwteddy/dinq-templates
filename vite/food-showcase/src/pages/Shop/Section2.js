import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const products = [
  {
    id: 1,
    name: "Burger Making Kit",
    description: "Everything you need to make our signature burgers at home",
    price: 29.99,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1606755456206-b25206bfde43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Secret Sauce Bottle",
    description: "Our famous secret sauce in a convenient bottle (16oz)",
    price: 7.99,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1576186726115-4d51596775d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Restaurant Cookbook",
    description: "Recipes from our kitchen to yours (Hardcover)",
    price: 19.99,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Branded T-Shirt",
    description: "Show your love for our burgers (Unisex, all sizes)",
    price: 24.99,
    rating: 4.0,
    image:
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(<i key={i} className="bi bi-star-fill"></i>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<i key={`half-${i}`} className="bi bi-star-half"></i>);
    } else {
      stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
    }
  }

  return stars;
};

const Section2 = () => {
  return (
    <section id="featured" className="shop-products py-5 bg-light">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Featured Products</h2>
            <p className="lead">Customer favorites and best sellers</p>
            <div className="divider mx-auto"></div>
          </Col>
        </Row>
        <Row>
          {products.map((product) => (
            <Col lg={3} md={6} key={product.id} className="mb-4">
              <div className="product-card">
                <div className="product-badge">BESTSELLER</div>
                <div className="product-img">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="img-fluid"
                  />
                </div>
                <div className="product-body">
                  <div className="product-rating mb-2">
                    {renderRatingStars(product.rating)}
                    <span className="ms-1">({product.rating})</span>
                  </div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="product-price">
                      ${product.price.toFixed(2)}
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

export default Section2;
