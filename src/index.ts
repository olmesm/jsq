import fs from "fs";

const data = fs.readFileSync(0, "utf-8");

const main = async () => {
  console.log(JSON.parse(data));
};

main();