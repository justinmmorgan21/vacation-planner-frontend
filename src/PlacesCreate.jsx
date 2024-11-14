import axios from 'axios'
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button, Textarea, Label, TextInput, Datepicker } from "flowbite-react";
import { AiFillEnvironment } from "react-icons/ai";
export function PlacesCreate({onClose, trip}) {
  
  const navigate = useNavigate();

  const startDateContainerRef = useRef(null);
  const endDateContainerRef = useRef(null);

  // Function to adjust datepicker position, DOES NOT WORK
  const adjustDatepickerPosition = (container) => {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      container.classList.add('datepicker-up');
    } else {
      container.classList.remove('datepicker-up');
    }
  };

  // Use effect to adjust position when the component mounts
  useEffect(() => {
    if (startDateContainerRef.current) {
      adjustDatepickerPosition(startDateContainerRef.current);
    }
    if (endDateContainerRef.current) {
      adjustDatepickerPosition(endDateContainerRef.current);
    }
  }, []);

  const handleCreate = (event, trip_id) => {
    event.preventDefault();
    const params = new FormData(event.target);
    params.append('trip_id', trip_id);
    axios.post("http://localhost:3000/places.json", params).then(response=> {
      console.log(response.data);
      navigate(`/trips/${trip_id}`)
      onClose();
    });
  }

  return (
    <div className='w-full border-0 border-blue-700'>
      <h1 className='text-xl'>New Place</h1>
      <hr className='my-4'/> 
      <form className="flex flex-col gap-4 items-center w-full border-0 border-red-600" onSubmit={(event) => handleCreate(event, trip.id)}>
        <div className='mx-auto border-0'>

        <div>
          <div className="mb-2 block w-80">
            <Label htmlFor="name" value="Name" />
          </div>
          <TextInput id="name" name="name" type="text" placeholder="name" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="Address" />
          </div>
          <TextInput icon={AiFillEnvironment} id="address" name="address" type="text" placeholder="address" shadow required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="start_time" value="Date" />
          </div>
          <div ref={startDateContainerRef}>
            <Datepicker title="Date" name="start_time" />
          </div>
          {/* <div ref={endDateContainerRef}>
            <Datepicker title="Depart" name="end_time" />
          </div> */}
        </div>
        <div className="max-w-md">
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description of this place" />
          </div>
          <Textarea id="description" name="description" placeholder="description..." shadow required rows={2} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="image_url" value="URL of place image" />
          </div>
          <TextInput id="image_url" name="image_url" type="text" placeholder="http://" shadow required />
        </div>
        <div className=' flex flex-row space-x-2'>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" type="submit">Submit</Button>
          <Button className="bg-blue-500 px-2 py-0 rounded-md text-white my-12 w-1/2" onClick={()=>onClose()}>Cancel</Button>
        </div>
        </div>
      </form>
    </div>
  );
}