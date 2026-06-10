import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "The Art of Crafting the Perfect Burger",
    excerpt:
      "Learn the secrets behind creating a burger that's juicy, flavorful, and perfectly balanced.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "June 15, 2023",
    author: "Chef John Smith",
    category: "Recipes",
  },
  {
    id: 2,
    title: "Our Journey: From Food Truck to Restaurant",
    excerpt:
      "The story of how our small food truck grew into the beloved restaurant it is today.",
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "May 28, 2023",
    author: "Mike Davis",
    category: "Story",
  },
  {
    id: 3,
    title: "Top 5 Burger Toppings You Need to Try",
    excerpt:
      "Elevate your burger game with these delicious and unique topping combinations.",
    image:
      "https://www.tastingtable.com/img/gallery/20-popular-burger-toppings-ranked-worst-to-best/intro-1712691505.webp",
    date: "April 10, 2023",
    author: "Sarah Johnson",
    category: "Tips",
  },
  {
    id: 4,
    title: "Sustainable Sourcing: Our Commitment",
    excerpt:
      "How we partner with local farmers and producers to bring you the best ingredients.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    date: "March 22, 2023",
    author: "Mike Davis",
    category: "Sustainability",
  },
];

const Section2 = () => {
  return (
    <section className="blog-articles py-5">
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <h2 className="section-title">Latest Articles</h2>
            <p className="lead">Discover our stories and culinary insights</p>
            <div className="divider mx-auto"></div>
          </Col>
        </Row>
        <Row>
          {articles.map((article) => (
            <Col lg={6} key={article.id} className="mb-4">
              <div className="article-card">
                <div className="article-image">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="img-fluid"
                  />
                  <span className="article-category">{article.category}</span>
                </div>
                <div className="article-body">
                  <div className="article-meta mb-2">
                    <span className="article-date">{article.date}</span>
                    <span className="article-author">By {article.author}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-excerpt">{article.excerpt}</p>
                  <Link
                    to={`/blog/${article.id}`}
                    className="btn btn-outline-danger"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <Link to="/blog/archive" className="btn btn-danger">
              View All Articles
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Section2;
