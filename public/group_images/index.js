const groupImages = [
    "group-1",
    "group-2",
].map(name => ({ name, src: `/group_images/${name}.png` }));

// Add some avatar-based options as fallbacks
const avatarBasedGroups = [
    { name: "team-1", src: "/avatars/astronaut.png" },
    { name: "team-2", src: "/avatars/gamer.png" },
];

export default [...groupImages, ...avatarBasedGroups];
