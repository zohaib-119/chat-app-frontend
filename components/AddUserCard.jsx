"use client";

const AddUserCard = ({ name = "Zohaib", image, onAddContact }) => {
  return (
    <div className="flex w-full items-center justify-between p-2 bg-gray-100 rounded-2xl">
      <div className="flex items-center gap-4 cursor-pointer">
        <img
          src={image || "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg"}
          alt={name}
          className="h-10 w-10 rounded-full"
        />
        <span className="font-medium">{name}</span>
      </div>
      <button
        onClick={onAddContact}
        className="rounded-xl bg-green-500 px-4 py-2 text-sm text-white cursor-pointer hover:bg-green-600 transition"
      >
        Add Contact
      </button>
    </div>
  );
};

export default AddUserCard;
