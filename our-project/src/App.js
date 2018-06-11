import React from 'react';
import './index.css';

export default class App extends React.Component {
  // structure: state, didMount, render left and right divs 
  constructor() {
    super();
    this.state = {
      zoom: 17,
      maptype: "roadmap",
      place_formatted: '',
      place_id: '',
      place_location: '',
      place_lat:'',
      place_lng:'',
    };
  }
  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 45.5228, lng: -122.6462},
      zoom: 14,
      mapTypeId: 'hybrid',
      fontSize: "5px"
    });

    map.addListener('zoom_changed', () => {
      this.setState({
        zoom: map.getZoom(),
      });
    });

    map.addListener('maptypeid_changed', () => {
      this.setState({
        maptype: map.getMapTypeId(),
      });
    });

    let marker = new window.google.maps.Marker({
      map: map,
      position: {lat: 45.5228, lng: -122.6762},
    });
    
    // initialize the autocomplete functionality using the #pac-input input box
    let inputNode = document.getElementById('pac-input');
    map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(inputNode);
    let autoComplete = new window.google.maps.places.Autocomplete(inputNode);
    
    autoComplete.addListener('place_changed', () => {
      let place = autoComplete.getPlace();
      let location = place.geometry.location;

      {/*let locationArray=location.toString().split(",");
      let lat=locationArray[0];
      let lng=locationArray[1];
      let lat2=lat.split("");
      if (lat2[0]=="-"){
        lat2.unshift("S ");
      };
      else{
        lat2.unshift("N ");
      }
      latComplete=lat2.join("");
      */}
 

      this.setState({
        place_formatted: place.place_formatted,
        place_id: place.place_id,
        place_location: location.toString(),
        /*
        place_lat: lat.toString(),
        place_lng: lng.toString(),
        */
      });
    
      // bring the selected place in view on the map
      map.fitBounds(place.geometry.viewport);
      map.setCenter(location);
    
      marker.setPlace({
        placeId: place.place_id,
        location: location,
      });
    });
  }

  render() {
    return (
      <div id='app'>
        <div id="heading">
        <h1>MapPlanner</h1>
        </div>

        <div id="state">
          <LocationsDashboard />
          <p>
            zoom level: {this.state.zoom}
            <br />
            Map type: {this.state.maptype}
            <br/>
            Place: {this.state.place_formatted}
            <br/>
            Location: {this.state.place_location}
          </p>
        </div>

        <div id='pac-container'>
          <input id="pac-input" type="text" placeholder="enter a location"/>
        </div>

        <div id='map' />{/*map*/}
      </div>//app
    ); 
  } 
};

class LocationsDashboard extends React.Component {
  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
        {/*
        <EditableLocationList />
        <ToggleableLocationForm 
          isOpen={true}
        />
        */}
        </div>
      </div>
    );
  }
};

class ToggleableLocationForm extends React.Component {
  render() {
    if (this.props.isOpen) {
      return (
        <LocationForm />
      );
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button className='ui basic button icon'>
            <i className='plus icon' />
          </button>
        </div>
      );
    }
  }
}

class EditableLocationList extends React.Component {
  render() {
    return (
      <div id='timers'>
        <EditableLocation
          title='your event here'
          project=''
          elapsed='8986300'
          runningSince={null}
          editFormOpen={false}
        />
        <EditableLocation  
          title=''
          project=''
          elapsed='3890985'
          runningSince={null}
          editFormOpen={true}
        />
      </div>
    );
  }
}

class EditableLocation extends React.Component {
  render() {
    if (this.props.editFormOpen) {
      return (
        <LocationForm
          title={this.props.title}
          project={this.props.project}
        />
      );
    } else {
      return (
        <Location
          title={this.props.title}
          project={this.props.project}
        />
      );
    }
  }
}

class Location extends React.Component {
  render() {
    const elapsedString ="location goes here";
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span className='right floated edit icon'>
              <i className='edit icon' />
            </span>
            <span className='right floated trash icon'>
              <i className='trash icon' />
            </span>
          </div>
        </div>
        <div className='ui bottom attached blue basic button'>
          Start
        </div>
      </div>
    );
  }
}

class LocationForm extends React.Component {
  render() {
    const submitText = this.props.title ? 'Update' : 'Create';
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input type='text' defaultValue={this.props.title} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' defaultValue={this.props.project} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button className='ui basic blue button'>
                {submitText}
              </button>
              <button className='ui basic red button'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
