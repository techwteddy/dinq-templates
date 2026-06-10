import React from "react";
import Layout from "../../components/Layouts/Layout";
import "../../styles/AboutStyle.css";
import Section1 from "./Section1.js";
import Section2 from "./Section2.js";
import Section3 from "./Section3.js";

const About = () => {
  return (
    <Layout>
      {/* About Hero Section */}
      <Section1 />

      {/* Our Story Section */}
      <Section2 />

      {/* Our Team Section */}
      <Section3 />
    </Layout>
  );
};

export default About;
