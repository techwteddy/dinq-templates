import React, { useState } from "react";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import { FaUtensils, FaGlassCheers, FaUserTie, FaIceCream } from "react-icons/fa";
import "../../styles/TeamStyle.css"; // Create this CSS file for custom styles

const teamMembers = [
  {
    id: 1,
    name: "John Smith",
    position: "Head Chef",
    bio: "With over 15 years of culinary experience, John brings creativity and expertise to every dish.",
    fullBio: "John trained at the Culinary Institute of America and has worked in Michelin-starred restaurants across Europe before bringing his expertise to our kitchen. His signature burger blend is a closely guarded secret that keeps customers coming back for more.",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specialties: ["Burger Crafting", "Sauce Development", "Quality Control"],
    icon: <FaUtensils className="team-icon" />
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Pastry Chef",
    bio: "Sarah's desserts are the perfect sweet ending to our delicious burgers.",
    fullBio: "Sarah's passion for baking began in her grandmother's kitchen. After graduating from the International Culinary Center, she developed our famous milkshakes and dessert menu that keeps customers coming back. Her seasonal specials are always a hit!",
    img: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specialties: ["Dessert Creation", "Milkshake Recipes", "Pastry Arts"],
    icon: <FaIceCream className="team-icon" />
  },
  {
    id: 3,
    name: "Mike Davis",
    position: "Restaurant Manager",
    bio: "Mike ensures every guest has an exceptional dining experience.",
    fullBio: "With a degree in Hospitality Management and 10 years in the industry, Mike oversees our operations and staff training. His customer service philosophy has shaped our restaurant's welcoming atmosphere. He's the reason our team works like a well-oiled machine.",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specialties: ["Customer Service", "Operations", "Staff Training"],
    icon: <FaUserTie className="team-icon" />
  },
  {
    id: 4,
    name: "Emma Rodriguez",
    position: "Mixologist",
    bio: "Emma crafts our signature drinks that perfectly complement our burgers.",
    fullBio: "Emma brings creativity to our beverage program with her innovative cocktail creations and craft soda infusions. Her seasonal specials are always customer favorites. She's won several local mixology competitions and brings that expertise to our drink menu.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    specialties: ["Cocktail Creation", "Beverage Pairing", "Mixology"],
    icon: <FaGlassCheers className="team-icon" />
  }
];

const Section3 = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  return (
    <section className="our-team py-5 position-relative">
      {/* Decorative elements */}
      <div className="position-absolute top-0 end-0 burger-bg-icon">
        <FaUtensils className="text-muted opacity-10" size={200} />
      </div>
      
      <Container className="position-relative">
        <Fade direction="up" duration={800} triggerOnce>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title mb-3">
                <span className="text-primary">Meet Our</span>{" "}
                <span className="text-danger">Dream Team</span>
              </h2>
              <p className="lead fw-bold">
                The culinary artists and hospitality experts behind your favorite burgers
              </p>
              <div className="divider mx-auto bg-gradient"></div>
            </Col>
          </Row>
        </Fade>

        <Row className="g-4">
          {teamMembers.map((member) => (
            <Col lg={3} md={6} key={member.id}>
              <Fade direction="up" duration={800} delay={member.id * 100} triggerOnce>
                <div 
                  className="team-card text-center p-4 h-100 position-relative"
                  onClick={() => handleMemberClick(member)}
                >
                  <div className="team-img-wrapper mb-4">
                    <div className="team-img-hover-effect"></div>
                    <img
                      src={member.img}
                      alt={member.name}
                      className="img-fluid rounded-circle shadow"
                    />
                    <div className="team-icon-container">
                      {member.icon}
                    </div>
                  </div>
                  <h4 className="mb-2 fw-bold">{member.name}</h4>
                  <h6 className="text-danger mb-3">{member.position}</h6>
                  <p className="team-bio">{member.bio}</p>
                  <button className="btn btn-sm btn-outline-danger mt-2 learn-more-btn">
                    Learn More <span className="btn-arrow">→</span>
                  </button>
                  <div className="team-card-overlay"></div>
                </div>
              </Fade>
            </Col>
          ))}
        </Row>

        {/* Team Member Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          size="lg"
          className="team-modal"
        >
          {selectedMember && (
            <>
              <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="w-100 text-center">
                  <h3 className="mb-0">{selectedMember.name}</h3>
                  <p className="text-danger mb-0">{selectedMember.position}</p>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="pt-0">
                <Row className="align-items-center">
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <div className="modal-img-container mx-auto">
                      <img
                        src={selectedMember.img}
                        alt={selectedMember.name}
                        className="img-fluid rounded-circle shadow-lg"
                      />
                      <div className="modal-icon-bg">
                        {selectedMember.icon}
                      </div>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="modal-bio">
                      <p>{selectedMember.fullBio}</p>
                      <div className="specialties mt-4">
                        <h5 className="text-primary">Specialties:</h5>
                        <div className="d-flex flex-wrap gap-2 mt-3">
                          {selectedMember.specialties.map((specialty, index) => (
                            <span key={index} className="badge bg-light text-dark py-2 px-3">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer className="border-0 justify-content-center">
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default Section3;