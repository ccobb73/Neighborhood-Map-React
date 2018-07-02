import React, { Component } from "react";
import Location from "./Location";

class MySearch extends Component {
 //https://github.com/udacity/reactnd-contacts-complete/blob/master/src/ListContacts.js
  constructor(props) {
    super();
    this.displayloc = this.displayloc.bind(this);

    this.state = {
      locations: "",
      query: ""
    };
  }

  displayloc(event) {
    this.props.closeInfoWindow();
    const { value } = event.target;
    var locations = [];
    //https://stackoverflow.com/questions/46225210/adding-setvisible-to-markers-created-in-a-map
    //https://github.com/udacity/reactnd-contacts-complete/blob/master/src/ListContacts.js
    this.props.myspots.forEach(function(location) {
      if (location.attribute.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations
    });
  }
//https://codeburst.io/how-to-use-react-lifecycle-methods-ddc79699b34e
  componentWillMount() {
    this.setState({
      locations: this.props.myspots
    });
  }

// https://github.com/Matildevoldsen/Neighborhood-Map-React-/blob/master/src/Components/Sidebar.js
  render() {
    var mysearch = this.state.locations.map(function(list, index) {
      return (
        <Location key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={list} />
      );
    }, this);

    return (
      <div className="sidebar"> <input className="text" type="text" role="search" placeholder="Search..." onChange={this.displayloc} />
        <ul className="input">
          {this.state && mysearch}
        </ul>
      </div>

    );
  }
}

export default MySearch;
