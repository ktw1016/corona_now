import "../common_css.scss";
import "./Dashboard.scss";
import React from 'react';

export default class Dashboard extends React.Component{
  render() {
    const { most_recent_data } = this.props;

    return <div className="row-to-column" style={{justifyContent: "space-evenly", margin: "30px 0px 80px 0px"}}>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "Total Confirmed Cases",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: most_recent_data.total_cases,
        }} />
      </div>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "New Confirmed Cases ",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: most_recent_data.new_confirmed,
        }} />
      </div>
      <div className="flex-col text-align-mid">
        <span className="bold-30" dangerouslySetInnerHTML={{
          __html: "Total Deaths",
        }} />
        <span className="bold-red-45" dangerouslySetInnerHTML={{
          __html: most_recent_data.total_deaths,
        }} />
      </div>
    </div>;
  }
}