import { FilesService } from "./fs.js";
import { parseArgs } from "./helpers.js";
import { NavigationService } from "./navigation.js";
import { ReplService } from "./repl.js";

export class App {
  constructor(process) {
    const args = parseArgs(process);
    const username = args.get('username') ?? "Username";
    const navigationService = new NavigationService();
    const replService = new ReplService(username, navigationService);
    const filesService = new FilesService(navigationService);

    const commands = new Map([
      [".exit", () => replService.close()],
      ["up", () => navigationService.up()],
      ["cd", (args) => navigationService.changeDirectory(args)],
      ["ls", () => navigationService.list()],
      ["add", (args) => filesService.add(args)],
      ["cat", (args) => filesService.concatenate(args)],
      ["rn", (args) => filesService.rename(args)],
      ["cp", (args) => filesService.copyFile(args)],
      ["rm", (args) => filesService.removeFile(args)],
      ["mv", (args) => filesService.moveFile(args)],
      // ["os", (args) => filesService.moveFile(args)],
    ]);

    replService.start(process, commands)
  }
}