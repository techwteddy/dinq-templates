import React from "react";
import Layout from "../../components/Layouts/Layout";
import "../../styles/MenuStyle.css";
import MenuHero from "./MenuHero.js";
import BurgerMenu from "./BurgerMenu.js";
import SidesMenu from "./SidesMenu.js";
import DrinksMenu from "./DrinksMenu.js";

const Menu = () => {
  return (
    <Layout>
      <MenuHero />
      <BurgerMenu />
      <SidesMenu />
      <DrinksMenu />
    </Layout>
  );
};

export default Menu;
