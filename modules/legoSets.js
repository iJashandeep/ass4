const setData = require("../data/setData");
const themeData = require("../data/themeData");

let sets = [];

const initialize = () => {
  return new Promise((resolve,reject) =>{
  sets = [];
  setData.forEach((set) => {
    const themeMatch = themeData.find((theme) => theme.id === set.theme_id);//check for id in theme is equal to theme_id in setData

    if (themeMatch) {//when themeMatch is not undefined
      sets.push({ ...set, theme: themeMatch.name });//adding theme property to all the original properties in sets array
    }
  });
  resolve();//resolve with no data
});
};

const getAllSets = () => {
  return new Promise((resolve, reject) => {
    if (sets.length > 0) {//check if there are any sets in the sets array
      resolve(sets);
    } else {
      reject("No sets available");
    }
  });
};

const getSetByNum = (setNum) => {
  return new Promise((resolve, reject) => {
    const setMatch = sets.find((set) => set.set_num === setNum);//it will search for the set in which set_num match with setNum provided

    if (setMatch) {//if set is found setMatch will be truthy
      resolve(setMatch);//it will give the set that is found
    } else {
      reject(`Unable to find requested set with set_num: ${setNum}`);
    }
  });
};

const getSetsByTheme = (theme) => {
  return new Promise((resolve, reject) => {
    const filteredSets = sets.filter(//will create new array that match the condition
      (set) =>
        set.theme.toLowerCase().includes(theme.toLowerCase()) //this will check is theme in set includes the provided theme 
        ||
        theme.toLowerCase().includes(set.theme.toLowerCase())//this will check is provided them includes the theme we have in sets array
    );

    if (filteredSets.length > 0) {
      resolve(filteredSets);
    } else {
      reject(`Unable to find requested sets with theme: ${theme}`);
    }
  });
};

module.exports = { initialize, getAllSets, getSetByNum, getSetsByTheme };//assigning at once


