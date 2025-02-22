'use client'
import { Badge } from "@chakra-ui/react"
import Chats from "@/components/Chats";

const mockGroup = {
    _id: "1",
    name: "Tech Enthusiasts",
    profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
    creator: {
        _id: "3",
        name: "Muhammad Zohaib",
        profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg",
    },
};

const mockMembers = [
    { _id: "3", name: "Muhammad Zohaib", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "4", name: "Ayesha Khan", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "5", name: "Ali Raza", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "6", name: "Sara Ahmed", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "7", name: "Hamza Tariq", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "8", name: "Fatima Noor", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "9", name: "Bilal Hussain", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "10", name: "Zainab Bukhari", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "11", name: "Umar Farooq", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
    { _id: "12", name: "Hina Malik", profile_pic: "https://wallpapers.com/images/featured/cute-profile-picture-s52z1uggme5sj92d.jpg" },
];

export default function GroupPage() {
    return (
        <div className="flex-1 p-6 flex flex-col items-center overflow-auto">
            <img src={mockGroup.profile_pic} alt="Group" className="h-24 w-24 rounded-full border shadow-md" />
            <h1 className="text-2xl font-bold mt-2">{mockGroup.name}</h1>

            <div className="mt-4 w-full">
                <h2 className="text-xl font-semibold mb-2">Members</h2>
                <div className="bg-white shadow-md rounded-lg p-4 space-y-3">
                    {mockMembers.map((member) => (
                        <div key={member._id} className="flex items-center gap-4 p-2 border-b last:border-none">
                            <img src={member.profile_pic} className="h-12 w-12 rounded-full border" alt={member.name} />
                            <div className="flex-1">
                                <span className="font-semibold text-lg">{member.name}</span>
                            </div>
                            {member._id === mockGroup.creator._id && <Badge colorPalette="green" size="lg">Creator</Badge>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
