import { AdvancedMarker, APIProvider, Map, useMap, Pin } from "@vis.gl/react-google-maps";
import {useLoaderData} from "react-router-dom";
import { useState, useCallback, useEffect } from 'react';
import { Modal } from "./Modal";
import { PlacesCreate } from "./PlacesCreate";
import { Accordion } from "flowbite-react";
import FlightHotelSearch from "./components/FlightHotelSearch";
import axios from "axios";
import { UpdateTrip } from "./components/UpdateTrip";
export function TripsShowPage() {
  const trip = useLoaderData();

  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

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

  return (
    <div className="flex flex-col border-0 border-black">
      <div className='mt-2 p-2 mx-auto w-4/5 bg-white border-0 rounded-lg border-gray-500'>
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
                  <p className="my-2 text-lg text-gray-700">Dates:  {trip.start_time || "No Date Set"} {` to `} {trip.end_time || "No Date Set"}</p>
                  :
                  <p>No Date Set</p>
                }
              </div>
              <button className="bg-blue-700 px-4 h-8 mt-2 rounded text-white" onClick={()=>handleTripUpdateModalShow()}>Edit Trip</button>
            </div>
          </div>
          <hr className="mx-4 -my-2"/>
          <h2 className="mt-6 ml-4 text-lg text-gray-700">Itinerary:</h2>
          <br />
          <Accordion collapseAll className="w-full shadow-lg">
            {trip.places.map((place, i) => (
              <Accordion.Panel key={place.id}>
                <Accordion.Title className="flex flex-row bg-white">
                  <span className="pr-4">
                    {locations[i].key}.
                  </span>
                  <span className="pr-16 font-bold text-gray-700">
                    {place.name}  
                  </span>
                  <span className="">
                    { place.start_time ? place.start_time : "No Date Set" }
                  </span>
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
          <button className="bg-blue-700 ml-4 px-4 py-1 rounded text-white my-12" onClick={()=>handlePlacesCreateModalShow()}>Add a Place to your Itinerary</button>
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