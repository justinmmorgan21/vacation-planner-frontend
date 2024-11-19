import { AdvancedMarker, APIProvider, Map, useMap, Pin } from "@vis.gl/react-google-maps";
import {useLoaderData, useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion, Datepicker } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
import axios from "axios";
import { UpdateTrip } from "./components/UpdateTrip";
import { RiDeleteBin5Fill } from "react-icons/ri"
import { PlacesUpdate } from "./PlacesUpdate";
// import { MdDeleteForever } from "react-icons/md";
// import { TiDelete } from "react-icons/ti";
export function TripsShowPage() {
  const trip = useLoaderData();
  const [selectedDate, setSelectedDate] = useState(new Date(trip.start_time));
  const [editDate, setEditDate] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);

  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const navigate = useNavigate();

  const fetchDefaultCenter = useCallback(() => {
    axios.get("http://127.0.0.1:3001/google-places-autocomplete", {
      params: {
        input: trip.title,
      },
    }).then(response=> {
      axios.get("http://127.0.0.1:3001/google-places-details", {
        params: {
          place_id: response.data.predictions[0].place_id,
        },
      }).then(resp => {
        setCoords(resp.data.result.geometry.location)
      })
    });
  }, [trip]);

  useEffect(() => {
    if (trip.places.length === 0) {
      fetchDefaultCenter();
    }
  }, [trip.places, fetchDefaultCenter]);

  const locations = trip.places.map((place, i) => {
    return {key: String.fromCharCode(65+i), location: { lat: place.lat, lng: place.lng } }
  })
  
  const [placesCreateModalVisible, setPlacesCreateModalVisible] = useState(false);
  const handlePlacesCreateModalShow = () => {
    setPlacesCreateModalVisible(true);
  }
  const handlePlacesCreateClose = () => {
    setPlacesCreateModalVisible(false);
  }

  const [tripUpdateModalVisible, setTripUpdateModalVisible] = useState(false);
  const handleTripUpdateModalShow = () => {
    setTripUpdateModalVisible(true);
  }
  const handleTripUpdateClose = () => {
    setTripUpdateModalVisible(false);
  }
  
  const [placeUpdateModalVisible, setPlaceUpdateModalVisible] = useState(false);
  const handlePlaceUpdateModalShow = (place) => {
    setPlaceToEdit(place)
    setPlaceUpdateModalVisible(true);
  }
  const handlePlaceUpdateClose = () => {
    setPlaceUpdateModalVisible(false);
  }

  const handleDeletePlace = (place) => {
    console.log(place);
    axios.delete(`http://localhost:3000/places/${place.id}.json`).then(response => {
      console.log(response.data);
      navigate(`/trips/${trip.id}`);
    })
  }

  const PoiMarkers = ({ pois }) => {
    const map = useMap();
    const handleClick = useCallback((ev) => {
      if (!map) return;
      if (!ev.latLng) return;
      console.log('marker clicked:', ev.latLng.toString());
      map.panTo(ev.latLng);
    })
  
    return (
      <>
        {pois.map((poi) => (
          <AdvancedMarker
            key={poi.key}
            title={poi.key}
            position={poi.location}
            clickable={true}
            onClick={handleClick}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} glyph={poi.key} borderColor={'#000'} />
          </AdvancedMarker>
        ))}
      </>
    )
  }

  // const PlaceDate = ({ place }) => {
  //   // const map = useMap();
  //   // const handleClick = useCallback((ev) => {
  //   //   if (!map) return;
  //   //   if (!ev.latLng) return;
  //   //   console.log('marker clicked:', ev.latLng.toString());
  //   //   map.panTo(ev.latLng);
  //   // })
  //   console.log(place);
  //   return (
  //     <>
  //       {
  //         editDate ? 
  //           <div className="absolute left-1/3 top-4/5">
  //             <Datepicker id="date-picker" title="Date" name="start_time" value={new Date(place.start_time)} onChange={(date) => setSelectedDate(date)} datepicker-buttons="true"/>
  //           </div>
  //           :
  //           <></>
  //       }
  //       {/* {pois.map((poi) => (
  //         <AdvancedMarker
  //           key={poi.key}
  //           title={poi.key}
  //           position={poi.location}
  //           clickable={true}
  //           onClick={handleClick}
  //         >
  //           <Pin background={'#FBBC04'} glyphColor={'#000'} glyph={poi.key} borderColor={'#000'} />
  //         </AdvancedMarker>
  //       ))} */}
  //     </>
  //   )
  // }

  const toggleDate = () => {setEditDate(!editDate); console.log(editDate)}

  return (
    <div className="flex flex-col border-0 border-black">
      <div className=' p-2 mx-auto w-4/5 bg-white border-0 rounded-lg border-gray-500'>
        <FlightHotelSearch destinationTitle={trip.title} />
      </div>
      <div className="mx-auto w-4/5 items-center border-0 border-green-600 pt-1">
        <a className="underline text-white" href="/trips">{'<'}- back to Upcoming Trips</a>
        <h1 className="text-4xl my-8 text-white">{trip.title}</h1>
        <div className="bg-white w-full">
          <div className="bg-white p-4 w-fit">
            <div className="flex flex-row w-full space-x-6">
              <img className="h-80" src={trip.image_url} />
              <div className="w-96 h-80">
                <APIProvider apiKey={import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded')}>
                  <Map
                    defaultZoom={trip.places.length != 0 ? trip.initial_zoom : 10}
                    defaultCenter={ 
                      { lat: trip.center[0] , lng: trip.center[1] }}
                      mapId='97aaa7a8b424bee5'
                      onCameraChanged={(ev) =>
                        console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                      }
                      center = {trip.places.length != 0 ?
                        { lat: trip.center[0] , lng: trip.center[1] } : coords}
                        >
                    <PoiMarkers pois={locations} />
                  </Map>
                </APIProvider>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-2">
              <div className="mt-1">
                {trip.start_time ? 
                  <p className="my-2 text-lg text-gray-700">Dates:  
                    {` ${trip.start_time.slice(0,3)+' '+trip.start_time.slice(trip.start_time.indexOf(' '))} to 
                        ${trip.end_time.slice(0,3)+' '+trip.end_time.slice(trip.end_time.indexOf(' '))}`}
                  </p>
                  :
                  <p>No Date Set</p>
                }
              </div>
              <button className="bg-blue-700 px-4 h-8 mt-2 rounded text-white" onClick={()=>handleTripUpdateModalShow()}>Edit Trip</button>
            </div>
          </div>
          <hr className="mx-4 -my-2"/>
          <h2 className="mt-8 ml-4 text-lg text-gray-700">Itinerary</h2>
          <br />
          <div className="mx-4">

{/* 
          <div >
            <Datepicker id="date-picker" title="Date" name="start_time" value={selectedDate} onChange={(date) => setSelectedDate(date)} datepicker-buttons="true"/>
          </div>
          const [selectedDate, setSelectedDate] = useState(new Date(trip.start_time)); */}


          <Accordion collapseAll openAll className="w-full shadow-md rounded-md">
            {trip.places.map((place, i) => (
              <Accordion.Panel open key={place.id}>
                <Accordion.Title className="border-0 border-red-500">
                  <div className="flex flex-row border-0 w-[950px] border-green-500">
                    <span className="pr-4">
                      {locations[i].key}.
                    </span>
                    <span className="font-bold text-gray-700 w-1/3">
                      {place.name}  
                    </span>
                    <div  className="flex-auto flex flex-row ">
                      <span className="text-gray-700">
                        { place.start_time ? place.start_time : "No Date Set" }
                      </span>
                      <button className="rounded-3xl px-2 mx-3 border-2 border-gray-300 bg-gray-200 text-black text-sm font-light -px-24  flex-initial" onClick={()=>handlePlaceUpdateModalShow(place)}>change</button>
                    </div>
                    <button className="text-gray-700 flex-initial mr-4" onClick={()=>handleDeletePlace(place)}><RiDeleteBin5Fill /></button>
                  </div>
                  <Modal onClose={handlePlaceUpdateClose} show={placeUpdateModalVisible}>
                    <PlacesUpdate onClose={handlePlaceUpdateClose} place={placeToEdit} trip={trip}/>
                  </Modal>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="flex flex-row bg-white">
                    <img className="w-36 mr-16" src={place.image_url} alt="" />
                    <div>
                      <p className="mb-2 text-gray-500 dark:text-gray-400">
                        {place.address}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {place.description}
                      </p>
                    </div>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
            </div>
          <button className="bg-blue-700 ml-4 px-4 py-1 rounded text-white mt-4 mb-12" onClick={()=>handlePlacesCreateModalShow()}>Add a Point of Interest</button>
        </div>
        <Modal onClose={handlePlacesCreateClose} show={placesCreateModalVisible}>
          <PlacesCreate onClose={handlePlacesCreateClose} trip={trip}/>
        </Modal>
        <Modal onClose={handleTripUpdateClose} show={tripUpdateModalVisible}>
          <UpdateTrip onClose={handleTripUpdateClose} trip={trip}/>
        </Modal>
      </div>
    </div>
  );
}