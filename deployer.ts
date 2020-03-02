import { exec } from "child_process";

let printCB = function (error, stdout, _) {
    if (error) {
      console.log(error.code);
    }
    console.log(stdout);
  }

exec('sls deploy', printCB);