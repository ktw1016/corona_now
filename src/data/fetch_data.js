const exec = require('child_process').exec;
const simpleGit = require('simple-git');
const fs = require('fs');

const confirmed_file = "time_series_covid19_confirmed_global.csv";
const deaths_file = "time_series_covid19_deaths_global.csv";
const lastUpdated_file = "lastUpdated.csv";
const pat_cmd = "echo $GIT_PAT";
var pat = "";

const download_and_push_data = async () => {
  exec(pat_cmd, function(error, stdout, stderr){
    pat = stdout.trim();
    const confirmed_cmd = `curl -H 'Authorization: token ${pat}' -H 'Accept: application/vnd.github.v3.raw' -O -L https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/${confirmed_file}`;
    const deaths_cmd = `curl -H 'Authorization: token ${pat}' -H 'Accept: application/vnd.github.v3.raw' -O -L https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/${deaths_file}`;
    if(error !== null){ console.log('exec error: ' + error); }
    exec(confirmed_cmd, function(error, stdout, stderr){
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if(error !== null) { console.log('exec error: ' + error); }
      exec(deaths_cmd, function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if(error !== null) { console.log('exec error: ' + error); }
        simpleGit()
          .removeRemote("origin")
          .addRemote("origin", `https://ktw1016:${pat}@github.com/ktw1016/corona_now.git`)
          .add([confirmed_file, deaths_file, lastUpdated_file])
          .commit("Auto Data Update", () => exec(`git push --set-upstream origin master`, function(error, stdout, stderr){
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if(error !== null)
            {
              console.log('exec error: ' + error);
            }
          }));
      });    
    });
  });
};

const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = (today.getMonth() + 1) >= 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`; // getMonth() is zero-based
  const dd = today.getDate() >= 10 ? today.getDate() : `0${today.getDate()}`;
  const hh = today.getHours() >= 10 ? today.getHours() : `0${today.getHours()}`;
  const minutes = today.getMinutes() >= 10 ? today.getMinutes() : `0${today.getMinutes()}`;
  return `${yyyy}-${mm}-${dd} ${hh}:${minutes} EDT`;
};
const write_last_updated_to_CSV = () => {
  const writeStream = fs.createWriteStream('./lastUpdated.csv');

  writeStream.write('lastUpdated\n');
  writeStream.write(getToday());
  console.log("Last Updated CSV written");
};

console.log("Start polling..");
setInterval(async () => {
  await download_and_push_data().then( async () => {
    await write_last_updated_to_CSV();
  });
}, 1 * 60 * 60 * 1000); //every hour, download, push data and write last updated CSV