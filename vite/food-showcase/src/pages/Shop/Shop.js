import React from "react";
import Layout from "../../components/Layouts/Layout";
import "../../styles/ShopStyle.css";
import Section1 from "./Section1.js";
import Section2 from "./Section2";
import Section3 from "./Section3.js";

const Shop = () => {
  return (
    <Layout>
      {/* Shop Hero Section */}
      <Section1 />

      {/* Featured Products */}
      <Section2 />

      {/* Special Offers */}
      <Section3 />
    </Layout>
  );
};

export default Shop;
