import defaultImage from "../../public/default.svg";

interface Props {
  profilePicture?: string;
}

const ProfilePicture = ({ profilePicture }: Props) => {
  return (
    <img
      src={profilePicture || defaultImage}
      alt="Patient Picture"
      className="rounded-full shadow-md h-32 w-32 object-cover"
    />
  );
};

export default ProfilePicture;
