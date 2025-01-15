import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { RiApps2AddFill } from "react-icons/ri";
import { FaCat } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { IoAccessibility } from "react-icons/io5";
import { BiSolidDonateHeart } from "react-icons/bi";
import { FaDonate } from "react-icons/fa";
import { MdCampaign } from "react-icons/md";



const Dashboard = () => {
    return (
        <div id='dashboard' className='flex h-screen absolute w-full top-0'>
            <div className='w-2/12 h-full pt-16 bg-secondary'>
            <h1 className='text-xl px-5 font-semibold'>Dashboard</h1>
             <div className='pt-5 w-full flex gap-1 flex-col'>
             <NavLink to='/dashboard/home' className='dashboard-list'><GoHomeFill className='text-lg'/>Home</NavLink>

             <NavLink to='/dashboard/add-pet' className='dashboard-list'><RiApps2AddFill className='text-lg'/>Add a Pet</NavLink>

             <NavLink to='/dashboard/my-pets' className='dashboard-list'><FaCat className='text-lg'/>My Pets</NavLink>

             <NavLink to='/dashboard/adoption-requests' className='dashboard-list'><IoAccessibility className='text-lg'/>Adoption Requests</NavLink>

             <NavLink to='/dashboard/create-campaign' className='dashboard-list'><BiSolidDonateHeart className='text-lg'/>Create Campaign</NavLink>

             <NavLink to='/dashboard/my-campaign' className='dashboard-list'><MdCampaign className='text-lg'/>My Campaigns</NavLink>

             <NavLink to='/dashboard/my-donations' className='dashboard-list'><FaDonate className='text-lg'/>My Donations</NavLink>
             </div>
            </div>
            <div className='flex-1 pt-16 px-5'>

            <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;