import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flight } from './components/Flight';
import axios from 'axios';
// import { Spinner } from "flowbite-react";
export function FlightResult() {

  const location = useLocation();
  const data = location.state;
  console.log("FLIGHT SEARCH:", data);
  const navigate = useNavigate();
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [departSet, setDepartSet] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleFlightSelect = (flight) => {
    if (!departSet) {
      setDepartureFlight(flight);
      console.log("DEPARTURE TOKEN", flight.departure_token)
      setSearching(true);
      axios.get("http://localhost:3001/search-flights", {
        params: {
          engine: data.search_parameters.engine,
          departure_id: data.search_parameters.departure_id,
          arrival_id: data.search_parameters.arrival_id,
          outbound_date: data.search_parameters.outbound_date,
          return_date: data.search_parameters.return_date,
          departure_token: flight.departure_token
        },
      }).then(response => {
        console.log("Returning Flights: ", response.data);
        setDepartSet(true);
        navigate("/flights", { state: response.data });
      }).finally(() => {
        setSearching(false);
      });
    } else {
      setReturnFlight(flight);
      console.log("BOOKING TOKEN", flight.booking_token)
      setSearching(true);
      axios.get("http://localhost:3001/search-flights", {
        params: {
          engine: data.search_parameters.engine,
          departure_id: data.search_parameters.departure_id,
          arrival_id: data.search_parameters.arrival_id,
          outbound_date: data.search_parameters.outbound_date,
          return_date: data.search_parameters.return_date,
          booking_token: flight.booking_token
        },
      }).then(response => {
        console.log(response.data);
        navigate("/selected_flight", { state: { ...response.data, departureFlight, returnFlight } });
      }).finally(() => {
        setSearching(false);
      });
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <br />
      <div className="flex flex-row mb-6">
        <h1 className="text-white text-4xl">Flight Search Results</h1>
      </div>
      <hr className="mb-6"/>
      <div className="grid grid-cols space-y-4 border-0 border-purple-700 " >
        <div >
          <p className='mx-48 text-white mb-1' hidden={departSet}>Departing flights</p>
          <p className='mx-48 text-white mb-1' hidden={!departSet}>Return flights</p>
          {(data.best_flights && data.best_flights || data.other_flights).map((flight, i) => (
            <div key={i}>
              <Flight flight={flight} onFlightSelect={handleFlightSelect} selected={false}/>
            </div>
          ))}
        </div>
      </div>
      
      <br /><br />
      {
        searching ? 
        <div className="overlay">
          <div className="spinner">
            <svg role="status" className="h-8 w-8 animate-spin mr-2 text-gray-200 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </div>
        </div>
         : null
      }

      {/* <button className="bg-blue-500 px-4 py-1 rounded text-white my-12" onClick={()=>handleModalShow()}>Add Trip</button>
      <Modal onClose={handleClose} show={modalVisible}>
        <TripsCreateModal onClose={handleClose}/>
      </Modal> */}
    </div>
  );
}
              // <div className='w-20 opacity-60' hidden={!returnSet}>
              //   <ProgressBar >
              //     <ProgressBar variant="success" now={30} key={1} />
              //     <ProgressBar variant="warning" now={40} key={2} />
              //     <ProgressBar variant="danger" now={30} key={3} />
              //   </ProgressBar> */}
              // </div>