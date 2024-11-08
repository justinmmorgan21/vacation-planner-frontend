import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Modal } from "./Modal";
import { TripsCreateModal } from "./TripsCreateModal";

export function TripsIndexPage() {
  const trips = useLoaderData();
  
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);

  const handleTripsShow = (trip) => {
    console.log("handleTripsShow", trip);
    navigate(`/trips/${trip.id}`);
  };

  const handleModalShow = () => {
    setModalVisible(true);
  }
  const handleClose = () => {
    setModalVisible(false);
  }

  return (
    <div>
      <br />
      <h1>Your Upcoming Trips</h1>
      <hr />
      {trips.map((trip) => (
        <div key={trip.id}>
          <h2>{trip.title}</h2>
          <img src={trip.image_url} />
          <p>{trip.start_time} -- {trip.end_time}</p>
          <button onClick={() => handleTripsShow(trip)}>More info</button>
        </div>
      ))}
      <br /><br />
      <button onClick={()=>handleModalShow()}>Add Trip</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <TripsCreateModal onClose={handleClose}/>
      </Modal>
    </div>
  );
}