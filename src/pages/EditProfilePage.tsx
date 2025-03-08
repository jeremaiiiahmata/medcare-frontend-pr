import { useState, useEffect, useContext } from "react";
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
  
  // New state for tracking edit mode
  const [isEditing, setIsEditing] = useState(false);

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
          setIsEditing(false);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            {isEditing ? "Edit Profile" : "Your Profile"}
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {isEditing ? "Update your profile here" : "Your profile details"}
          </p>
        </div>
        
        <div className={`transition-all duration-500 ease-in-out ${isEditing ? "opacity-100" : "opacity-0 hidden"}`}>
          {isEditing && (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden animate-slide-in">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Form Section (3 columns) */}
                <div className="lg:col-span-3 p-6 sm:p-10">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                      <h2 className="font-semibold text-3xl text-gray-800 mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Edit Profile
                      </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          placeholder={profile?.first_name ? profile?.first_name : "First Name"}
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Middle Name</label>
                        <input
                          type="text"
                          placeholder={profile?.middle_name ? profile?.middle_name : "Middle Name"}
                          value={middleName}
                          onChange={(e) => setMiddleName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          placeholder={profile?.last_name ? profile?.last_name : "Last Name"}
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Specialization</label>
                        <input
                          type="text"
                          placeholder={profile?.specialization ? profile?.specialization : "Specialization"}
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                          type="text"
                          placeholder={profile?.contact_number ? profile?.contact_number : "Contact Number"}
                          value={contactNumber}
                          onChange={(e) => setContactNumber(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Office Address</label>
                        <input
                          type="text"
                          placeholder={profile?.office_address ? profile?.office_address : "Office Address"}
                          value={officeAddress}
                          onChange={(e) => setOfficeAddress(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        placeholder={profile?.bio ? profile?.bio : "Bio"}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent transition-all duration-200 outline-none"
                      />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 shadow-md"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-opacity-50 shadow-md flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>

                {/* Preview Section (2 columns) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 flex items-center">
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105">
                      <div className="relative">
                        <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                          <div className="relative">
                            <img
                              className="w-32 h-32 rounded-full border-4 border-white object-cover"
                              src="Medcare-Logo-White.jpg"
                              alt="Profile"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-20 pb-8 px-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 animate-fadeIn">
                          {firstName || "Your"}{" "}
                          {middleName ? `${middleName.slice(0, 1).toUpperCase()}.` : ""}{" "}
                          {lastName || "Profile"}
                        </h2>
                        <p className="text-emerald-600 font-medium mt-1">{specialization || "Specialization"}</p>
                        
                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <p>{contactNumber || "Contact Number"}</p>
                          </div>
                          
                          <div className="flex items-center justify-center text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p>{officeAddress || "Office Address"}</p>
                          </div>
                        </div>
                        
                        <div className="mt-8 border-t border-gray-200 pt-6">
                          <h3 className="text-lg font-semibold text-gray-700 mb-2">About Me</h3>
                          <p className="text-gray-600 text-sm">
                            {bio || "Your bio here."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card View (shown when not editing) */}
        <div className={`transition-all duration-500 ease-in-out ${!isEditing ? "opacity-100" : "opacity-0 hidden"}`}>
          {!isEditing && (
            <div className="flex justify-center animate-fade-in-up">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg w-full transform transition-all duration-300 hover:shadow-2xl">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-r from-emerald-700 to-emerald-900"></div>
                  <div className="absolute -bottom-20 inset-x-0 flex justify-center">
                    <div className="relative">
                      <img
                        className="w-40 h-40 rounded-full border-4 border-white object-cover shadow-lg"
                        src="Medcare-Logo-White.jpg"
                        alt="Profile"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-24 pb-8 px-6 text-center">
                  <h2 className="text-3xl font-bold text-gray-800">
                    {firstName || "Your"}{" "}
                    {middleName ? `${middleName.slice(0, 1).toUpperCase()}.` : ""}{" "}
                    {lastName || "Profile"}
                  </h2>
                  <p className="text-emerald-600 font-medium mt-2 text-xl">{specialization || "Specialization"}</p>
                  
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-lg">{contactNumber || "Contact Number"}</p>
                    </div>
                    
                    <div className="flex items-center justify-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg">{officeAddress || "Office Address"}</p>
                    </div>
                  </div>
                  
                  <div className="mt-10 border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">About Me</h3>
                    <p className="text-gray-600 px-8">
                      {bio || "Your professional bio will appear here once you add it to your profile."}
                    </p>
                  </div>
                  
                  <div className="mt-10">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-opacity-50 shadow-lg inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;