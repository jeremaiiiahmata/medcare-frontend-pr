import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useAxios from "../utils/UseAxios";
import AuthContext from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Profile } from "../models/ProfileInterface";
import Swal from "sweetalert2";

const EditProfilePage = () => {
  const authContext = useContext(AuthContext);
  const api = useAxios();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [bio, setBio] = useState("");

  const [profile, setProfile] = useState<Profile>();

  if (!authContext) {
    throw new Error("PrivateRoute must be used within an AuthProvider");
  }

  const { authTokens, user } = authContext;

  if (!authTokens) {
    throw new Error("No tokens");
  } else if (!user) {
    throw new Error("No user");
  }

  const decodedToken = jwtDecode<{ user_id: number }>(authTokens.access);
  const userId = decodedToken.user_id;
  console.log("User ID from token:", userId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const newProfile: Profile = {
          id: userId,
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          specialization: specialization,
          contact_number: contactNumber,
          office_address: officeAddress,
          bio: bio,
        };

        try {
          const response = await api.put("/profile/edit", newProfile);
          console.log(response);

          console.log("Profile has been updated successfully.");
          Swal.fire({
            title: "Profile updated!",
            text: "Profile has been successfully updated.",
            icon: "success",
            confirmButtonColor: "#03624C",
          });

          fetchData();
        } catch (error) {
          console.log(`Error in editing profile : ${error}`);
        }

        Swal.fire("Saved!", "", "success");
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  const fetchData = async () => {
    try {
      const response = await api.get(`/profile`);
      const data = await response.data;
      setProfile(data.data);

      console.log(`${response.status}`);
      console.log(data.data);
    } catch (error) {
      console.log(`Error in fetching profile data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setMiddleName(profile.middle_name || "");
      setLastName(profile.last_name || "");
      setSpecialization(profile.specialization || "");
      setContactNumber(profile.contact_number || "");
      setOfficeAddress(profile.office_address || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-30">
      <div>
        <form
          className="max-w-3xl mx-auto my-8 py-20 sm:p-20 "
          onSubmit={handleSubmit}
        >
          <h3 className="font-semibold text-3xl sm:text-4xl my-5">
            Edit Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.first_name ? profile?.first_name : "First Name"
                }
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.middle_name ? profile?.middle_name : "Middle Name"
                }
                value={middleName}
                onChange={(e) => {
                  setMiddleName(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.last_name ? profile?.last_name : "Last Name"
                }
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.specialization
                    ? profile?.specialization
                    : "Specialization"
                }
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.contact_number
                    ? profile?.contact_number
                    : "Contact Number"
                }
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>

            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={
                  profile?.office_address
                    ? profile?.office_address
                    : "Office Address"
                }
                value={officeAddress}
                onChange={(e) => {
                  setOfficeAddress(e.target.value);
                }}
                className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
              />
            </div>
          </div>

          <div className="py-4">
            <input
              type="text"
              placeholder={profile?.bio ? profile?.bio : "Bio"}
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
              }}
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border outline-[#007bff] rounded transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end">
            <Link to="/dashboard">
              <button
                type="button"
                className="py-2.5 mx-0 sm:mx-1 mt-2 sm:mt-0 w-full sm:w-20 text-center cursor-pointer bg-[#FF6C6C] hover:bg-[#ff6c6c] text-white rounded"
              >
                Cancel
              </button>
            </Link>

            <button
              type="submit"
              className="py-2.5 mx-0 sm:mx-1 mt-2 sm:mt-0 w-full sm:w-20 text-center cursor-pointer bg-[#03624C] hover:bg-[#0B4539] text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div>
        <div className="max-w-lg mx-auto my-20 bg-[#2EA98C] rounded-lg shadow-md shadow-[#030F0F] px-5 py-15">
          <img
            className="w-32 h-32 rounded-full mx-auto"
            src="https://picsum.photos/200"
            alt="Profile picture"
          />
          <h2 className="text-center text-2xl font-semibold mt-3">
            {firstName}{" "}
            {middleName ? `${middleName.slice(0, 1).toUpperCase()}.` : ""}{" "}
            {lastName}
          </h2>
          <p className="text-center text-gray-600 mt-1">{specialization}</p>
          <div className="flex justify-center mt-5">
            <p className="text-[#03624C] hover:text-[#03624C] mx-3 font-semibold">
              {contactNumber}
            </p>
            <p className="text-[#03624C] hover:text-[#03624C] mx-3 font-semibold">
              {officeAddress}
            </p>
          </div>
          <div className="mt-5 flex flex-col align-center items-center justify-center">
            <h3 className="text-xl font-semibold ">Bio</h3>
            <p className="text-gray-600 mt-2">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
