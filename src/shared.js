import * as a from "d3-array";
import * as b from "d3-axis";
import * as c from "d3-collection";
import * as d from "d3-color";
import * as e from "d3-dispatch";
import * as f from "d3-dsv";
import * as g from "d3-ease";
import * as h from "d3-hierarchy";
import * as i from "d3-interpolate";
import * as j from "d3-path";
import * as k from "d3-scale";
import * as l from "d3-selection";
import * as m from "d3-selection-multi";
import * as n from "d3-shape";
import * as o from "d3-transition";
import * as p from "d3-scale-chromatic";

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
// "This is an assign function that copies full descriptors"
// Here, used to preserve getters (like d3-selection.event), as opposed to Object.assign which just copies the value once (null for most)
function completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}

const d3 = completeAssign({}, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);

const graph_color = "#bf1806";

const provinces = {
  ab: "Alberta",
  bc: "British Columbia",
  mb: "Manitoba",
  nb: "New Brunswick",
  ns: "Nova Scotia",
  nt: "Northwest Territories",
  nu: "Nunavut",
  on: "Ontario",
  pe: "Prince Edward Island",
  qc: "Quebec",
  sk: "Saskatchewan",
  yt: "Yukon",
  nl: "Newfoundland and Labrador",
};
const provinces_short = {
  ab: "AB",
  bc: "BC",
  mb: "MB",
  nb: "NB",
  ns: "NS",
  nt: "NT",
  nu: "NU",
  on: "ON",
  pe: "PE",
  qc: "QC",
  sk: "SK",
  yt: "YT",
  nl: "NL",
};

const hex_to_rgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};    

const get_graph_color = (alpha) => {
  const rgb = hex_to_rgb(graph_color);
  return rgb && `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha || 1})`;
};

export {
  d3,
  provinces,
  provinces_short,
  graph_color,
  hex_to_rgb,
  get_graph_color,
};