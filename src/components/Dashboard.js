import "../common_css.scss";
import "./Dashboard.scss";
import React from 'react';
import { format_value } from '../shared.js';

export default class Dashboard extends React.Component{
  render() {
    const { most_recent_data } = this.props;

    return <div className="row-to-column" style={{justifyContent: "space-evenly", margin: "30px 0px 80px 0px"}}>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "Total Confirmed Cases",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: format_value(most_recent_data.confirmed),
        }} />
      </div>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "New Confirmed Cases Today",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: `↑${format_value(most_recent_data.new_confirmed)}`,
        }} />
      </div>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "Total Deaths",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: format_value(most_recent_data.deaths),
        }} />
      </div>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "New Deaths",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: `↑${format_value(most_recent_data.new_deaths)}`,
        }} />
      </div>
    </div>;
  }
}