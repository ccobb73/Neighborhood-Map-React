//https://github.com/manishbisht/Neighborhood-Map-React/blob/master/src/components/LocationItem.js
import React from "react";
class Location extends React.Component {

  render() {
    return (
      <li role="button" className="location" tabIndex="0" key="111"
        onKeyPress={this.props.openInfoWindow.bind(this, this.props.data.marker )}
        onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}>
        {this.props.data.attribute}
      </li>
    );
  }
}

export default Location;
