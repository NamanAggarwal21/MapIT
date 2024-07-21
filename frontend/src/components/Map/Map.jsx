import React, { useEffect, useState ,useMemo , useCallback} from 'react'
import { MapContainer, TileLayer , Marker ,Popup, useMapEvents ,Rectangle } from 'react-leaflet';
import { useEventHandlers } from '@react-leaflet/core'
import { useMap } from 'react-leaflet/hooks'
import {useNavigate} from 'react-router-dom'
import {Icon} from 'leaflet'
import StarIcon from '@mui/icons-material/Star';
import './Map.css';
import "leaflet/dist/leaflet.css";
import axios from 'axios'
import TimeAgo from 'react-timeago'
import {assets} from '../../assets/assets'
import NearMe from '@mui/icons-material/NearMe';



const Map = ({currentUser , pins , setPins}) => {

  const url = "http://localhost:8800";
  
  const [newPlace , setNewPlace] = useState(null);
  
  

  const [title , setTitle] = useState(null);
  const [rating , setRating] = useState(0);
  const [desc , setDesc] = useState(null);

  const [center , setCenter] = useState([28.695091258622988,77.21768617630006]);
  // _________________________________________________________________________________________________________
  
  function LocationMarker() {
    const [position, setPosition] = useState(null);
    setNewPlace(null);
    const map = useMapEvents({
      dblclick() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
        
      },
      
      
    })
  
    return position === null ? null : (
      <Marker position={position} icon={new Icon({
              iconUrl : assets.locateMe,
              iconSize: [36,36],
        }) }>
        <Popup>You are here</Popup>
      </Marker>
    )
  }
  
 
  // _____________________________________________________________________________________________

  function DetectDoubleClick(){
    const navigate = useNavigate();
    useMapEvents({
      dblclick:(e) =>{
        navigate(`addcity?lat=${e.latlng.lat}&long=${e.latlng.lng}`);
        const lat = e.latlng.lat;
        const long = e.latlng.lng;
        setNewPlace({
          lat:lat,
          long:long
        })
        console.log(newPlace);
      }
    })
  }
 
  useEffect(()=>{

    const getPins = async()=>{
      try {
        const res = await axios.get(`${url}/api/pins`);
        setPins(res.data); 
      } 
      catch (error) {
        console.log(error.message);
        console.log(error);
      }
    }
    getPins();

  },[])

  const handleSubmit = async (e) =>{
      e.preventDefault();
      const newPin = {
        username:currentUser,
        title:title,
        desc:desc,
        rating:rating,
        lat: newPlace.lat,
        long: newPlace.long,
      }

      try {
        const res = await axios.post(`${url}/api/pins` , newPin);
        setPins([...pins,res.data]);
        setNewPlace(null)
      } 
      catch (error) {
        console.log(error.message);
      }
    }

  const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
  }
  
  const BOUNDS_STYLE = { weight: 1 }
  
  function MinimapBounds({ parentMap, zoom }) {
    const minimap = useMap()
  
    // Clicking a point on the minimap sets the parent's map center
    const onClick = useCallback(
      (e) => {
        parentMap.setView(e.latlng, parentMap.getZoom())
      },
      [parentMap],
    )
    useMapEvents('click', onClick)
  
    // Keep track of bounds in state to trigger renders
    const [bounds, setBounds] = useState(parentMap.getBounds())
    const onChange = useCallback(() => {
      setBounds(parentMap.getBounds())
      // Update the minimap's view to match the parent map's center and zoom
      minimap.setView(parentMap.getCenter(), zoom)
    }, [minimap, parentMap, zoom])
  
    // Listen to events on the parent map
    const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
    useEventHandlers({ instance: parentMap }, handlers)
  
    return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
  }
  
  function MinimapControl({ position }) {
    const parentMap = useMap()
    const mapZoom = 10
    const minimap = useMemo(
      () => (
        <MapContainer
          style={{ height: 80, width: 80 }}
          center={parentMap.getCenter()}
          zoom={mapZoom}
          dragging={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          attributionControl={false}
          zoomControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
        </MapContainer>
      ),
      [],
    )
  
    const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright
    return (
      <div className={positionClass}>
        <div className="leaflet-control leaflet-bar">{minimap}</div>
      </div>
    )
  }


  return (
    <div >
        
        
        <MapContainer center={center} zoom={5} scrollWheelZoom={true} className='map' >
                
                
                {
                  currentUser == null ? <LocationMarker/> : <DetectDoubleClick/>
                }
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png "
                />
              
                <MinimapControl/>

                {
                  pins.map( (p) =>(
                    <>
                    <Marker position={[p.lat,p.long]} icon={p.username === currentUser ? 
                          new Icon({
                            iconUrl : assets.greenMarker,
                            shadowUrl: '',
                            iconSize: [31,31],
                            
                          }) :  
                          new Icon({
                            iconUrl : assets.redMarker,
                            shadowUrl: '',
                            iconSize: [29,29],
                            
                          })
                      }>
                        
                      
                      <Popup>
                        
                        <div className='card'>
                          <label>Place</label>
                          <h3 className='place'>{p.title}</h3>
                          <label >Review</label>
                          <p className='desc'>{p.desc}</p>
                          <label >Rating</label>

                          <div className='stars' >
                            {Array(p.rating).fill(<StarIcon className='star'/>)}
                          </div>

                          <label> Information</label>
                          <span className="username">Created By: <b>{p.username}</b></span>
                          <span  className='date'>
                            {
                              <TimeAgo date={p.createdAt} formatter={(value, unit, suffix) => {
                                if (value < 1 && unit === "second") {
                                  return "just now";
                                } else {
                                  return value + " " + unit + (value > 1 ? "s" : "") + " " + suffix;
                                }
                              }} />
                            
                            }
                          </span>
                        </div>
                      </Popup> 
                    </Marker>
                    </>
                  ))
                }

              { newPlace && (
                <Marker position={[newPlace.lat,newPlace.long]} >
                  <Popup >
                      <div>
                        <form onSubmit={handleSubmit}>
                          <label >Title</label>
                          <input type="text" placeholder='Enter A Title' onChange={(e) => setTitle(e.target.value)}/>
                          <label >Review</label>
                          <textarea placeholder='Say something about this place' onChange={(e) => setDesc(e.target.value)}/>
                          <label >Rating</label>
                          <select onChange={(e) => setRating(e.target.value)}>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                          </select>
                          <button className='submitButton' type='submit'>Add Pin</button>
                        </form>
                      </div>
                  </Popup>
                </Marker>
              )}

             
             
      </MapContainer>
    </div>
    
  )
}

export default Map
