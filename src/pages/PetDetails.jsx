import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { AssetContext } from "@/auth/ContextApi";
import { useForm } from "react-hook-form";
import { ImSpinner3 } from "react-icons/im";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
const PetDetails = () => {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AssetContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { toast } = useToast();
  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ["pet"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/pet/${id}`);
      return res.data;
    },
  });

  const {
    data: isRequested = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["isRequested"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/isRequested?petId=${id}`
      );
      return res.data;
    },
  });
  console.log(isRequested)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [spin, setSpin] = useState(false);
  const onSubmit = async (data) => {
    setSpin(true);
    const { email, location, name, number } = data;
    const requestModule = {
      requesterEmail: email,
      requesterLocation: location,
      requesterName: name,
      requesterNumber: number,
      petId: id,
      author: pet?.author,
      status: 'pending'
    };
    const res = await axiosSecure.post(
      `/request?email=${email}`,
      requestModule
    );
    if (res.data.insertedId) {
      reset();
      setSpin(false);
      refetch();
      setIsOpenForm(false);
      toast({
        title: "Adoption request sent!",
        description:
          "Your adoption request has been sent successfully. We’ll notify you once the pet’s owner reviews and approves your request.",
      });
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);

  const handlePetApotion = () => {
    if (user) {
      setIsOpenForm(true);
      return;
    }

    setIsOpen(true);
  };

  const handleContinue = () => {
    navigate("/login");
  };
  console.log(isRequested);
  return (
    <div className="w-11/12 mx-auto pt-5">
      <div className="flex gap-10">
        {petLoading ? (
          <Skeleton className="w-2/4 h-[500px] rounded-3xl"></Skeleton>
        ) : (
          <img
            className="w-2/4 h-[500px] object-cover rounded-3xl"
            src={pet?.pet_image}
            alt="pet image"
          />
        )}

        <div className="flex-1">
          {petLoading ? (
            <div className="w-full space-y-3 pb-5">
              <Skeleton className="w-52 h-8"></Skeleton>
              <Skeleton className="w-36 h-5"></Skeleton>
              <Skeleton className="w-64 h-4"></Skeleton>
              <Skeleton className="w-72 h-3"></Skeleton>
              <Skeleton className="w-72 h-3"></Skeleton>
              <Skeleton className="w-72 h-3"></Skeleton>
              <Skeleton className="w-72 h-3"></Skeleton>
              <Skeleton className="w-24 h-5"></Skeleton>
              <Skeleton className="w-24 h-5 "></Skeleton>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">
                My name is {pet?.pet_name}!
              </h1>
              <p className="flex items-center gap-2 py-2 font-medium">
                <FaLocationDot />
                {pet?.pet_location}
              </p>
              <p className="font-medium">{pet?.short_description}</p>
              <p className="py-3">{pet?.long_description}</p>
              <p className=" py-2 font-medium">Age: {pet?.pet_age}</p>
              <p className="font-medium pb-5">Category: {pet?.pet_category}</p>
            </div>
          )}


          {isLoading? <Skeleton className='w-28 h-8'></Skeleton> : isRequested.status === 'pending' ?<Button disabled>Requested</Button> :<Button onClick={handlePetApotion}>Adopt</Button>
          }

        </div>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Restricted</AlertDialogTitle>
            <AlertDialogDescription>
              You need to log in to proceed. Please sign in to access this
              feature.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue}>
              Go to Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adoption Request</DialogTitle>
            <DialogDescription>
              Submit your request and take the first step toward a forever
              friendship.
            </DialogDescription>
          </DialogHeader>
          <div className="flex text-sm gap-6">
            <img
              className="w-2/4 object-cover max:h-52 rounded-3xl"
              src={pet?.pet_image}
              alt=""
            />
            <div className="flex-1">
              <h1 className="font-medium grid grid-cols-2 pb-1 w-full">
                <span>Name:</span> {pet?.pet_name}
              </h1>
              <h1 className="font-medium grid grid-cols-2 pb-1 w-full">
                <span>Age:</span> {pet?.pet_age}
              </h1>
              <h1 className="font-medium grid grid-cols-2 pb-1 w-full">
                <span>Category:</span> {pet?.pet_category}
              </h1>
              <h1 className="font-medium pb-1">
                <span>Pet ID:</span> {pet?._id}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" space-y-3 text-left gap-4 py-4">
              <h1 className="font-semibold pb-2">Add your Information</h1>
              <div className="flex  justify-between items-center  w-full  gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  disabled
                  defaultValue={user?.displayName}
                  className="w-10/12"
                />
              </div>
              <div className="flex justify-between items-center  w-full  gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  {...register("email")}
                  disabled
                  defaultValue={user?.email}
                  className="w-10/12"
                />
              </div>
              <div className="flex justify-between items-center  w-full  gap-4">
                <Label htmlFor="number" className="text-right">
                  Phone
                </Label>
                <div className="w-10/12">
                  <Input
                    id="number"
                    type="number"
                    {...register("number", {
                      required: "Number is required",
                      min: { value: 1, message: "Number must be at least 1" },
                    })}
                    placeholder="Enter your number"
                    className=""
                  />
                  {errors.number && (
                    <p className="text-xs text-red-600 px-2">
                      {errors.number.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center  w-full  gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <div className="w-10/12">
                  <Input
                    {...register("location", {
                      required: "Location is required",
                      minLength: {
                        value: 3,
                        message: "Location must be at least 3 characters long",
                      },
                      maxLength: {
                        value: 50,
                        message: "Location must not exceed 50 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z\s,]+$/,
                        message:
                          "Location must contain only letters, spaces, or commas",
                      },
                    })}
                    id="location"
                    placeholder="Your location"
                    className=""
                  />
                  {errors.location && (
                    <p className="text-xs text-red-600 px-2">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button disabled={spin} className="w-full" type="submit">
                {spin && <ImSpinner3 className="animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetDetails;
