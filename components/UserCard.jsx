"use client";

const ProfileCard = ({ name = "Zohaib", image, className}) => {
  return (
    <div className={`flex w-full items-center p-2 ${className} rounded-2xl hover:bg-gray-100`}>
      <div className="flex items-center gap-4 cursor-pointer">
        <img
          src={image || "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg"}
          alt={name}
          className="h-10 w-10 rounded-full"
        />
        <span className="font-medium">{name}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
