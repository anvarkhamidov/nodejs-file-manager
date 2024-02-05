import { EOL } from 'os';
import { isAbsolute, resolve } from 'path';

export const printer = {
  welcome: (username) => console.log(`Welcome to the File Manager, ${username}!`),
  end: (username) => console.log(`${EOL}Thank you for using File Manager, ${username}, goodbye!`),
  cwd: (path) => console.log(`${EOL}You are currently in ${path}`),
  error: (msg) => console.log(`ERROR: ${msg}`)
};

export const parseArgs = (process) => {
  const args = process.argv.slice(2);
  return args.reduce((acc, arg) => {
    if (!arg.startsWith("--")) return acc;
    const [key, value] = arg.slice(2).split("=");
    return acc.set(key, value);
  }, new Map());
};

export const parsePathArgs = (args, cwd) => {
  const [...paths] = args;
  return paths.map((path) => isAbsolute(path) ? path : resolve(cwd, path));
}