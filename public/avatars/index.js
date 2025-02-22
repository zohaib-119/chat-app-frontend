const avatars = [
    "man",
    "man-2",
    "man-3",
    "woman",
    "woman-2",
    "woman-3",
    "gamer",
    "profile",
    "user",
    "astronaut"
].map(name => ({ name, src: `/avatars/${name}.png` }));

export default avatars;
