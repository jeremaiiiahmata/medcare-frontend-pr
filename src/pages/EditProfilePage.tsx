import {useState, useEffect, useContext} from 'react'
import useAxios from '../utils/UseAxios';
import AuthContext from "../context/AuthContext";
import { jwtDecode } from 'jwt-decode';
import { Profile } from '../models/ProfileInterface';

const EditProfilePage = () => {

const authContext = useContext(AuthContext);
const api = useAxios();

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

  const handleSubmit = async () => {

    // hard-coded values, wala pang form for this
    const newProfile: Profile = {
          id: userId,
          first_name: "Joshua",
          middle_name: "Butuyan",
          last_name: "Mata",
          specialization: "Computer Science",
          contact_number: "09166327511",
          office_address: "San Pedro, Laguna",
          bio: "I love Programming!!!"
        };

    try {
        const response = await api.put("/profile/edit", newProfile);
    
        console.log(response);
        console.log("Profile has been updated successfully.");
        fetchData();

    } catch (error) {
        console.log(`Error in editing profile : ${error}`);
    }
  }

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
  }

  useEffect(() => {
         fetchData();
  }, []);

  return (
    <div>
        <h1>ID: {profile?.id}</h1>
        <p> First Name : {profile?.first_name}</p>
        <p> Middle Name : {profile?.middle_name}</p>
        <p> Last Name : {profile?.last_name}</p>
        <p> Specialization : {profile?.specialization}</p>
        <p> Contact Number : {profile?.contact_number}</p>
        <p> Office Address : {profile?.office_address}</p>
        <p> Bio : {profile?.bio}</p>
        <button onClick={handleSubmit}>Submit</button>

    </div>
  )
}

export default EditProfilePage