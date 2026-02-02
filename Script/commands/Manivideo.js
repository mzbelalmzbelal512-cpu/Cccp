/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "Mani",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "BELAL BOTX666",
 description: "SAD VEDIO",
 commandCategory: "video",
 usages: "sad vedio",
 cooldowns: 5,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
};

module.exports.run = async({api,event,args,client,Users,Threads,__GLOBAL,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var hi = ["Mani] \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ 
  "https://i.imgur.com/efujeSb.mp4",
  "https://i.imgur.com/9qHtAH5.mp4",
  "https://i.imgur.com/DvIy3uB.mp4",
  "https://i.imgur.com/HUMT7th.mp4",
  "https://i.imgur.com/5JDuFFO.mp4",
  "https://i.imgur.com/ufcsl43.mp4",
  "https://i.imgur.com/0AwVg2T.mp4",
  "https://i.imgur.com/8yGG9Qk.mp4",
  "https://i.imgur.com/pWLAvCN.mp4",
  "https://i.imgur.com/QihauiW.mp4",
  "https://i.imgur.com/vKNO5Td.mp4",
  "https://i.imgur.com/mhKPFV6.mp4",
  "https://i.imgur.com/d7ZFMMr.mp4",
  "https://i.imgur.com/mjbF8EZ.mp4",
  "https://i.imgur.com/Mt2qsIh.mp4",
  "https://i.imgur.com/ALER7eP.mp4",
  "https://i.imgur.com/sHtmmvg.mp4",
  "https://i.imgur.com/FEOd8rE.mp4",
  "https://i.imgur.com/EZEb7IN.mp4",
  "https://i.imgur.com/mLOWOmY.mp4",
  "https://i.imgur.com/FmuwMxv.mp4"
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
