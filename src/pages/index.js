import "../common_css.scss";
import React from "react";
import _ from 'lodash';
import { graphql } from "gatsby";

import { provinces_reversed } from "../shared.js";
import Layout from "../components/layout";
import SEO from "../components/seo";
import DailyTable from "../components/daily_table.js";
import Dashboard from "../components/Dashboard.js";
//import NivoLineGraph from '../components/nivo_line_graph.js';
import { Canada } from "../components/canada.js";
import { TabbedContent } from "../components/TabbedContent";

class Index extends React.Component{
  render() {
    const queried_data = this.props.data;

    const lastUpdated = queried_data.allLastUpdatedCsv.edges[0].node.lastUpdated;
    const daily_data = _.reduce(_.zip(queried_data.allTimeSeriesCovid19ConfirmedGlobalCsv.edges, queried_data.allTimeSeriesCovid19DeathsGlobalCsv.edges), (result, row) => {
      const confirmed = row[0].node;
      const deaths = row[1].node;
      const confirmed_values = _.omit(confirmed, "Province_State");
      var prev_date = null;
      const prov_daily_data = _.reduce(confirmed_values, (prov_result, confirmed_val, date) => {
        prov_result[date] = {
          total_confirmed: _.toInteger(confirmed_val),
          total_deaths: _.toInteger(deaths[date]),
          new_confirmed: prev_date ? confirmed_val - confirmed[prev_date] : _.toInteger(confirmed_val),
          new_deaths: prev_date ? deaths[date] - deaths[prev_date] : _.toInteger(deaths[date]),
        };
        prev_date = date;
        return prov_result;
      }, {});
      if(provinces_reversed[row[0].node.Province_State]){
        result[provinces_reversed[row[0].node.Province_State]] = prov_daily_data;
      }
      return result;
    },{});
    const canada_daily = _.reduce( daily_data, (canada_total, prov_data) => {
      _.forEach( _.keys(prov_data), date => {
        if(canada_total[date]) {
          canada_total[date] = {
            total_confirmed: canada_total[date].total_confirmed += prov_data[date].total_confirmed,
            new_confirmed: canada_total[date].new_confirmed += prov_data[date].new_confirmed,
            total_deaths: canada_total[date].total_deaths += prov_data[date].total_deaths,
            new_deaths: canada_total[date].new_deaths += prov_data[date].new_deaths,
          };
        } else {
          canada_total[date] = {
            total_confirmed: prov_data[date].total_confirmed,
            new_confirmed: prov_data[date].new_confirmed,
            total_deaths: prov_data[date].total_deaths,
            new_deaths: prov_data[date].new_deaths,
          };
        }
      });
      return canada_total;
    }, {});
    const canada_data_today = canada_daily[_.chain(canada_daily)
      .keys()
      .last()
      .value()];
    const grand_total_canada = {
      confirmed: canada_data_today.total_confirmed,
      deaths: canada_data_today.total_deaths,
      new_confirmed: canada_data_today.new_confirmed,
      new_deaths: canada_data_today.new_deaths,
    };
    _.set(daily_data, "canada", canada_daily);
    /*
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
    */
    return(
      <Layout>
        <SEO title="Home" />
        <div className="flex-col">
          <a href="https://ko-fi.com/coronanow" target="_blank">
            <img height="46" style={{border:"0px", height:"46px"}} src="https://az743702.vo.msecnd.net/cdn/kofi4.png?v=2" border="0" alt="Buy Me a Coffee at ko-fi.com"/>
          </a>
          <span dangerouslySetInnerHTML={{
            __html: `<i> LAST UPDATED: ${lastUpdated} </i>`,
          }} />
          <Dashboard most_recent_data={grand_total_canada} />
          <TabbedContent
            tab_keys={["confirmed", "death"]}
            tab_labels={{
              confirmed: "Total confirmed cases by province",
              death: "Total deaths by province",
            }}
            tab_pane_contents={{
              confirmed: <Canada
                data={daily_data}
                data_type={"total_confirmed"} />,
              death: <Canada
                data={daily_data}
                data_type={"total_deaths"} />,
            }}
          />
          <DailyTable data={daily_data.canada} />
          <a href="https://ko-fi.com/coronanow" target="_blank">
            <img height="46" style={{border:"0px", height:"46px"}} src="https://az743702.vo.msecnd.net/cdn/kofi4.png?v=2" border="0" alt="Buy Me a Coffee at ko-fi.com"/>
          </a>
        </div>
      </Layout>
    );
  }
}

export default Index;

export const IndexQuery = graphql`
  query {
    allLastUpdatedCsv {
      edges {
        node {
          lastUpdated
        }
      }
    }
    allTimeSeriesCovid19DeathsGlobalCsv(filter: {Country_Region: {eq: "Canada"}}) {
      edges {
        node {
          Province_State
          _2_25_20
          _2_26_20
          _2_27_20
          _2_28_20
          _2_29_20
          _3_1_20
          _3_2_20
          _3_3_20
          _3_4_20
          _3_5_20
          _3_6_20
          _3_7_20
          _3_8_20
          _3_9_20
          _3_10_20
          _3_11_20
          _3_12_20
          _3_13_20
          _3_14_20
          _3_15_20
          _3_16_20
          _3_17_20
          _3_18_20
          _3_19_20
          _3_20_20
          _3_21_20
          _3_22_20
          _3_23_20
          _3_24_20
          _3_25_20
          _3_26_20
          _3_27_20
          _3_28_20
          _3_29_20
          _3_30_20
        }
      }
    }
    allTimeSeriesCovid19ConfirmedGlobalCsv(filter: {Country_Region: {eq: "Canada"}}) {
      edges {
        node {
          Province_State
          _2_25_20
          _2_26_20
          _2_27_20
          _2_28_20
          _2_29_20
          _3_1_20
          _3_2_20
          _3_3_20
          _3_4_20
          _3_5_20
          _3_6_20
          _3_7_20
          _3_8_20
          _3_9_20
          _3_10_20
          _3_11_20
          _3_12_20
          _3_13_20
          _3_14_20
          _3_15_20
          _3_16_20
          _3_17_20
          _3_18_20
          _3_19_20
          _3_20_20
          _3_21_20
          _3_22_20
          _3_23_20
          _3_24_20
          _3_25_20
          _3_26_20
          _3_27_20
          _3_28_20
          _3_29_20
          _3_30_20
        }
      }
    }
  }
`;