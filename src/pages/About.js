import React from "react";

import Layout from "../components/layout";
import SEO from "../components/seo";

const About = () => (
  <Layout>
    <SEO title="About" />
    <div style={{ display: "flex", flexDirection: "column", marginBottom: 30 }}>
      <h2> DATA SOURCES </h2>
      <span dangerouslySetInnerHTML={{
        __html: `
          Currently, <a href='https://github.com/CSSEGISandData/COVID-19' target='_blank' rel='noopener noreferrer'>
          Johns Hopkins University Center for Systems Science and Engineering </a> is used.
        `,
      }} />
      <br></br>
      <h2> CREDITS </h2>
      <span dangerouslySetInnerHTML={{
        __html: "The graph of Canada was inspired from <a href='https://github.com/TBS-EACPD/infobase/blob/master/LICENSE' target='_blank' rel='noopener noreferrer'> GC Infobase </a>",
      }} />
      <br></br>
      <h2> CONTACT </h2>
      <span dangerouslySetInnerHTML={{
        __html: "You can reach me on <a href='https://www.taewankang.com' target='_blank' rel='noopener noreferrer'> my website </a>",
      }} />

    </div>
  </Layout>
);

export default About;
