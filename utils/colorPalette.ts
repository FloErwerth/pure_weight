export const PALETTE = ["#ed1c24", "#1633e6", "#00aeef", "#00c85d", "#57ff0a", "#ffde17", "#f26522"];
export const getRandomColorFromPalette = () => {
    return PALETTE[Math.floor(PALETTE.length * Math.random())];
};
