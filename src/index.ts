import { main } from "./main.js";

import fs from "fs";

const stdinJson = fs.readFileSync(0, "utf-8");
const input = [process.argv[2]];

const result = main(input, stdinJson);

console.log(result);
