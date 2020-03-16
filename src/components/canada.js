import React from 'react';
import ReactDOM from 'react-dom';
import { CanadaD3Component } from './CanadaD3Component.js';
import { get_graph_color, d3 } from '../shared.js';
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
  _render() {
    const { data, prov_select_callback } = this.props;

    const graph_area_sel = d3.select( ReactDOM.findDOMNode(this.graph_area.current) );
    
    const canada_graph = new CanadaD3Component(graph_area_sel.node(), {
      main_color: get_graph_color(1),
      secondary_color: "#8c949e",
      data,
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

    this.state = {
      prov: null,
    };
  }

  prov_select_callback(selected_prov){
    if(selected_prov !== this.state.prov){
      this.setState({prov: selected_prov});
    }
  }

  render(){
    const { data } = this.props;
    
    /*const legend_items = _.map(color_scale.ticks(5).reverse(), (tick, idx, ticks) => ({
      label: idx > 0 ? `${formatter(tick)} - ${formatter(ticks[idx - 1])}` : `${formatter(tick)}+`,
      active: true,
      id: tick,
      color: get_graph_color( color_scale(tick) ),
    }));*/
    return (
      <div className="frow no-container">
        <div className="fcol-md-9" style={{position: "relative"}}>
          <CanadaGraph
            data={data}
            prov_select_callback={this.prov_select_callback}
          />
        </div>
      </div>
    );
  }
}