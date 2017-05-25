import React, { Component } from 'react';

export default class Map extends Component {

	componentDidMount(){
		if(this.props.observations){
		//basado en http://jsfiddle.net/6RS2z/356/
		let vectorSource = new ol.source.Vector({
					//create empty vector
				});
				this.props.observations.map((obs) => {
							let lat = Number(obs.latitude);
							let lon = Number(obs.longitude);
							let iconFeature = new ol.Feature({
								geometry: new
									ol.geom.Point(ol.proj.transform([lon, lat], 'EPSG:4326',   'EPSG:3857')),
							name: obs.place_guess,
							population: 4000,
							rainfall: 500
							});
							vectorSource.addFeature(iconFeature);

						});

					//create the style
					let iconStyle = new ol.style.Style({
						image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
							anchor: [0.5, 46],
							anchorXUnits: 'fraction',
							anchorYUnits: 'pixels',
							opacity: 0.75,
							src: './imgs/icon.png'
						}))
						});

					//add the feature vector to the layer vector, and apply a style to whole layer
						var vectorLayer = new ol.layer.Vector({
							source: vectorSource,
							style: iconStyle
						});

		let map = new ol.Map({
													layers: [
														new ol.layer.Tile({
															source: new ol.source.OSM()
														}), vectorLayer
													],
													target: document.getElementById('map'),
													view: new ol.View({
														center: [0, 0],
														zoom: 0
													})
												});

		// map.setCenter (lonLat, zoom);
		}
	}
	
	render() {
		// if (document.getElementById('map'))
		// document.getElementById('map').innerHTML = '';
		if(this.props.observations){
			return (

				<div className="col-xs-12 observation">
					<h4>Observations Map:</h4>
					<div id="map">

					</div>
				</div>
			);
		}else{
			return (
				<div >

				</div>
			);
		}

	}
}
