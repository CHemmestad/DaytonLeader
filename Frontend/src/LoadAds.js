// src/utils/loadAds.js
const importAll = (r) => r.keys().map((key) => ({
  id: key,
  imageUrl: r(key),
  link: "#" // You can add real links later or update based on filename
}));

const ads = importAll(require.context('./Images/Ads', false, /\.(png|jpe?g|svg)$/));

export default ads;
