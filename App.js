import React, {
  Component
} from "react";
import MySearch from "./MySearch";
import {
  mapCustomStyle
} from './mapCustomStyle.js';

class App extends Component {
  constructor(props) {
    super();
    //to save object example when it using
    //https://github.com/manishbisht/Neighborhood-Map-React/blob/master/src/components/App.js
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    this.state = {
      myspots: [{
          "name": "Ron Jon Surf Shop",
          "latitude": 28.3571705,
          "longitude": -80.60775660000002
        },
        {
          "name": "Lori Wilson Park",
          "latitude": 28.337143,
          "longitude": -80.60951160000002
        },
        {
          "name": "Cocoa Beach Pier",
          "latitude": 28.3677259,
          "longitude": -80.60278370000003
        },
        {
          "name": "Dinosaur Store",
          "latitude": 28.3573746,
          "longitude": -80.6100553
        },
        {
          "name": "Gator N Golf",
          "latitude": 28.3752204,
          "longitude": -80.60617350000001
        }
      ]
    };

  }
  componentDidMount() {
    window.initMap = this.initMap;
      loadJS("https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=AIzaSyDJ_5QyHVCFBUk-i8Wyn8adRWOMulwJ9Qk&v=3&callback=initMap")
  }
    // https://www.klaasnotfound.com/2016/11/06/making-google-maps-work-with-react/

  initMap() {
    //set map parameters
    //stackoverflow.com/questions/17720202/set-div-height-to-window-innerheight-in-javascript/17720681
    document.getElementById('mymap').style.height = window.innerHeight + "px";
    var bounds = new window.google.maps.LatLngBounds();
    var mapinit = this;
    var InfoWindow = new window.google.maps.InfoWindow({});
    var map = new window.google.maps.Map(document.getElementById('mymap'), {
      center: {
        lat: 28.3200067,
        lng: -80.60755130000001
      },
      zoom: 10,
      styles: mapCustomStyle
    });
    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      mapinit.closeInfoWindow();
    });

    this.setState({
      map: map,
      bounds: null,
      infowindow: InfoWindow
    });

    window.google.maps.event.addListener(map, "click", function() {
      mapinit.closeInfoWindow();
    });
    //Create a marker per location
    //https://github.com/udacity/ud864/blob/master/Project_Code_6_StaticMapsAndStreetViewImagery.html
    var myspots = [];
    this.state.myspots.forEach(function(location) {
      var attribute = location.name;
      const loc = new window.google.maps.LatLng(location.latitude, location.longitude)
      const marker = new window.google.maps.Marker({
        position: loc,
        animation: window.google.maps.Animation.DROP,
        draggable: false,
        map: map
      });

      marker.addListener("click", function() {
        mapinit.openInfoWindow(marker);
      });
      bounds.extend(marker.position);
      location.attribute = attribute;
      location.marker = marker;
      location.display = true;
      myspots.push(location)

    });
    map.fitBounds(bounds);
    this.setState({
      myspots: myspots
    });
  }
  // open/close infowindow: https://github.com/blurdylan/neighborhood-map-react/blob/master/src/components/App.js
  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    this.setState({
      markers: marker
    });
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.state.infowindow.setContent("Please, wait a second");
    this.state.map.setCenter(marker.getPosition());
    this.markerAtt(marker);
  }

  markerAtt(marker) {
    var mapinit = this;
    // Foursquare API key
    var clientId = "FKWXXBCQ2AYYFEHYTIO0V5F3Z3LOPWDRKNY2OWCUEPM0N5JW";
    var clientSecret = "OEFX23UXOAM4DXWK3WLYET0THQHU3GXJKQLCCPPENAP1CZ4C";

    // make call to the link
    //https://examples.javacodegeeks.com/android/android-foursquare-api-example/
    var link = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";

    //check the status of response
    //https://javascript.info/async-await
    fetch(link)
      .then(function(response) {
        if (response.status !== 200) {
          mapinit.state.infowindow.setContent("There is something with conection");
          return;
        }
        // Return body text as json
        //https://developer.mozilla.org/en-US/docs/Web/API/Body/json
        response.json().then(function(data) {
          var results = data.response.venues[0];
          var place = `<h2>${results.name}</h2>`;
          var street = `<h3>${results.location.formattedAddress[0]}</h3>`;
          var readMore =
            '<a href="https://foursquare.com/v/' +
            results.id +
            '" target="_blank">More information you will find on <b>Foursquare</b></a>';
          mapinit.state.infowindow.setContent(place + street + readMore);
        });
      })
      .catch(function(err) {
        mapinit.state.infowindow.setContent("Error");
      });
  }

  closeInfoWindow() {
    if (this.state.markers) {
      this.state.markers.setAnimation(null);
    }
    this.setState({
      markers: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return ( <
      div >
      <
      MySearch key = "mymap"
      myspots = {
        this.state.myspots
      }
      openInfoWindow = {
        this.openInfoWindow
      }
      closeInfoWindow = {
        this.closeInfoWindow
      }
      /> <
      div id = "mymap" / >
      <
      /div>
    );
  }
}

export default App;
function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  }
  ref.parentNode.insertBefore(script, ref);
}
