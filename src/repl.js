import { createInterface } from 'readline/promises';
import { InvalidInputError } from './errors.js';
import { printer } from './helpers.js';

export class ReplService {
  constructor(username, navigationService) {
    this.username = username;
    this.navigationService = navigationService;
  }

  async inputHandler(input, commands) {
    input = input.toString().trim();
    if (!input) return;
    const [cmd, ...args] = input.split(" ");
    const cmdHandler = commands.get(cmd)
    try {
      if (cmdHandler) await cmdHandler(args);
      else throw new InvalidInputError();
    } catch (err) {
      printer.error(err.message)
    }
    printer.cwd(this.navigationService.cwd);
  }

  start(process, commands) {
    this.rl = createInterface({ input: process.stdin, output: process.stdout, prompt: "$ " });
    this.rl.on("line", async (input) => {
      await this.inputHandler(input, commands);
      this.rl.prompt();
    });
    this.rl.on("close", () => {
      printer.end(this.username);
      process.exit();
    });

    printer.welcome(this.username);
    printer.cwd(this.navigationService.cwd);

    this.rl.prompt();
  }

  close() {
    this.rl.close();
  }
}