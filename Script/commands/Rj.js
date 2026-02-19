module.exports.config = {
  name: "rj",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CYBER ULLASH",
  description: "Ramadan Auto Image Update",
  commandCategory: "Ramadan",
  usages: "/rj",
  cooldowns: 5
};

const fs = require("fs");
const path = require("path");

module.exports.run = async function ({ api, event }) {

  // ===== RAMADAN DATA (সহজে এখানে আপডেট করবে) =====
  const ramadanData = {
    operator: "CYBER ULLASH",
    date: "১৯ ফেব্রুয়ারী, ২০২৬",
    places: {
      "Dhaka": { sehri: "05:11 AM", iftar: "05:58 PM" },
      "Kurigram": { sehri: "05:06 AM", iftar: "06:01 PM" },
      "Roumari": { sehri: "05:05 AM", iftar: "06:02 PM" },
      "Sirajganj": { sehri: "05:09 AM", iftar: "05:59 PM" }
    }
  };

  // ===== IMAGE LIST (২৪টা) =====
  const images = [
    "https://i.imgur.com/ramadan1.jpg",
    "https://i.imgur.com/ramadan2.jpg",
    "https://i.imgur.com/ramadan3.jpg",
    "https://i.imgur.com/ramadan4.jpg",
    "https://i.imgur.com/ramadan5.jpg",
    "https://i.imgur.com/ramadan6.jpg",
    "https://i.imgur.com/ramadan7.jpg",
    "https://i.imgur.com/ramadan8.jpg",
    "https://i.imgur.com/ramadan9.jpg",
    "https://i.imgur.com/ramadan10.jpg",
    "https://i.imgur.com/ramadan11.jpg",
    "https://i.imgur.com/ramadan12.jpg",
    "https://i.imgur.com/ramadan13.jpg",
    "https://i.imgur.com/ramadan14.jpg",
    "https://i.imgur.com/ramadan15.jpg",
    "https://i.imgur.com/ramadan16.jpg",
    "https://i.imgur.com/ramadan17.jpg",
    "https://i.imgur.com/ramadan18.jpg",
    "https://i.imgur.com/ramadan19.jpg",
    "https://i.imgur.com/ramadan20.jpg",
    "https://i.imgur.com/ramadan21.jpg",
    "https://i.imgur.com/ramadan22.jpg",
    "https://i.imgur.com/ramadan23.jpg",
    "https://i.imgur.com/ramadan24.jpg"
  ];

  // ===== TEST IMAGE SEND (/rj) =====
  const imgUrl = images[Math.floor(Math.random() * images.length)];

  api.sendMessage({
    body: `🌙 Ramadan Update Test\n📅 ${ramadanData.date}\n👤 ${ramadanData.operator}`,
    attachment: await global.utils.getStreamFromURL(imgUrl)
  }, event.threadID);
};

// ===== AUTO 24 IMAGE SYSTEM =====
module.exports.handleEvent = async function ({ api, event }) {

  if (!global.ramadanAuto) global.ramadanAuto = {};

  const hour = new Date().getHours();
  const key = `${event.threadID}_${hour}`;

  if (global.ramadanAuto[key]) return;
  global.ramadanAuto[key] = true;

  const images = [
    "https://i.imgur.com/ramadan1.jpg",
    "https://i.imgur.com/ramadan2.jpg",
    "https://i.imgur.com/ramadan3.jpg",
    "https://i.imgur.com/ramadan4.jpg",
    "https://i.imgur.com/ramadan5.jpg",
    "https://i.imgur.com/ramadan6.jpg",
    "https://i.imgur.com/ramadan7.jpg",
    "https://i.imgur.com/ramadan8.jpg",
    "https://i.imgur.com/ramadan9.jpg",
    "https://i.imgur.com/ramadan10.jpg",
    "https://i.imgur.com/ramadan11.jpg",
    "https://i.imgur.com/ramadan12.jpg",
    "https://i.imgur.com/ramadan13.jpg",
    "https://i.imgur.com/ramadan14.jpg",
    "https://i.imgur.com/ramadan15.jpg",
    "https://i.imgur.com/ramadan16.jpg",
    "https://i.imgur.com/ramadan17.jpg",
    "https://i.imgur.com/ramadan18.jpg",
    "https://i.imgur.com/ramadan19.jpg",
    "https://i.imgur.com/ramadan20.jpg",
    "https://i.imgur.com/ramadan21.jpg",
    "https://i.imgur.com/ramadan22.jpg",
    "https://i.imgur.com/ramadan23.jpg",
    "https://i.imgur.com/ramadan24.jpg"
  ];

  const img = images[hour % images.length];

  api.sendMessage({
    attachment: await global.utils.getStreamFromURL(img)
  }, event.threadID);
};
