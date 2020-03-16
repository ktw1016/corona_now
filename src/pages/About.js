import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";

const About = () => (
  <Layout>
    <SEO title="About" />
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 30 }}>
      <h2> CREDITS </h2>
      <span dangerouslySetInnerHTML={{
        __html: "The graph of Canada was inspired from <a href='https://github.com/TBS-EACPD/infobase/blob/master/LICENSE'>GC Infobase </a>",
      }} />
      <br></br>
      <h2> CONTACT </h2>
      <span dangerouslySetInnerHTML={{
        __html: "You can reach me on <a href='https://www.taewankang.com'> my website </a>",
      }} />

    </div>
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default About;
