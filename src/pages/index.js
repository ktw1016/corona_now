import "../common_css.scss";
import React from "react";
import _ from 'lodash';
import { graphql } from "gatsby";

import Layout from "../components/layout";
import SEO from "../components/seo";
import DailyTable from "../components/daily_table.js";
import Dashboard from "../components/Dashboard.js";
import NivoLineGraph from '../components/nivo_line_graph.js';
import { Canada } from "../components/canada.js";

const WHO_last_updated = "March 19 2020 23:59 CET";
const HC_last_updated = "March 20, 2020, 6:00 pm EDT";

class Index extends React.Component{
  render() {
    const queried_data = this.props.data;

    const total_by_prov_data = _.reduce(queried_data.allCurrentSituationCsv.edges, (result, row) => {
      result[`${row.node.prov}`] = row.node.confirmed;
      return result;
    }, {});
    const grand_total_from_prov_data = _.reduce(queried_data.allCurrentSituationCsv.edges, (result, row) => {
      const int_death = _.toInteger(row.node.death);
      const int_confirmed = _.toInteger(row.node.confirmed);
      result["death"] = result["death"] ? result["death"] + int_death : int_death;
      result["confirmed"] = result["confirmed"] ? result["confirmed"] + int_confirmed : int_confirmed;
      return result;
    }, {});

    const daily_report_data = _.map( queried_data.allDailyReportCsv.edges, (row) => _.mapValues(row.node) );
    const total_cases_line_graph_data = _.map(queried_data.allDailyReportCsv.edges, (row) => {
      return {
        x: row.node.date,
        y: row.node.total_cases,
      };
    });
    const total_deaths_line_graph_data = _.map(queried_data.allDailyReportCsv.edges, (row) => {
      return {
        x: row.node.date,
        y: row.node.total_deaths,
      };
    });
    const line_graph_data = [
      {
        id: "total_confirmed",
        color: "#D90429",
        data: total_cases_line_graph_data,
      },
      {
        id: "total_deaths",
        color: "#630213",
        data: total_deaths_line_graph_data,
      },
    ];

    return(
      <Layout>
        <SEO title="Home" />
        <div className="flex-col">
          <span dangerouslySetInnerHTML={{
            __html: `<i> SOURCE: Health Canada (HC) </i>`,
          }} />
          <span dangerouslySetInnerHTML={{
            __html: `<i> LAST UPDATED: ${HC_last_updated} </i>`,
          }} />
          <Dashboard most_recent_data={grand_total_from_prov_data} />
          <span
            style={{fontSize: 25}}
            dangerouslySetInnerHTML={{
              __html: "Below shows <b> confirmed cases </b> of <b> COVID-19 in Canada </b>",
            }} />
          <NivoLineGraph data={line_graph_data}/>
          <Canada data={[total_by_prov_data]}/>
          <span dangerouslySetInnerHTML={{
            __html: `<i> SOURCE: World Health Organization (WHO) </i>`,
          }} />
          <span dangerouslySetInnerHTML={{
            __html: `<i> LAST UPDATED: ${WHO_last_updated} </i>`,
          }} />
          <DailyTable data={daily_report_data} />
        </div>
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
          death
        }
      }
    }
    allDailyReportCsv {
      edges {
        node {
          date
          total_cases
          new_confirmed
          total_deaths
          new_deaths
        }
      }
    }
  }
`;