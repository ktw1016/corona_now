import React from "react";
import _ from 'lodash';
import { Link, graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import { Canada } from "../components/canada.js";

class Index extends React.Component{
  render() {
    const data = _.reduce(this.props.data.allCurrentSituationCsv.edges, (result, row) => {
      result[`${row.node.prov}`] = row.node.confirmed;
      return result;
    }, {});

    return(
      <Layout>
        <SEO title="Home" />
        <div style={{display: "flex", flexDirection: "column"}}>
          <span
            style={{fontSize: 25}}
            dangerouslySetInnerHTML={{
              __html: "Below shows <b> confirmed cases </b> of <b> COVID-19 in Canada </b>",
            }} />
          <br></br>
          <span dangerouslySetInnerHTML={{
            __html: "<i> LAST UPDATE: March 16, 2020, 9 am EST </i>",
          }} />
        </div>
        <Canada data={data}/>
        <Link to="/About/">About</Link>
      </Layout>
    );
  }
}

export default Index;

export const IndexQuery = graphql`
  query {
    allCurrentSituationCsv {
      edges {
        node {
          prov
          confirmed
        }
      }
    }
  }
`;