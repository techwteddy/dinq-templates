import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import { FaAward, FaStore, FaTruck, FaUsers, FaHeart, FaUtensils, FaHamburger } from "react-icons/fa";
import { GiCow, GiWheat, GiTomato } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import "../../styles/AboutStyle.css";

const milestones = [
  {
    year: "2010",
    title: "Humble Beginnings",
    content: "Launched our first food truck at Miami's Calle Ocho festival, serving classic burgers with a local twist.",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaTruck className="milestone-icon" />,
    badge: "First Truck"
  },
  {
    year: "2012",
    title: "Signature Burger",
    content: "Created our award-winning 'Miami Spice' burger featuring locally-sourced ingredients.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaAward className="milestone-icon" />,
    badge: "Award Won"
  },
  {
    year: "2014",
    title: "First Restaurant",
    content: "Opened our flagship location in Wynwood, becoming part of Miami's culinary renaissance.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaStore className="milestone-icon" />,
    badge: "Grand Opening"
  },
  {
    year: "2016",
    title: "Community Recognition",
    content: "Started our 'Burger for Education' program, donating meals to local schools.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaUsers className="milestone-icon" />,
    badge: "Giving Back"
  },
  {
    year: "2018",
    title: "Best Burger Award",
    content: "Voted 'Best Burger in Miami' by Miami New Times for three consecutive years.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaAward className="milestone-icon" />,
    badge: "Top Rated"
  },
  {
    year: "2022",
    title: "Regional Expansion",
    content: "Opened locations in Fort Lauderdale and West Palm Beach, bringing our flavors to more communities.",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    icon: <FaStore className="milestone-icon" />,
    badge: "New Locations"
  }
];

const Section2 = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <section className="our-story py-5 position-relative">
      {/* Decorative elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-none d-lg-block">
        <div className="position-absolute top-0 end-0 burger-icon-1">
          <FaHamburger className="text-warning opacity-10" size={150} />
        </div>
        <div className="position-absolute bottom-0 start-0 burger-icon-2">
          <FaHamburger className="text-danger opacity-10" size={200} />
        </div>
      </div>
      
      <Container className="position-relative">
        <Fade direction="up" duration={800} triggerOnce>
          <Row className="justify-content-center mb-5">
            <Col lg={10} className="text-center">
              <h2 className="section-title mb-3">
                <span className="text-primary">Our Flavorful</span>{" "}
                <span className="text-danger">Journey</span>
              </h2>
              <p className="lead mb-4 fw-bold">
                From a single food truck to South Florida's favorite burger destination
              </p>
              <div className="divider mx-auto bg-gradient"></div>
            </Col>
          </Row>
        </Fade>

        <Row className="align-items-center mb-5">
          <Col lg={6} className="mb-4 mb-lg-0">
            <Fade direction="left" duration={800} triggerOnce>
              <div className="pe-lg-5">
                <h3 className="mb-4 fw-bold text-danger">Crafting Burger Perfection</h3>
                <p className="story-text fs-5">
                  What began as a passion project between two culinary school friends has grown into one of Miami's most beloved burger institutions. Our commitment to quality ingredients and authentic flavors remains unchanged since day one.
                </p>
                <p className="story-text fs-5">
                  We still prepare our buns fresh daily using a 36-hour fermentation process, grind our beef in-house from local Florida ranches, and source vegetables from nearby farms. Every bite tells our story of dedication to craft and community.
                </p>
                
                <div className="ingredients-highlight mt-4">
                  <div className="d-flex align-items-center mb-3">
                    <GiCow className="text-danger me-3" size={30} />
                    <div>
                      <h5 className="mb-0">Premium Beef</h5>
                      <small className="text-muted">100% Florida-raised Angus</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <GiWheat className="text-warning me-3" size={30} />
                    <div>
                      <h5 className="mb-0">Artisan Buns</h5>
                      <small className="text-muted">36-hour fermented dough</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <GiTomato className="text-success me-3" size={30} />
                    <div>
                      <h5 className="mb-0">Farm Fresh Toppings</h5>
                      <small className="text-muted">Locally sourced produce</small>
                    </div>
                  </div>
                </div>
              </div>
            </Fade>
          </Col>
          <Col lg={6}>
            <Fade direction="right" duration={800} triggerOnce>
              <div className="story-image-gallery position-relative">
                <div className="main-image-container hover-effect">
                  <img
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Our signature burger"
                    className="img-fluid rounded-4 shadow-lg"
                  />
                  <div className="image-caption bg-primary text-white p-3 rounded-bottom">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Our award-winning Miami Spice Burger</span>
                      <FaHeart className="text-danger" />
                    </div>
                  </div>
                  <div style={{marginLeft:"210px"}}  className="floating-badge bg-danger text-white">
                    Customer Favorite
                  </div>
                </div>
              </div>
            </Fade>
          </Col>
        </Row>

        <Fade direction="up" duration={800} triggerOnce>
          <Row className="mb-5">
            <Col lg={12}>
              <h3 className="text-center mb-5 fw-bold">
                <span className="text-primary">Our Delicious</span>{" "}
                <span className="text-danger">Milestones</span>
              </h3>
              <div className="timeline-container">
                <div className="timeline-line bg-gradient-vertical"></div>
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.year} 
                    className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="timeline-icon">
                      {milestone.icon}
                      {hoveredItem === index && (
                        <div className="timeline-icon-pulse"></div>
                      )}
                    </div>
                    <div className={`timeline-content ${hoveredItem === index ? 'hovered' : ''}`}>
                      <div className="timeline-year-badge">
                        <span className="timeline-year">{milestone.year}</span>
                        <span className="timeline-badge bg-warning text-dark">{milestone.badge}</span>
                      </div>
                      <h4 className="text-danger">{milestone.title}</h4>
                      <p>{milestone.content}</p>
                      <div className="image-container">
                        <img 
                          src={milestone.image} 
                          alt={milestone.title} 
                          className="img-fluid rounded-4 shadow-sm"
                        />
                        <div className="image-overlay"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Fade>

        <Fade direction="up" duration={800} triggerOnce>
          <Row className="community-section bg-light rounded-4 p-4 shadow-sm">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="position-relative h-100">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Community burger event"
                  className="img-fluid rounded-4 h-100 object-fit-cover shadow"
                />
                <div className="floating-stats bg-primary text-white p-3 rounded-3 shadow">
                  <div className="d-flex align-items-center">
                    <FaUtensils className="me-2" />
                    <div>
                      <div className="fw-bold fs-4">50,000+</div>
                      <small>Meals Donated</small>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6} className="community-content">
              <h3 className="text-danger">Giving Back to Our Community</h3>
              <p className="fs-5">
                Since 2015, we've donated over 50,000 meals through our community programs. 
                Each month, we host burger-making classes for local youth and donate a portion 
                of proceeds to Miami-Dade food banks.
              </p>
              <ul className="community-list">
                <li className="d-flex align-items-center mb-2">
                  <IoIosArrowForward className="text-danger me-2" />
                  <span>Annual "Burger Day" fundraiser for local schools</span>
                </li>
                <li className="d-flex align-items-center mb-2">
                  <IoIosArrowForward className="text-danger me-2" />
                  <span>Scholarship program for culinary students</span>
                </li>
                <li className="d-flex align-items-center">
                  <IoIosArrowForward className="text-danger me-2" />
                  <span>Partnership with urban farming initiatives</span>
                </li>
              </ul>
              <button className="btn btn-danger btn-lg mt-3">
                Learn About Our Initiatives <IoIosArrowForward />
              </button>
            </Col>
          </Row>
        </Fade>
      </Container>
    </section>
  );
};

export default Section2;