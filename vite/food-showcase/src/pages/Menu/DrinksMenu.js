import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import "./DrinksMenu.css"; // External CSS file

const categories = {
  "Soft Drinks (Sodas)": [
    { name: "Coca-Cola (Coke)", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Coca-Cola_logo.svg", desc: "Classic Coke with perfect fizz", price: "$2.99" },
    { name: "Diet Coke / Coke Zero", image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Coca-Cola_logo.svg", desc: "Zero sugar, same great taste", price: "$2.99" },
    { name: "Pepsi", image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Pepsi_logo.svg", desc: "The bold alternative choice", price: "$2.89" },
    { name: "Diet Pepsi", image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Pepsi_logo.svg", desc: "Zero calories, all flavor", price: "$2.89" },
    { name: "Sprite", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/Sprite_logo.svg", desc: "Crisp lemon-lime refreshment", price: "$2.79" },
    { name: "Fanta (Orange)", image: "https://upload.wikimedia.org/wikipedia/commons/1/12/Fanta_logo.svg", desc: "Fruity and fun", price: "$2.79" },
    { name: "Dr. Pepper", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dr_Pepper_logo.svg", desc: "23 flavors in one drink", price: "$2.99" },
    { name: "Mountain Dew", image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Mountain_Dew_logo.svg", desc: "Citrus blast energy", price: "$2.99" },
    { name: "7 Up", image: "https://upload.wikimedia.org/wikipedia/commons/5/5f/7_Up_logo.svg", desc: "Light and refreshing lemon-lime", price: "$2.69" },
    { name: "A&W Root Beer", image: "https://upload.wikimedia.org/wikipedia/commons/5/5d/A%26W_Logo.svg", desc: "Creamy vanilla root beer", price: "$2.89" },
    { name: "Barq's Root Beer", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Barq%27s_logo.svg", desc: "Bold and sarsaparilla flavor", price: "$2.89" },
    { name: "Schweppes Ginger Ale", image: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Schweppes_logo.svg", desc: "Classic crisp ginger flavor", price: "$2.79" }
],
 "Iced Tea & Lemonade": [
  { name: "Sweet Tea", image: "https://images.unsplash.com/photo-1508252370761-67df9501a69f", desc: "Brewed fresh daily", price: "$2.49" },
  { name: "Unsweetened Tea", image: "https://images.unsplash.com/photo-1520218508822-998633d997e6", desc: "Pure tea, no sugar", price: "$2.49" },
  { name: "Arnold Palmer", image: "https://images.unsplash.com/photo-1627398242677-4c4e7a7c8d6b", desc: "Half iced tea, half lemonade", price: "$2.99" },
  { name: "Peach Iced Tea", image: "https://images.unsplash.com/photo-1605296867424-0b3b7fd1de5c", desc: "Delightful peach-infused tea", price: "$2.99" },
  { name: "Raspberry Iced Tea", image: "https://images.unsplash.com/photo-1560155016-3e2073c90205", desc: "Sweet and tangy raspberry tea", price: "$2.99" },
  { name: "Green Tea Lemonade", image: "https://images.unsplash.com/photo-1601314002959-7c7499f492a6", desc: "A refreshing twist on green tea", price: "$3.49" },
  { name: "Honey Lemon Tea", image: "https://images.unsplash.com/photo-1514993461221-1e360e87eb42", desc: "Soothing tea with honey and lemon", price: "$3.49" },
  { name: "Mint Lemonade", image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a", desc: "Cool and refreshing with fresh mint", price: "$3.49" },
  { name: "Passionfruit Iced Tea", image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb8d", desc: "Exotic passionfruit meets classic tea", price: "$3.99" },
  { name: "Lavender Lemonade", image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a", desc: "Floral and refreshingly unique", price: "$3.99" },
  { name: "Pineapple Iced Tea", image: "https://images.unsplash.com/photo-1615486364408-9ae71596e95f", desc: "Tropical pineapple-infused tea", price: "$3.49" },
  { name: "Blackberry Sage Tea", image: "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256", desc: "Fruity and herbal", price: "$3.99" }
],
"Milkshakes & Frozen Drinks": [
  { name: "Vanilla Shake", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg", desc: "Classic and creamy", price: "$3.99" },
  { name: "Chocolate Shake", image: "https://images.pexels.com/photos/1637637/pexels-photo-1637637.jpeg", desc: "Rich and delicious", price: "$3.99" },
  { name: "Strawberry Shake", image: "https://images.pexels.com/photos/3311074/pexels-photo-3311074.jpeg", desc: "Berry goodness", price: "$3.99" },
  { name: "Oreo/Cookies & Cream Shake", image: "https://images.pexels.com/photos/3026809/pexels-photo-3026809.jpeg", desc: "Crunchy and creamy", price: "$4.49" },
  { name: "Caramel Shake", image: "https://images.pexels.com/photos/14770858/pexels-photo-14770858.jpeg", desc: "Sweet caramel delight", price: "$4.49" },
  { name: "Malted Milkshake", image: "https://images.pexels.com/photos/12822784/pexels-photo-12822784.jpeg", desc: "Old-school favorite", price: "$4.49" },
  { name: "Frozen Coke/Slushie", image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg", desc: "Ice-cold refreshment", price: "$3.49" },
  { name: "Peanut Butter Shake", image: "https://images.pexels.com/photos/4110001/pexels-photo-4110001.jpeg", desc: "Nutty and smooth", price: "$4.49" },
  { name: "Banana Shake", image: "https://images.pexels.com/photos/1419939/pexels-photo-1419939.jpeg", desc: "Creamy banana blend", price: "$4.49" },
  { name: "Mint Chocolate Shake", image: "https://images.pexels.com/photos/1233123/pexels-photo-1233123.jpeg", desc: "Refreshing mint & chocolate", price: "$4.49" },
  { name: "Blueberry Shake", image: "https://images.pexels.com/photos/1256879/pexels-photo-1256879.jpeg", desc: "Burst of berry flavors", price: "$4.49" },
  { name: "Mango Lassi", image: "https://images.pexels.com/photos/1640768/pexels-photo-1640768.jpeg", desc: "Refreshing Indian mango yogurt drink", price: "$4.99" }
]



};

const CategoryButton = ({ category, isActive, onClick }) => (
  <Col md={3} sm={6} xs={6} className="mb-3">
    <button className={`category-btn ${isActive ? "active" : ""}`} onClick={onClick}>
      {category}
    </button>
  </Col>
);

const DrinkCard = ({ drink }) => (
  <Col xl={3} lg={4} md={6}>
    <Fade direction="up" duration={800}>
      <div className="drink-card">
        <img src={drink.image} alt={drink.name} className="drink-img" />
        <h5 className="drink-name">{drink.name}</h5>
        <p className="drink-desc">{drink.desc}</p>
        <p className="drink-price">{drink.price}</p>
      </div>
    </Fade>
  </Col>
);

const DrinksMenu = () => {
  const [selectedCategory, setSelectedCategory] = useState("Soft Drinks (Sodas)"); // FIXED

  return (
    <section id="drinks" className="drinks-section">
      <Container>
        <Row className="mb-5 text-center">
          <Col>
            <h2 className="section-title">Thirst Quenchers</h2>
            <p className="lead">Dive into our spectacular selection of beverages that perfectly complement our burgers</p>
          </Col>
        </Row>

        <Row className="mb-5 justify-content-center">
          {Object.keys(categories).map((category) => (
            <CategoryButton key={category} category={category} isActive={selectedCategory === category} onClick={() => setSelectedCategory(category)} />
          ))}
        </Row>

        <Row className="g-4 justify-content-center">
          {categories[selectedCategory].map((drink, index) => (
            <DrinkCard key={index} drink={drink} />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default DrinksMenu;
