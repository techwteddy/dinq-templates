import React from "react";
import Layout from "../../components/Layouts/Layout";
import "../../styles/BlogStyle.css";
import Section1 from "./Section1.js";
import Section2 from "./Section2.js";
import Section3 from "./Section3.js";

const Blog = () => {
  return (
    <Layout>
      {/* Blog Hero Section */}
      <Section1 />

      {/* Latest Articles */}
      <Section2 />

      {/* Newsletter */}
      <Section3 />
    </Layout>
  );
};

export default Blog;
