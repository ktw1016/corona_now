import './daily_table.scss';
import React from "react";
import _ from 'lodash';
import { format_date } from '../shared.js';

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
            .reverse()
            .map(row => 
              <tr key={_.uniqueId(row)}>
                <td key={_.uniqueId(row.date)}> {format_date(row.date)} </td>
                <td key={_.uniqueId(row.total_confirmed)}> {row.total_confirmed} </td>
                <td key={_.uniqueId(row.new_confirmed)}> {row.new_confirmed} </td>
                <td key={_.uniqueId(row.total_deaths)}> {row.total_deaths} </td>
                <td key={_.uniqueId(row.new_deaths)}> {row.new_deaths} </td>
              </tr>,
            )
            .value()
          }
        </tbody>
      </table>
    </div>;
  }
}