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
          Currently two data sources are used: <a href='https://www.who.int/' target='_blank' rel='noopener noreferrer'>
          World Health Organization (WHO) </a> and <a href='https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html' target='_blank' rel='noopener noreferrer'>
          Health Canada </a>.
        `,
      }} />
      <span dangerouslySetInnerHTML={{
        __html: `
        Please note that there may be discrepancies between the data visualizations due to different sources
        updating at different times
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
