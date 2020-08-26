import React from 'react';
import { Map as LeafletMap, TileLayer} from 'react-leaflet';
import { showDatasOnMap } from './Util'
import './Map.css';


function Map( {countries, casesType, center, zoom} ) {
    return (
        <div className='map-type'>
           <LeafletMap center={center} zoom={zoom}>
               <TileLayer 
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
               />
               {showDatasOnMap(countries, casesType)}
           </LeafletMap>
        </div>
    );
}

export default Map
