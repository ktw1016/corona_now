// base map obtained from [here](http://commons.wikimedia.org/wiki/File:Canada_blank_map.svg) 
//
// data in the following format:
//  ```javascript
//  [ {"on" : 1000, "qc": 2000, etc..}]
//  [ {"on" : 1000, "qc": 2000, etc..}]
//  [ {"on" : 1000, "qc": 2000, etc..}]
//  [ {"on" : 1000, "qc": 2000, etc..}]
//  ```
//  with the array ordered by fiscal year
//

import {
  provinces,
  provinces_short,
  d3,
} from '../shared.js';
import graphRegistry from "./graphRegistry";
import { CanadaSVG } from "./CanadaSVG.js";
import _ from 'lodash';

const ordering = _.chain([
  "yt", "nt", "nu", "bc", "ab", "sk", "mb", "on", "qc", "nl", "nb", "ns", "pe",
])
  .map( (prov_key, index) => [prov_key, index] )
  .fromPairs()
  .value();

const get_province_display_name = (prov_key, scale) => {
  if ( provinces[prov_key] && (scale > 0.5) ){
    // If the graph is large enough and the full name is defined, use full name
    return provinces[prov_key]; 
  } else if ( provinces_short[prov_key] && (scale < 0.5) ){ 
    // If the graph is too small and the short name is defined, use short name. Basically bilingual prov codes
    return provinces_short[prov_key]; 
  } else {
    return prov_key;
  }
};

const get_province_element_id = (prov_key) => `#CA-${prov_key}`;


export class CanadaD3Component {
  constructor(container, options){
    options.alternative_svg = CanadaSVG;
  
    graphRegistry.setup_graph_instance(this, d3.select(container), options);
  }

  render(options) {
    this.options = _.extend(this.options, options);
    const data = this.options.data;
    const last_year_data = _.last(data);

    const x_scale_factor = 1396;
    const y_scale_factor = 1346;
    
    const max_height = 700;
    const x_scale = (this.outside_width / x_scale_factor) * 1.1;
    const y_scale = (max_height / y_scale_factor) * 1.1;
    const scale = Math.min(x_scale, y_scale);
    const height = scale * y_scale_factor;
    const padding = ( this.outside_width - (scale * x_scale_factor) ) / 2;
    const main_color = this.options.main_color;
    const secondary_color = this.options.secondary_color;
    const color_scale = this.options.color_scale;

    const html = this.html;
    const svg = this.svg;
    const graph_dispatcher = this.dispatch;
    // Set dimensions and scaling of svg
    svg
      .attrs({
        height: height + "px",
        width: this.outside_width + "px",
      });
    svg.select(".container")
      .attr("transform", `translate(${padding},0), scale(${scale})`);
    
    // Graph event dispatchers
    let previous_event_target_prov_key = false;
    const dispatch_mouseLeave = function(){
      if (previous_event_target_prov_key) {
        svg.select( get_province_element_id(previous_event_target_prov_key) )
          .styles({
            "stroke-width": "2px",
            stroke: main_color,
          });
      }
      previous_event_target_prov_key = false;
      graph_dispatcher.call("dataMouseLeave");
    };
    const dispatch_mouseEnter = function(prov_key){
      if (previous_event_target_prov_key) {
        svg.select( get_province_element_id(previous_event_target_prov_key) )
          .styles({
            "stroke-width": "2px",
            stroke: main_color,
          });
      }
      if ( !_.isUndefined(last_year_data[prov_key]) ){
        previous_event_target_prov_key = prov_key;
        svg.select( get_province_element_id(prov_key) )
          .styles({
            "stroke-width": (prov_key === "abroad" || prov_key === "na") ? "8px" : "15px",
            stroke: main_color,
          });
  
        graph_dispatcher.call("dataMouseEnter", "", prov_key);
      }
    };

    // Set province colours, attach event dispatchers
    const province_is_active = (prov_key) => _.some(data, (year) => year[prov_key]);
    const get_color = (prov_key) => province_is_active(prov_key) ? main_color : secondary_color;
    const get_opacity = (prov_key) => province_is_active(prov_key) ? color_scale(last_year_data[prov_key] || 0) : 0.5;

    svg.selectAll(".province")
      .each(function(d){
        var that = d3.select(this);
        var prov_key = that.attr("id").split("-")[1];
        d3.select(this).datum(prov_key);
      })
      .styles({
        fill: get_color,
        "fill-opacity": get_opacity,
        "stroke-width": "2px",
        stroke: get_color,
        "stroke-opacity": get_opacity,
      })
      .on("mouseenter", dispatch_mouseEnter)
      .on("focus", dispatch_mouseEnter)
      .on("mouseleave", dispatch_mouseLeave)
      .on("blur", dispatch_mouseLeave);
    // Add labels to provinces with data, attach event dispatchers
    const provinces_to_label = _.chain(ordering)
      .keys()
      .filter( prov_key => _.some(data, (yearly_data) => yearly_data[prov_key]) )
      .value();

    html.selectAll("div.label")
      .data(provinces_to_label)
      .enter()
      .append("div")
      .order()
      .attr("class", "label")
      .attr("tabindex", 0)
      .on("mouseenter", dispatch_mouseEnter)
      .on("focus", dispatch_mouseEnter)
      .on("mouseleave", dispatch_mouseLeave)
      .on("blur", dispatch_mouseLeave)
      .each( function(prov_key, i){

        const label = svg.selectAll("g.label")
          .filter(function(){ 
            return d3.select(this).attr("id") === `label-${prov_key}`;
          });

        const coords = label.attr("transform")
          .replace(/(translate\(|\)|)/g,"")
          .replace(","," ")
          .split(" ");

        d3.select(this)
          .styles({
            left: padding + (scale * coords[0]) + "px",
            top: scale * coords[1] + "px",
            padding: "5px",
            position: "absolute",
            "border-radius": "5px",
            "text-align": "center",
            "font-size": "10px",
            "background-color": "#bbc1c9",
          }); 

        
        const prov_name = get_province_display_name(prov_key, scale);
        
        d3.select(this)
          .append("p")
          .style("margin-bottom", "0px")
          .style("font-weight", "bold")
          .html(prov_name);

        d3.select(this)
          .append("p")
          .style("margin-bottom", "0px")
          .style("font-weight", "bold")
          .html( last_year_data[prov_key] );
      });
    // Hide optional map components based on data availability
    const hide_map_components = (selector) => svg
      .selectAll(selector)
      .styles({
        visibility: "hidden",
      });
    const hide_optional_components = (prov_keys, selector_template) => _.each(
      prov_keys,
      (prov_key) => {
        const corresponding_province_has_data = _.some(
          data,
          (yearly_data) => yearly_data[prov_key],
        );
        if (!corresponding_province_has_data) {
          hide_map_components( selector_template(prov_key) );
        }
      },
    );
    
    const optional_provinces = [
      "abroad", 
      "na",
      "ncr",
    ];
    hide_optional_components(
      optional_provinces,
      (prov_key) => `.province${get_province_element_id(prov_key)}`,
    );
  
    const provinces_with_optional_markers = [
      "pe",
      "ns",
      "nb",
      "ncr",
    ];
    hide_optional_components(
      provinces_with_optional_markers,
      (prov_key) => `path${get_province_element_id(prov_key)}-Marker`,
    ); }
}
