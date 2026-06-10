import React from "react";
import Layout from "../../components/Layouts/Layout";
import "../../styles/ContactStyle.css";
import Section1 from "./Section1.js";
import Section2 from "./Section2.js";
import Section3 from "./Section3.js";
import Section4 from "./Section4.js";

const Contact = () => {
  return (
    <Layout>
      {/* Contact Hero Section */}
      <Section1 />

      {/* Contact Info Section */}
      <Section2 />

      {/* Contact Form Section */}
      <Section3 />

      {/* Map Section */}
      <Section4 />
    </Layout>
  );
};

export default Contact;