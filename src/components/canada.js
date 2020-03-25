import './legend.scss';
import './canada.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { CanadaD3Component } from './CanadaD3Component.js';
import { get_graph_color, d3, format_date } from '../shared.js';
import _ from 'lodash';

class CanadaGraph extends React.Component {
  constructor(){
    super();
    this.graph_area = React.createRef();
  }
  render() {
    return <div ref={this.graph_area}/>;
  }
  componentDidMount() {
    this._render();
  }
  componentDidUpdate() {
    this._render();
  }
  _render() {
    const { data, color_scale, prov_select_callback } = this.props;

    const graph_area_sel = d3.select( ReactDOM.findDOMNode(this.graph_area.current) );
    
    const canada_graph = new CanadaD3Component(graph_area_sel.node(), {
      main_color: get_graph_color(1),
      secondary_color: "#8c949e",
      data,
      color_scale,
    });

    let active_prov = false;
    canada_graph.dispatch.on('dataMouseEnter', prov => {
      active_prov = true;
      prov_select_callback(prov);    
    });
    canada_graph.dispatch.on('dataMouseLeave', () => {
      _.delay(() => {
        if (!active_prov) {
          prov_select_callback(null);
        }
      }, 200);
      active_prov = false;
    });

    canada_graph.render();
  }
}

export class Canada extends React.Component{
  constructor(props){
    super(props);

    this.prov_select_callback = this.prov_select_callback.bind(this);
    this.date_range = _.keys(props.data.canada);

    this.state = {
      date: _.last(this.date_range),
      prov: null,
    };
  }

  prov_select_callback(selected_prov){
    if(selected_prov !== this.state.prov){
      this.setState({prov: selected_prov});
    }
  }
  render(){
    const { date } = this.state;
    const {
      data,
      data_type,
    } = this.props;

    const processed_data = [_.chain(data)
      .omit("canada")
      .map( (prov_data, prov) => [ prov, prov_data[date][data_type] ] )
      .fromPairs()
      .value()];
    const max = _.chain(processed_data)
      .last()
      .values()
      .map(val => _.toInteger(val))
      .max()
      .value();
    const color_scale = d3.scaleLinear()
      .domain([0, max])
      .range([0.2, 1]);

    const legend_items = _.map(color_scale.ticks(5).reverse(), (tick, idx, ticks) => ({
      label: idx > 0 ? `${tick} - ${ticks[idx - 1]}` : `${tick}+`,
      active: true,
      id: tick,
      color: get_graph_color( color_scale(tick) ),
    }));

    return (
      <div className="row" style={{margin: "30px 0px 0px 0px"}}>
        <div className="legend-container col-md-3" style={{maxHeight: "360px", width: "100%"}}>
          <p style={{marginTop: 0, marginBottom: 0}} className="nav-header centerer">
              Legend
          </p>
          <ul className="legend-list-inline">
            {_.map(legend_items, ({ color, label, id, active }) => 
              <li
                key={id}
                className="legend-list-el"
              >
                <div style={{
                  display: "flex",
                  pointerEvents: "none",
                }}>
                  <span
                    aria-hidden={true}
                    style={{
                      border: `1px solid ${color}`,
                      backgroundColor: color,
                      textAlign: "center",
                    }}
                    className={ "legend-color-checkbox" }
                  >
                  </span>
                  <span> { label } </span>
                </div>
              </li>,
            )}
          </ul>
        </div>
        <div className="col-md-9" style={{position: "relative", width: "100%"}}>
          <CanadaGraph
            data={processed_data}
            color_scale={color_scale}
            prov_select_callback={this.prov_select_callback}
          />
        </div>
        <div className="col-md-12 text-center flex-col" style={{marginTop: 50}}>
          <span dangerouslySetInnerHTML={{
            __html: `<i> Above graph is showing results for the date: </i>`,
          }} />
          <span className="text-animation"
            dangerouslySetInnerHTML={{
              __html: `${format_date(date)}`,
            }} />
          <input type="range" min={1} max={this.date_range.length-1} step={1}
            onChange={ (e) => this.setState({ date: this.date_range[e.target.value] }) }
          />
        </div>
      </div>
    );
  }
}