import { EOL, cpus as _cpus, homedir, userInfo } from 'os';

export const getSystemOSInfo = (args) => {
  console.log(`OS Information: ${EOL}`);
  const cmds = args.map((arg) => { if (arg.startsWith("--")) return arg.slice(2); });
  const cpus = _cpus().map((cpu, index) => {
    const model = cpu.model;
    const speedInGHz = (cpu.speed / 1000).toFixed(2);
    return { cpu: index + 1, model: model, clockRate: speedInGHz };
  });

  if (cmds.includes("EOL")) {
    console.log(`EOL for this device is: ${JSON.stringify(EOL)}${EOL}`);
  }
  if (cmds.includes('cpus')) {
    console.log(`CPU: ${EOL}`);
    console.table(cpus);
  }
  if (cmds.includes("homedir")) {
    console.log(`${EOL}Your homedir is: ${homedir()}${EOL}`);
  }
  if (cmds.includes("username")) {
    console.log(`${userInfo().username}`);
  }
  if (cmds.includes("architecture")) {
    console.log(process.arch);
  }
};