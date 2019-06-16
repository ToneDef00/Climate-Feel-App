const fs = require('fs');
const path = require('path');
const firebase = require('firebase');




var firebaseConfig = {
  apiKey: "AIzaSyAJe06nmla8caiFGdvD9f3MhHGZVdvSwD0",
  authDomain: "climate-feel.firebaseapp.com",
  databaseURL: "https://climate-feel.firebaseio.com",
  projectId: "climate-feel",
  storageBucket: "",
  messagingSenderId: "76697086015",
  appId: "1:76697086015:web:806c5d978abc1e0b"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();




var removeExtraKeys = function (data) {
  let output = [];
  for (let i = 0; i < data.length; i++) {
    let outputobject = {
      "YearMonth": data[i].YearMonth, "PCP": data[i].PCP,
      "TAVG": data[i].TAVG, "TMIN": data[i].TMIN, "TMAX": data[i].TMAX
    };
    output.push(outputobject);
  }
  return output;

}

// // use an absolute path to the folder where files are located
// readFiles('/home/eliza/Documents/UCB-Code/Climate-Feel-App/assets/data/TODO/', (filepath, name, ext, stat) => {
//   console.log('file name:', name);
// });

function readFilesSync(dir) {
  const files = [];

  fs.readdirSync(dir).forEach(filename => {
    const name = path.parse(filename).name;
    const ext = path.parse(filename).ext;
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();
    if (isFile) files.push({ name, filepath, ext });
  });
  return files;
}



// console.log(files)

ReadAllFilesInList = function (files) {
  let output = [];
  files.forEach(element => {
    let file = fs.readFileSync(element.filepath, 'utf8');
    output.push(JSON.parse(file))
  });
  return output;

}

const files = readFilesSync('/home/eliza/Documents/UCB-Code/Climate-Feel-App/assets/data/TODO/');
const JsonFiles = ReadAllFilesInList(files)

UploadToFirebase = function (ListOFFiles, JSONInputData) {
  var StateCodePairArray = [];
  for (let i = 0; i < ListOFFiles.length; i++) {
    // console.log(ListOFFiles[i].name.slice(0,2));
    // console.log(JSONInputData[i][0]['StateCode'])
    let stateCodePair = { name: ListOFFiles[i].name.slice(0, 2), code: JSONInputData[i][0]['StateCode'] };
    StateCodePairArray.push(stateCodePair);

    let inputobject = {};
    inputobject[`USA${JSONInputData[i][0]['StateCode']}`] = removeExtraKeys(JSONInputData[i]);

     console.log(`USA${JSONInputData[i][0]['StateCode']}`);
      database.ref().update(inputobject);
   
  }

  return StateCodePairArray;
}

console.log(UploadToFirebase(files, JsonFiles))



// var buildOutputArray = function(data){
//     let output = [{
//       YearMonth: data[0][`04`],
//       PCP: data[1][`04`],
//       TAVG: data[2][`04`],
//       TMIN: data[3][`04`],
//       TMAX: data[4][`04`]
//   }];
//   for(i = 1; i<241;i++){
//       let datapoint = {
//           YearMonth: data[0][`04__${i}`],
//           PCP: data[1][`04__${i}`],
//           TAVG: data[2][`04__${i}`],
//           TMIN: data[3][`04__${i}`],
//           TMAX: data[4][`04__${i}`]
//       };
//       output.push(datapoint);

//   }
//   return output;
// }

  // database.ref().once("value")
  // .then(function(snapshot) {
  //   console.log(snapshot.val());

  // });



