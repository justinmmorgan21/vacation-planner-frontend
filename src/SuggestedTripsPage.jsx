import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { AddSuggestedTrip } from "./components/AddSuggestedTrip";
import { MdFmdGood } from "react-icons/md";
import { Button, Tooltip } from "flowbite-react";


export function SuggestedTripsPage() {
  const suggestedTrips = useLoaderData();
  
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);

  const handleClose = () => {
    setModalVisible(false);
  }

  // const handleModalShow = () => {
  //   setModalVisible(true);
  // }
  // const handleClose = () => {
  //   setModalVisible(false);
  // }

  return (
    <div className="mx-auto border-0">
      {/* <div className="h-80 w-full border-2 border-gray-400 rounded-lg p-4 shadow-md"> */}
      <br />
        <p className="text-4xl pb-2">Suggested Trips</p>
        <hr className="my-6"/>
        <div className="grid grid-cols-2 gap-6">
          {suggestedTrips.map(trip => (
            // one card
            <div key={trip.id} className="border-2 shadow-md w-full p-4 flex flex-col rounded-md">
              <div className="text-2xl pb-2">
                {trip.title}
              </div>
              <div className="flex flex-row space-x-2 flex-grow border-0 mb-4">
                <div className="max-w-64 min-w-56 max-h-48">
                  <img src={trip.image_url} className="max-h-full"></img>
                </div>
                <div>
                  Points of Interest:
                  {trip.places.map(place => (
                    <div key={place.id} className="flex flex-row py-1" >
                      <div className="pt-1 pr-1">
                        <MdFmdGood />
                      </div>
                      <div className="flex flex-col">
                        <div>
                          {place.name}
                        </div>
                        <div className="text-xs">
                          {place.description.length < 105 ?
                            place.description
                              : 
                            <Tooltip content={place.description} placement="top" style="dark" className="max-w-screen-md">
                              {place.description.slice(0,105)}...
                            </Tooltip>
                          }                          
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-end flex-end">
                <Button className="bg-blue-500 -px-4 -py-1 rounded-md text-white" type="button" onClick={() => { setModalVisible(true); setCurrentTrip(trip)}}>Add to Trips</Button>
              </div>
            </div>
          ))}
          </div>
          <Modal onClose={handleClose} show={modalVisible}>
            {currentTrip && <AddSuggestedTrip onClose={handleClose} trip={currentTrip}/>}
          </Modal>
        {/* </div> */}
    </div>
  );
}