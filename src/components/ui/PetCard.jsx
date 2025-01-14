import React from 'react';
import { Button } from './button';
import { MdOutlinePets } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";



const PetCard = ({pet}) => {
    const {pet_age,pet_image,pet_location,pet_name} = pet
    return (
        <div className='rounded-[50px] overflow-hidden shadow-secondary shadow-xl'>
            <img src={pet_image} alt="" className='w-full h-72 object-cover' />
            <div className='p-5'>
                <h1 className='text-lg font-semibold'>{pet_name}</h1>
                 <div className='flex justify-between pb-3 pt-2'>
                 <h1 className='flex items-center gap-2'><MdOutlinePets />{pet_age}</h1>
                 <h1 className='flex items-center gap-2'><FaLocationDot />{pet_location}</h1>
                 </div>
                <Button>View Details</Button>
            </div>
        </div>
    );
};

export default PetCard;