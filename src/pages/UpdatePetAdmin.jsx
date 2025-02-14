import { Button } from "@/components/ui/button";
import { ImSpinner3 } from "react-icons/im";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useEffect, useState } from "react";
import {  useLocation, useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import axios from "axios";
import { AssetContext } from "@/auth/ContextApi";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import AddPetCategory from "@/components/ui/AddPetCategory";
import { Textarea } from "@/components/ui/textarea";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import TinyMCEEditor from "@/components/ui/TinyMCEEditor";
import { Helmet } from "react-helmet-async";

const imageHostingKey = import.meta.env.VITE_API_KEY;
const imageHostingAPI = `https://api.imgbb.com/1/upload?key=${imageHostingKey}`;

const UpdatePetAdmin = () => {
    const { user } = useContext(AssetContext);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imagePreview, setImagePreview] = useState(""); 
    const axioxSecure = useAxiosSecure();
    const { id: petId } = useParams();
    const [content, setContent] = useState('<p>Type something here...</p>');
    const [error, setError] = useState(false)
    const { data: pet, isLoading, refetch } = useQuery({
      queryKey: ["pet", user],
      queryFn: async () => {
        const res = await axioxSecure.get(`/single-pet?id=${petId}&email=${user?.email}`);
        setSelectedCategory(res.data.pet_category);
        setContent(res.data.long_description);
        setImagePreview(res.data.pet_image); 
        return res.data;
      },
    });

 
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file)); 
      }
    };
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();
    const { toast } = useToast();
    const [spin, setSpin] = useState(false);
    const navigate = useNavigate();
    const [selectError, setSelectError] = useState(false);
  
    useEffect(() => {
      if (selectedCategory) {
        setSelectError(false);
      }
    }, [selectedCategory]);
  
    const onSubmit = async (data) => {
      setSpin(true);
  
      if (!selectedCategory) {
        setSpin(false);
        setSelectError(true);
        return;
      }
      if (!content.trim() || content === '<p>Type something here...</p>') {
        setError(true)
        setSpin(false);
        return
      }else{
        setError(false)
      }
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);
      if (!imageFile) {
        const petData = {
            pet_image : pet.pet_image,
            pet_name: data.name,
            pet_age: data.age,
            pet_category: selectedCategory,
            pet_location: data.location,
            short_description: data.shortDescription,
            long_description: content,
            author: user.email,
            added_date: pet.added_date,
            adopted: false,
          };
          axioxSecure.patch(`/update-pet?email=${user.email}&petId=${petId}`, petData).then((res) => {
            if (res.data.modifiedCount) {
              setSpin(false);
              reset();
              refetch()
              toast({
                title: "Pet Updated Successfully!",
                description:
                  "Your pet is successfully uploaded. Now you can manage it from My Pets page.",
              });
              navigate("/dashboard/all-pets");
            }
            else{
              setSpin(false)
              toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: `Change something for update`,
                  action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            }
          });

          return


      }
  
      else{
        try {
            const res = await axios.post(imageHostingAPI, formData);
            const pet_image = res.data.data.display_url;
      
            const petData = {
              pet_image,
              pet_name: data.name,
              pet_age: data.age,
              pet_category: selectedCategory,
              pet_location: data.location,
              short_description: data.shortDescription,
              long_description: content,
              author: user.email,
              added_date: pet.added_date,
              adopted: false,
            };
      
            axioxSecure.patch(`/update-pet?email=${user.email}&petId=${petId}`, petData).then((res) => {
              if (res.data.modifiedCount) {
                setSpin(false);
                reset();
                refetch()
                toast({
                  title: "Pet Updated Successfully!",
                  description:
                    "Your pet is successfully uploaded. Now you can manage it from My Pets page.",
                });
                navigate("/dashboard/all-pets");
              }
            });
          }
           catch (error) {
            setSpin(false);
            reset();
            toast({
              variant: "destructive",
              title: "Please select your pet Image to update",
              description: ``,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
      }
    };
  
    return (
      <div className="w-11/12 mx-auto flex-col flex justify-center items-center md:pt-0 pt-2">
         <Helmet>
        <title>Update Pet | Petopia</title>
      </Helmet>
        {isLoading ? (
          <div className="w-full pt-10 flex gap-3 flex-col items-center">
             <Skeleton className="w-full bg-secondary md:w-1/5 h-10"></Skeleton>
            <Skeleton className="w-full bg-secondary md:w-3/5 h-10"></Skeleton>
            <Skeleton className="w-full bg-secondary md:w-3/5 h-10"></Skeleton>
            <Skeleton className="w-full bg-secondary md:w-3/5 h-10"></Skeleton>
            <Skeleton className="w-full bg-secondary md:w-3/5 h-24"></Skeleton>
            <Skeleton className="w-full bg-secondary md:w-3/5 h-60"></Skeleton>
          </div>
        ) : (
          <Card className="lg:w-3/5 shadow-none border-none">
            <CardHeader className="text-center pt-0 ">
              <CardTitle className="text-xl md:text-2xl font-bold">Update your Pet</CardTitle>
              <CardDescription className='md:text-sm text-xs'>Keep your pet's story alive and thriving.</CardDescription>
            </CardHeader>
  
            <CardContent className='p-0 pb-10 lg:pb-0'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid pb-5 w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name" className='text-xs md:text-sm'>Name</Label>
                    <Input
                      defaultValue={pet?.pet_name}
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters long",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name must not exceed 50 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Name can only contain letters and spaces",
                        },
                      })}
                      className={errors.name ? "border-red-600 text-sm h-max md:text-base" : "text-sm h-max md:text-base"}
                      type="text"
                      placeholder="Enter pet name"
                    />
                    {errors.name && <p className="text-red-600 text-xs md:text-sm">{errors.name.message}</p>}
                  </div>
  
                  <section className="flex w-full justify-between gap-2 md:gap-6">
                    <div className="flex flex-col space-y-1.5 w-2/4">
                      <Label htmlFor="age" className='text-xs md:text-sm'>Age</Label>
                      <Input
                        defaultValue={pet.pet_age}
                        {...register("age", {
                          required: "Age is required",
                          max: {
                            value: 100,
                            message: "Age must be under 100",
                          },
                        })}
                        type="number"
                        placeholder="Enter pet age"
                        className={errors.age ? "border-red-600 text-sm h-max md:text-base" : "text-sm h-max md:text-base"}
                      />
                      {errors.age && <p className="text-red-600 text-xs md:text-sm">{errors.age.message}</p>}
                    </div>
  
                    <div className="flex flex-col space-y-1.5 w-2/4">
                      <Label htmlFor="location" className='text-xs md:text-sm'>Location</Label>
                      <Input
                        defaultValue={pet.pet_location}
                        {...register("location", {
                          required: "Location is required",
                          minLength: {
                            value: 3,
                            message: "Location must be at least 3 characters long",
                          },
                          maxLength: {
                            value: 50,
                            message: "Location must be under 50 characters",
                          },
                          pattern: {
                            value: /^[a-zA-Z\s]*$/,
                            message: "Location can only contain letters and spaces",
                          },
                        })}
                        type="text"
                        placeholder="Your location"
                        className={errors.location ? "border-red-600 text-sm h-max md:text-base" : "text-sm h-max md:text-base"}
                      />
                      {errors.location && <p className="text-red-600 text-xs md:text-sm">{errors.location.message}</p>}
                    </div>
                  </section>
  
                  <section className="flex justify-between gap-2 md:gap-6 ">
                    <div className="w-2/4">
                      <Label htmlFor="category" className='text-xs md:text-sm'>Pet Category</Label>
                      <AddPetCategory
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                      />
                      {selectError && <p className="text-xs md:text-sm text-red-600 pt-1">Please select a category</p>}
                    </div>
  
                    <div className="flex flex-col space-y-1.5 w-2/4">
                      <Label htmlFor="picture" className='text-xs md:text-sm'>Pet Image</Label>
                      <div className="flex items-center gap-1">
                     
                      <Input
                        {...register("image", {
                         
                        })}
                        className={errors.image ? "border-red-600 text-sm h-max md:text-base" : "text-sm h-max md:text-base"}
                        type="file"
                        onChange={handleFileChange}
                      />
                      </div>
                     
                    </div>
                  </section>
  
                  <div>
                    <Label htmlFor="short-desc" className='text-xs md:text-sm'>Short Description</Label>
                    <Textarea
                      defaultValue={pet.short_description}
                      {...register("shortDescription", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters long",
                        },
                        maxLength: {
                          value: 200,
                          message: "Description must be under 200 characters",
                        },
                      })}
                      className={errors.shortDescription ? "border-red-600 text-sm h-max md:text-base" : "text-sm h-max md:text-base"}
                      placeholder="Type something about the pet."
                    />
                    {errors.shortDescription && <p className="text-red-600 text-xs md:text-sm">{errors.shortDescription.message}</p>}
                  </div>
  
                  <div className="text-container">
                    <Label htmlFor="short-desc" className='text-xs md:text-sm'>Long Description (optional)</Label>
                    <p className="text-xs pb-1 opacity-50">Write something if you want to change.</p>
                   <TinyMCEEditor value={content} onChange={(newContent) => setContent(newContent)} error={error}></TinyMCEEditor>
                  </div>
                </div>
                <Button disabled={spin} className='md:text-sm text-xs h-max w-full'>
                  {spin && <ImSpinner3 className="animate-spin" />}Update
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  export default UpdatePetAdmin;
  
