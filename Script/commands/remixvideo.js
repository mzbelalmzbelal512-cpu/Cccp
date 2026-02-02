/** Don't change credits bro i will fix¯\_(ツ)_/¯ **/
module.exports.config = {
 name: "remix",
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
 var hi = ["remix song + video] \n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄"];
 var know = hi[Math.floor(Math.random() * hi.length)];
 var link = [ 
"https://i.imgur.com/WiN61xo.mp4",
"https://i.imgur.com/E8CJ41v.mp4",
"https://i.imgur.com/at160td.mp4",
"https://i.imgur.com/uXF21V0.mp4",
"https://i.imgur.com/PY2gEX5.mp4",
"https://i.imgur.com/pLvqyhk.mp4",
"https://i.imgur.com/pmRCKdj.mp4",
"https://i.imgur.com/BOLlSvR.mp4",
"https://i.imgur.com/wb5zalI.mp4",
"https://i.imgur.com/jbR65dn.mp4",
"https://i.imgur.com/HNaIZva.mp4",
"https://i.imgur.com/q6bdtEF.mp4",
"https://i.imgur.com/cwHjlwL.mp4",
"https://i.imgur.com/C9J11ZE.mp4",
"https://i.imgur.com/qYmdVha.mp4",
"https://i.imgur.com/CtHJfGE.mp4",
"https://i.imgur.com/Akn0f3l.mp4",
"https://i.imgur.com/JSEyM0q.mp4",
"https://i.imgur.com/zoPBPy6.mp4",
"https://i.imgur.com/l5XoZEP.mp4",
"https://i.imgur.com/JEebjbb.mp4",
"https://i.imgur.com/7Q3RQRx.mp4",
"https://i.imgur.com/ZZye7c7.mp4",
"https://i.imgur.com/InJinNv.mp4",
"https://i.imgur.com/CiDiLx2.mp4",
"https://i.imgur.com/MGxRtKa.mp4",
"https://i.imgur.com/DWUrIly.mp4",
"https://i.imgur.com/RpT21xI.mp4",
"https://i.imgur.com/eYJua6n.mp4",
"https://i.imgur.com/pCPEGzw.mp4",
"https://i.imgur.com/XyiPRaZ.mp4",
"https://i.imgur.com/wpFTGFd.mp4",
"https://i.imgur.com/MF0Gh1E.mp4",
"https://i.imgur.com/mNJHmqw.mp4",
"https://i.imgur.com/4ksCt9d.mp4",
"https://i.imgur.com/8KEiItD.mp4",
"https://i.imgur.com/es2Wnpd.mp4",
"https://i.imgur.com/kEksbCx.mp4",
"https://i.imgur.com/eelldIM.mp4",
"https://i.imgur.com/qW4O7ma.mp4",
"https://i.imgur.com/tnYD9bk.mp4",
"https://i.imgur.com/8Ka4Wwa.mp4",
"https://i.imgur.com/hotUEBx.mp4",
"https://i.imgur.com/p8OYNp9.mp4",
"https://i.imgur.com/1Yml2uj.mp4",
"https://i.imgur.com/z60L9Qm.mp4",
"https://i.imgur.com/gRUGBIY.mp4",
"https://i.imgur.com/TtJjFl0.mp4",
"https://i.imgur.com/EIKYVDa.mp4",
"https://i.imgur.com/hGiOQwN.mp4",
"https://i.imgur.com/kT3psXE.mp4",
"https://i.imgur.com/tovDcRZ.mp4"
];
 var callback = () => api.sendMessage({body:`「 ${know} 」`,attachment: fs.createReadStream(__dirname + "/cache/15.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/15.mp4")); 
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/15.mp4")).on("close",() => callback());
 };
