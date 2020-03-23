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
    const confirmed_by_all_prov_data = _.reduce(queried_data.allTimeSeries19CovidConfirmedCsv.edges, (result, row) => {
      result[provinces_reversed[row.node.Province_State]] = _.last( _.values(row.node) );
      return result;
    }, {});
    const death_by_all_prov_data = _.reduce(queried_data.allTimeSeries19CovidDeathsCsv.edges, (result, row) => {
      result[provinces_reversed[row.node.Province_State]] = _.last( _.values(row.node) );
      return result;
    }, {});
    const grand_total_from_prov_data = {
      confirmed: _.sum( _.values(_.map( confirmed_by_all_prov_data, (val) => _.toInteger(val) )) ),
      death: _.sum( _.values(_.map( death_by_all_prov_data, (val) => _.toInteger(val) )) ),
    };
    const daily_data = _.reduce(_.zip(queried_data.allTimeSeries19CovidConfirmedCsv.edges, queried_data.allTimeSeries19CovidDeathsCsv.edges), (result, row) => {
      const prov_daily_data = _.chain(row[0].node)
        .keys()
        .drop(1)
        .map((current_date, idx, all_dates) => {
          const confirmed = row[0].node;
          const deaths = row[1].node;
          return {
            date: current_date,
            total_confirmed: _.toInteger(confirmed[current_date]),
            new_confirmed: idx > 0 ? confirmed[current_date] - confirmed[all_dates[idx-1]] : _.toInteger(confirmed[all_dates[idx]]),
            total_deaths: _.toInteger(deaths[current_date]),
            new_deaths: idx > 0 ? deaths[current_date] - deaths[all_dates[idx-1]] : _.toInteger(deaths[all_dates[idx]]),
          };})
        .value();
      result[provinces_reversed[row[0].node.Province_State]] = prov_daily_data;
      return result;
    },{});
    const canada_daily = _.reduce( _.values(daily_data), (canada_total, prov_data) => {
      _.forEach(prov_data, (value) => {
        if(canada_total[value.date]) {
          canada_total[value.date] = {
            total_confirmed: canada_total[value.date].total_confirmed += value.total_confirmed,
            new_confirmed: canada_total[value.date].new_confirmed += value.new_confirmed,
            total_deaths: canada_total[value.date].total_deaths += value.total_deaths,
            new_deaths: canada_total[value.date].new_deaths += value.new_deaths,
          };
        } else {
          canada_total[value.date] = {
            total_confirmed: value.total_confirmed,
            new_confirmed: value.new_confirmed,
            total_deaths: value.total_deaths,
            new_deaths: value.new_deaths,
          };
        }
      });
      return canada_total;
    }, {});
    _.set(daily_data, "canada",
      _.map(canada_daily, (value, date) => ({
        ...value,
        date: date,
      })),
    );
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
          <Dashboard most_recent_data={grand_total_from_prov_data} />
          <TabbedContent
            tab_keys={["confirmed", "death"]}
            tab_labels={{
              confirmed: "Total confirmed cases by province",
              death: "Total deaths by province",
            }}
            tab_pane_contents={{
              confirmed: <Canada data={[confirmed_by_all_prov_data]}/>,
              death: <Canada data={[death_by_all_prov_data]}/>,
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
    allTimeSeries19CovidConfirmedCsv(filter: {Country_Region: {eq: "Canada"}}) {
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
        }
      }
    }
    allTimeSeries19CovidDeathsCsv(filter: {Country_Region: {eq: "Canada"}}) {
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
        }
      }
    }
  }
`;