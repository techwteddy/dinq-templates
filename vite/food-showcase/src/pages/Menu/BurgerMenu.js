import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Fade } from "react-awesome-reveal";
import spicyinferno from "../../assets/menu/spicyinferno.jpg";

const burgerCategories = [
  {
    category: "Classic Burgers",
    items: [
      {
        id: "0001",
        name: "Classic Cheeseburger",
        description:
          "Beef patty, American cheese, lettuce, tomato, special sauce",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        rating: 4.5,
        featured: true,
      },
      {
        id: "0002",
        name: "Bacon Cheeseburger",
        description: "Angus beef, smoked bacon, cheddar, caramelized onions",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
        rating: 5,
        bestseller: true,
      },
      {
        id: "0003",
        name: "Mushroom Swiss",
        description:
          "Beef patty, sautéed mushrooms, Swiss cheese, garlic aioli",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1512152272829-e3139592d56f",
        rating: 4,
      },
      {
        id: "0004",
        name: "California Burger",
        description: "Avocado, sprouts, pepper jack, sun-dried tomato mayo",
        price: 11.49,
        image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9",
        rating: 4.5,
      },
      {
        id: "0005",
        name: "Cheese Blast Burger",
        description: "Melted cheddar, crispy lettuce, signature sauce",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.7,
        featured: true,
      },
      {
        id: "0006",
        name: "Western BBQ Burger",
        description: "Beef patty, onion rings, cheddar, bacon, smoky BBQ sauce",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947",
        rating: 4.6,
        bestseller: true,
      },
    ],
  },
  {
    category: "Chicken Burgers",
    items: [
      {
        id: "0007",
        name: "Crispy Chicken Burger",
        description:
          "Buttermilk fried chicken, coleslaw, pickles, chipotle mayo",
        price: 9.49,
        image:
          "https://images.pexels.com/photos/918581/pexels-photo-918581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        rating: 4.5,
      },
      {
        id: "0008",
        name: "BBQ Chicken",
        description:
          "Grilled chicken, BBQ sauce, cheddar cheese, crispy onions",
        price: 10.99,
        image:
          "https://img.freepik.com/free-photo/cheeseburger-with-side-fries-ketchup-1_140725-1726.jpg?t=st=1743777139~exp=1743780739~hmac=77469f05d4c537dacc00da52bad90b6baa9b9c27c016996cc4cbf18fd786cca3&w=740",
        rating: 4.6,
      },
      {
        id: "0009",
        name: "Spicy Crunch",
        description: "Crispy chicken, spicy mayo, jalapeños, lettuce",
        price: 9.99,
        image:
          "https://farahjeats.com/wp-content/uploads/2021/11/IMG_7263_jpg-1024x1024.jpg",
        rating: 4.4,
      },
      {
        id: "0010",
        name: "Smoky Chicken",
        description: "Smoked chicken, chipotle sauce, caramelized onions",
        price: 10.49,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.5,
      },
      {
        id: "0011",
        name: "Peri Peri",
        description: "Grilled chicken, peri-peri sauce, lettuce, tomato",
        price: 9.79,
        image:
          "https://www.recipetineats.com/tachyon/2015/11/Nandos-Peri-Peri-Chicken-Burger_9.jpg?resize=1200%2C1500&zoom=0.54",
        rating: 4.3,
      },
      {
        id: "0012",
        name: "Tangy Delight",
        description: "Fried chicken, tangy sauce, cheddar, fresh greens",
        price: 10.29,
        image:
          "https://thedeliverybrothers.com/wp-content/uploads/2024/08/paneer-burger.avif",
        rating: 4.7,
      },
    ],
  },
  {
    category: "Vegetarian Burgers",
    items: [
      {
        id: "0013",
        name: "Black Bean Burger",
        description:
          "Spiced black bean patty, avocado, pepper jack, chipotle mayo",
        price: 8.99,
        image:
          "https://cdn.loveandlemons.com/wp-content/uploads/2020/07/black-bean-burger-2.jpg",
        rating: 4,
      },
      {
        id: "0014",
        name: "Portobello Mushroom",
        description: "Grilled portobello, roasted peppers, goat cheese",
        price: 9.49,
        image:
          "https://cdn.loveandlemons.com/wp-content/uploads/2019/06/portabello-mushroom-burger.jpg",
        rating: 4.5,
      },
      {
        id: "0015",
        name: "Falafel Burger",
        description: "Chickpea patty, tahini sauce, cucumber, tomato",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6",
        rating: 4,
      },
      {
        id: "0016",
        name: "Paneer Tikka",
        description: "Grilled paneer, mint chutney, onions, lettuce",
        price: 9.79,
        image:
          "https://www.dishbyrish.co.uk/wp-content/uploads/2023/08/DSC00019.jpg",
        rating: 4.6,
      },
      {
        id: "0017",
        name: "Quinoa Burger",
        description: "Quinoa patty, guacamole, cheddar, arugula",
        price: 9.99,
        image:
          "https://cdn.loveandlemons.com/wp-content/uploads/2014/03/black-bean-quinoa-burger.jpg",
        rating: 4.4,
      },
      {
        id: "0018",
        name: "Cheesy Veggie",
        description: "Crispy vegetable patty, double cheese, jalapeños, mayo",
        price: 8.99,
        image:
          "https://www.kitchensanctuary.com/wp-content/uploads/2014/11/Hand-holding-a-cheesy-veggie-burger.webp",
        rating: 4.7,
      },
    ],
  },
  {
    category: "Gourmet Burgers",
    items: [
      {
        id: "0019",
        name: "Truffle Burger",
        description: "Wagyu beef, truffle aioli, wild mushrooms, aged Gruyère",
        price: 14.99,
        image:
          "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2015/5/5/0/FNM_060115-Truffle-Burger-Recipe_s4x3.jpg.rend.hgtvcom.826.620.suffix/1431449537294.webp",
        rating: 5,
        premium: true,
      },
      {
        id: "0020",
        name: "Caramelized Bliss",
        description: "Prime beef, Maytag blue cheese, bourbon-glazed onions",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7",
        rating: 4.5,
        featured: true,
      },
      {
        id: "0021",
        name: "BBQ Brisket Burger",
        description: "Smoked brisket, cheddar, crispy onions, house BBQ sauce",
        price: 13.99,
        image:
          "https://stpierrebakery-co-uk.s3.eu-west-1.amazonaws.com/app/uploads/2022/05/Beef-Brisket-Burger-1440x961.jpg",
        rating: 4.5,
      },
      {
        id: "0022",
        name: "Lamb Delight",
        description: "Ground lamb, feta cheese, tzatziki sauce, arugula",
        price: 13.49,
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360",
        rating: 4.7,
        premium: true,
      },
      {
        id: "0023",
        name: "Smoky Chipotle",
        description: "Angus beef, smoked gouda, chipotle mayo, jalapeños",
        price: 12.79,
        image:
          "https://www.tastingtable.com/img/gallery/smoky-chipotle-burgers-recipe/intro-1692982574.webp",
        rating: 4.6,
      },
      {
        id: "0024",
        name: "Ultimate Bacon",
        description: "Double patty, crispy bacon, cheddar, maple bourbon sauce",
        price: 14.49,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
        rating: 4.8,
        featured: true,
      },
    ],
  },

  {
    category: "International Burgers",
    items: [
      {
        id: "0025",
        name: "Tandoori Chicken Burger",
        description: "Spiced yogurt-marinated chicken, mint chutney, naan bun",
        price: 10.99,
        image:
          "https://cdn.bakedbree.com/uploads/2010/06/chicken-tandoori-13web.jpg",
        rating: 4.5,
        bestseller: true,
      },
      {
        id: "0026",
        name: "Mexican Burger",
        description:
          "Chorizo-beef blend, pepper jack, guacamole, pico de gallo",
        price: 11.49,
        image:
          "https://simply-delicious-food.com/wp-content/uploads/2018/05/mexican-cheese-burgers-3.jpg",
        rating: 4,
      },
      {
        id: "0027",
        name: "Hawaiian Burger",
        description: "Teriyaki-glazed patty, grilled pineapple, Swiss cheese",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828",
        rating: 4,
      },
      {
        id: "0028",
        name: "Greek Lamb Burger",
        description: "Lamb patty, feta, tzatziki, cucumber, red onion",
        price: 12.99,
        image:
          "https://www.themediterraneandish.com/wp-content/uploads/2024/06/Mediterranean-Dish_Grilled-Lamb-Burgers_LEAD_8.jpg",
        rating: 4.5,
      },
      {
        id: "0029",
        name: "Korean BBQ Burger",
        description: "Soy-ginger beef, kimchi slaw, gochujang mayo, sesame bun",
        price: 12.49,
        image:
          "https://thecozyapron.com/wp-content/uploads/2015/06/korean-bbq-burger_thecozyapron_06-26-15_1.jpg",
        rating: 4.6,
      },
      {
        id: "0030",
        name: "Italian Pesto Burger",
        description:
          "Beef patty, fresh mozzarella, basil pesto, sun-dried tomatoes",
        price: 11.79,
        image:
          "https://www.thatskinnychickcanbake.com/wp-content/uploads/2017/05/Italian-Pesto-Burger-1.jpg",
        rating: 4.4,
      },
    ],
  },
  {
    category: "Signature Burgers",
    items: [
      {
        id: "0031",
        name: "The Ultimate",
        description:
          "Double patty, triple cheese, bacon, fried egg, all the toppings",
        price: 15.99,
        image:
          "https://www.joyousapron.com/wp-content/uploads/2018/05/IMG_3093-2.jpg",
        rating: 5,
        premium: true,
      },
      {
        id: "0032",
        name: "Breakfast Burger",
        description:
          "Juicy beef patty, crispy fried egg, smoky bacon, golden hash brown, and sweet maple mayo.",
        price: 12.49,
        image: "https://images.unsplash.com/photo-1551782450-17144efb9c50",
        rating: 4.5,
      },
      {
        id: "0033",
        name: "Mac & Cheese Burger",
        description:
          "Beef patty topped with creamy mac & cheese and crispy bacon",
        price: 13.49,
        image:
          "https://groundbeefrecipes.com/wp-content/uploads/2024/09/mac-and-cheese-burgers-featured.jpg",
        rating: 4,
      },
      {
        id: "0034",
        name: "Smokehouse Burger",
        description:
          "Angus beef, smoked cheddar, crispy onions, house BBQ sauce",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        rating: 4.6,
      },
      {
        id: "0035",
        name: "Spicy Inferno",
        description:
          "Loaded with fiery jalapeños, melted pepper jack cheese, spicy aioli, tangy habanero relish, and a hint of smoky",
        price: 12.99,
        image: spicyinferno,
        rating: 4.4,
      },
      {
        id: "0036",
        name: "Truffle Royale",
        description:
          "Wild mushrooms, brie cheese, and black truffle aioli on a toasted brioche bun — rich and flavorful.",
        price: 14.99,
        image:
          "https://goatburgers.com/wp-content/uploads/2024/10/The-Truffle-Royale-Burger.webp",
        rating: 4.8,
        premium: true,
      },
    ],
  },
  {
    category: "Spicy Burgers",
    items: [
      {
        id: "0037",
        name: "Nashville Chicken Burger",
        description:
          "Crispy fried chicken with Nashville hot sauce, pickles, ranch",
        price: 11.99,
        image:
          "https://littlesunnykitchen.com/wp-content/uploads/2021/02/Nashville-Hot-Chicken-Sandwich-Recipe-1-1024x1536.jpg",
        rating: 4.5,
        spicy: true,
      },
      {
        id: "0038",
        name: "Jalapeño Popper Burger",
        description:
          "Beef patty, cream cheese, bacon, jalapeños, chipotle mayo",
        price: 12.49,
        image:
          "https://ninjacue.com/wp-content/uploads/2023/08/17-erin_hungsberg-0r4a6612-ninjacue-jalapeno-popper-burger-23-scaled.jpg",
        rating: 4,
        spicy: true,
      },
      {
        id: "0039",
        name: "Ghost Pepper Challenge",
        description: "Double patty with ghost pepper cheese and habanero sauce",
        price: 14.99,
        image:
          "https://cdn-ildggll.nitrocdn.com/sCKbknHaHrEtuwTSsHiAUCeqNJThkOVZ/assets/images/optimized/rev-7ad870f/makefoodlovely.com/wp-content/uploads/2025/01/Untitled-design-2025-01-19T203046.119.png",
        rating: 4,
        spicy: true,
        challenge: true,
      },
      {
        id: "0040",
        name: "Carolina Reaper Burger",
        description: "Extreme heat with Reaper sauce, smoked gouda",
        price: 15.49,
        image:
          "https://media.istockphoto.com/id/526283108/photo/homemade-vegan-pulled-jackfruit-bbq-sandwich.webp?s=612x612&w=is&k=20&c=Ozo1E4OIejnwhRee75yiWwGKWL4Ou2MoCgw-2jj5tOo=",
        rating: 4.2,
        spicy: true,
        challenge: true,
      },
      {
        id: "0041",
        name: "Sriracha Sizzle",
        description:
          "Beef patty, sriracha aioli, pepper jack, grilled jalapeños",
        price: 12.99,
        image:
          "https://img.recraft.ai/Jw_JUAHzyfvj8ihe9CXCjnhV_rYngGI1KafOTAAkYxc/rs:fit:1024:2048:0/q:95/g:no/plain/abs://prod/images/d7e80bda-3fa4-42ac-abd5-fd51de86891d@jpg",
        rating: 4.3,
        spicy: true,
      },
      {
        id: "0042",
        name: "Chipotle Fire Burger",
        description:
          "Angus beef, chipotle peppers, smoked cheddar, spicy aioli",
        price: 13.49,
        image:
          "https://nahdalas-kitchen.com/wp-content/uploads/2017/08/chipotle-chilli-burger-4-e1502288050126.jpg",
        rating: 4.4,
        spicy: true,
      },
    ],
  },
];

const renderRatingStars = (rating) => {
  return (
    <div style={{ color: "#ffc107", fontSize: "14px", margin: "5px 0" }}>
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < Math.floor(rating) ? "★" : i < rating ? "½" : "☆"}
        </span>
      ))}
    </div>
  );
};

const BurgerMenu = () => {
  const handleAddToCart = (burger) => {
    console.log(`Added to cart: ${burger.name}`);
  };

  return (
    <section
      id="burgers"
      style={{
        padding: "80px 0",
        background: "#f5f1ea",
        position: "relative",
      }}
    >
      <Container>
        <Row className="justify-content-center mb-5">
          <Col lg={8} className="text-center">
            <Fade direction="up" duration={800} triggerOnce>
              <h2
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "#3a2e26",
                  marginBottom: "15px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                BURGER SELECTION
              </h2>
              <p
                style={{
                  fontSize: "18px",
                  color: "#6e5c4b",
                  marginBottom: "30px",
                  fontStyle: "italic",
                }}
              >
                Handcrafted with premium ingredients and served fresh
              </p>
              <div
                style={{
                  width: "80px",
                  height: "4px",
                  background: "#d4a056",
                  margin: "0 auto 30px",
                  borderRadius: "2px",
                }}
              ></div>
            </Fade>
          </Col>
        </Row>

        {burgerCategories.map((category, catIndex) => (
          <React.Fragment key={catIndex}>
            <Row className="mb-4">
              <Col>
                <h3
                  style={{
                    fontSize: "28px",
                    fontWeight: "600",
                    color: "#3a2e26",
                    borderBottom: "2px solid #e0d6cc",
                    paddingBottom: "10px",
                    position: "relative",
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {category.category}
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-2px",
                      left: "0",
                      width: "80px",
                      height: "2px",
                      background: "#d4a056",
                    }}
                  ></span>
                </h3>
              </Col>
            </Row>

            <Row className="g-4 mb-5">
              {category.items.map((item, index) => (
                <Col lg={4} md={6} key={item.id}>
                  <Fade
                    direction="up"
                    duration={800}
                    delay={index * 100}
                    triggerOnce
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 5px 15px rgba(58,46,38,0.08)",
                        transition: "all 0.3s ease",
                        height: "100%",
                        position: "relative",
                        border: item.premium ? "2px solid #d4a056" : "none",
                      }}
                    >
                      <div
                        style={{
                          height: "220px",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.5s ease",
                          }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                        {item.bestseller && (
                          <div
                            style={{
                              position: "absolute",
                              top: "15px",
                              right: "15px",
                              background: "#d4a056",
                              color: "#fff",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Bestseller
                          </div>
                        )}
                        {item.featured && (
                          <div
                            style={{
                              position: "absolute",
                              top: "15px",
                              left: "15px",
                              background: "#9c3d2b",
                              color: "#fff",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Chef's Pick
                          </div>
                        )}
                        {item.premium && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "15px",
                              right: "15px",
                              background: "#d4a056",
                              color: "#3a2e26",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: "700",
                              textTransform: "uppercase",
                              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            Premium
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "20px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                          }}
                        >
                          <h4
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "#3a2e26",
                              margin: "0",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            {item.name}
                          </h4>
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "700",
                              color: "#9c3d2b",
                              fontFamily: "'Montserrat', sans-serif",
                            }}
                          >
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        {renderRatingStars(item.rating)}
                        <p
                          style={{
                            color: "#6e5c4b",
                            fontSize: "14px",
                            margin: "10px 0 15px",
                            lineHeight: "1.5",
                            fontFamily: "'Open Sans', sans-serif",
                          }}
                        >
                          {item.description}
                        </p>
                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{
                            background: "#9c3d2b",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "30px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            width: "100%",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            fontFamily: "'Montserrat', sans-serif",
                            marginTop: "10px",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = "#7a3023";
                            e.currentTarget.style.transform =
                              "translateY(-2px)";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = "#9c3d2b";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </Fade>
                </Col>
              ))}
            </Row>
          </React.Fragment>
        ))}
      </Container>
    </section>
  );
};

export default BurgerMenu;
