import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet'
import { useState, useEffect } from "react";
import L from 'leaflet'
import React from 'react';

const position = [47, 3]

const Icon1 = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [20, 30],
  iconAnchor: [8, 30],
  popupAnchor: [1, -34],
  shadowSize: [10, 30]
});

const Icon2 = new L.Icon({
iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
shadowSize: [41, 41]
});

function pointToLayer(feature, latlng)  {
return L.marker(latlng, {
  icon: choix_icone(feature.properties.icone)
});
}

function choix_icone(choix) {
  if (choix == "Icon1") {
    return Icon1
  }
  else {
    return Icon2
  }

}

function onEachFeature(feature, layer) {
  if (feature.properties) {
      layer.bindPopup(feature.properties.stop_name);
  }
}

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data:''
    };
  }

  componentDidMount() {
    this.fetchGares(this.props.filter);
  }

  // setState() can't be called in componentDidUpdate()
  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter) {
      console.log("ici")
      this.fetchGares(this.props.filter);
    }
    
  }

  fetchGares(filtre) {
    console.log(encodeURIComponent(filtre))
    this.setState({
      data: "",
    });
    fetch(`data/gares_accessibles/${encodeURIComponent(filtre)}.json`)
    . then(res => res.json())
     .then(json => {
          console.log(json)
          this.setState({
            data: json,
          });
      })
      .catch(err => console.error(err));
    console.log("l")
    console.log(this.state.data)
  }
  render() {
  return (
    <MapContainer center={position} zoom={6}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON key={this.state.data} data={this.state.data} onEachFeature={onEachFeature} pointToLayer={pointToLayer}/>
    </MapContainer>
  )
}
}

export default Maps;