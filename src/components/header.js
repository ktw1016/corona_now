import "../common_css.scss";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: `#630213`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      className="flex-row"
      style={{
        margin: `0 auto`,
        maxWidth: 2360,
        padding: `1.45rem 1.0875rem`,
        justifyContent: "space-between",
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div className="flex-row" style={{minWidth: "200px", justifyContent: "space-evenly"}}>
        <span style={{alignSelf: "flex-end", fontSize: 25}}>
          <Link to="/">Home</Link>
        </span>
        <span style={{alignSelf: "flex-end", fontSize: 25}}>
          <Link to="/About/">About</Link>
        </span>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
