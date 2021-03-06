import _ from 'lodash';
import { d3 } from '../shared';

class GraphRegistry {
  constructor(){
    this.registry = [];
    this.window_width_last_updated_at = typeof window !== 'undefined' ? window.innerWidth : null;

    const that = this;
    if(typeof window !== 'undefined') {
      window.addEventListener(
        "hashchange", 
        _.debounce(function(){ 
          that.update_registry();
        }, 250),
      );
  
      window.addEventListener(
        "resize", 
        _.debounce(function(){
          if ( that.should_graphs_update() ){
            that.update_registry();
            that.update_graphs();
          }
        }, 250),
      );  
    }
  }
  
  should_graphs_update(){
    if (typeof window !== 'undefined') {
      return window.innerWidth !== this.window_width_last_updated_at;
    }
  }

  update_registry(){
    const new_registry = this.registry.filter(
      (panel_obj) => document.body.contains( panel_obj.html.node() ), 
    );
    this.registry = new_registry;
  }

  update_graphs(){
    this.window_width_last_updated_at = typeof window !== 'undefined' ? window.innerWidth : null;

    this.registry.forEach( (panel_obj) => {
      panel_obj.outside_width = panel_obj.html.node().offsetWidth;
      panel_obj.outside_height = panel_obj.options.height || 400;

      const html_container = panel_obj.html.node();

      // forEach directly on a nodeList has spoty support even with polyfils, 
      // mapping it through to an array first works consistently though
      _.map(html_container.childNodes, _.identity)
        .forEach(
          child => {
            // Remove all labels associated with the graph (that is, all siblings of the svg's container).
            if ( !_.isUndefined(child) && !child.className.includes("__svg__") ){
              html_container.removeChild(child);
            }
          },
        );

      panel_obj.render(panel_obj.options);
    });
  }

  setup_graph_instance(instance, container, options = {}){
    const base_dispatch_events = [
      "renderBegin",
      "renderEnd",
      'dataMouseEnter',
      'dataMouseLeave',
      'dataFocusIn',
      "dataFocusOut",
      "dataClick",
      "dataHover",  
      "dataHoverOut",
    ];
  
    instance.options = options;
  
    container
      .attr("aria-hidden", "true")
      .append("div")
      .classed("__svg__", true);
  
    if (options.alternative_svg){
      container.select(".__svg__").html(options.alternative_svg);
    } else {
      container.select(".__svg__").append("svg");    
    }
  
    instance.svg = container.select("svg");
    instance.outside_width = container.node().offsetWidth;
    instance.outside_height = options.height || 400;
  
    instance.html = container; 
  
    instance.dispatch = options.dispatch = d3.dispatch.apply(
      this,
      base_dispatch_events.concat(options.events || []),
    );
  
    this.registry.push(instance);
  }
}

const graphRegistry = new GraphRegistry;
export default graphRegistry;