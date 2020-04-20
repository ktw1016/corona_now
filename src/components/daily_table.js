import './daily_table.scss';
import React from "react";
import _ from 'lodash';
import { format_date, format_value } from '../shared.js';

export default class DailyTable extends React.Component{
  render(){
    const {
      data,
    } = this.props;
    
    const headers = ["Date", "Total confirmed cases", "New confirmed cases", "Total deaths", "New Deaths"];
    return <div>
      <table>
        <thead>
          <tr>
            { _.map(headers, (header) =>
              <td key={header}> {header} </td>,
            ) }
          </tr>
        </thead>
        <tbody>
          { _.chain(data)
            .keys()
            .reverse()
            .map(date => 
              <tr key={_.uniqueId(date)}>
                <td key={_.uniqueId(date)}> {format_date(date)} </td>
                <td key={_.uniqueId(data[date].total_confirmed)}> {format_value(data[date].total_confirmed)} </td>
                <td key={_.uniqueId(data[date].new_confirmed)}> {format_value(data[date].new_confirmed)} </td>
                <td key={_.uniqueId(data[date].total_deaths)}> {format_value(data[date].total_deaths)} </td>
                <td key={_.uniqueId(data[date].new_deaths)}> {format_value(data[date].new_deaths)} </td>
              </tr>,
            )
            .value()
          }
        </tbody>
      </table>
    </div>;
  }
}