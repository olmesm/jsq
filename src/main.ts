import * as r from "rambdax";
import _ from "lodash";
import f from "lodash/fp";

const isDebug = process.env.DEBUG;

type Fn = (...args: any[]) => any;

const reduce = (fns: [Fn]) => (stdinJson: JSON) =>
  r.reduce((acc, fn) => fn(acc, stdinJson), stdinJson, fns);

export function main(expression: string[], stdinJson: string) {
  try {
    stdinJson = JSON.parse(stdinJson);
  } catch (e) {
    isDebug && console.error(e);
    throw new Error("Failed to parse incoming JSON");
  }

  const primarayExpression = expression[0];
  let fn;

  try {
    fn = eval(`(r, _, f) => ${primarayExpression}`)(r, _, f);
  } catch (e) {
    isDebug && console.error(e);
    throw new Error("Failed parse the input function expression");
  }

  try {
    if (Array.isArray(fn)) {
      fn = reduce(fn as [Fn]);
    }
  } catch (e) {
    isDebug && console.error(e);
    throw new Error(
      "Failed construct the recursive function from input expression"
    );
  }

  try {
    return fn(stdinJson);
  } catch (e) {
    isDebug && console.error(e);
    throw new Error("Failed run the function against the input object");
  }
}
