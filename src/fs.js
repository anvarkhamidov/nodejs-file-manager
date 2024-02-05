import { createReadStream, createWriteStream, stat } from 'fs';
import { rename, writeFile } from 'fs/promises';
import { EOL } from 'os';
import { basename, resolve } from 'path';
import { OperationFailedError } from './errors.js';
import { parsePathArgs } from './helpers.js';

export class FilesService {

  constructor(navigationService) {
    this.navigationService = navigationService;
  }

  async add(args) {
    try {
      const path = parsePathArgs(args, this.navigationService.cwd)
      await writeFile(path, "", { flag: "wx" });
    } catch {
      console.log(err.message);
      throw new OperationFailedError();
    }
  }

  async rename(args) {
    try {
      const [srcFilePath, destFilePath] = parsePathArgs(args, this.navigationService.cwd);
      const srcFilePathStat = await stat(srcFilePath);
      if (srcFilePathStat.isFile()) {
        await rename(srcFilePath, destFilePath);
      }
      throw new OperationFailedError();
    } catch {
      throw new OperationFailedError();
    }
  }

  concatenate(args) {
    return new Promise(async (presolve, preject) => {
      try {
        const path = await this.navigationService.validatePath(args, false);
        const stream = createReadStream(path);
        stream.on("open", () => console.log(EOL));
        stream.on("error", () => preject(new OperationFailedError()));
        stream.on("data", chunk => {
          console.log(chunk.toString());
        });
        stream.on("close", presolve);
      } catch {
        throw new OperationFailedError();
      }
    })
  }

  copyFile(args) {
    return new Promise(async (presolve, preject) => {
      try {
        const [srcFilePath, destFileDir] = parsePathArgs(args, this.navigationService.cwd);
        const [srcFileStat, destFileDirStat] = await Promise.all([stat(srcFilePath), stat(destFileDir)]);
        if (srcFileStat.isFile() && destFileDirStat.isDirectory()) {
          const readStream = createReadStream(srcFilePath);
          const writeStream = createWriteStream(resolve(destFileDir, basename(srcFilePath)), { flags: "wx" });
          readStream.on("error", () => preject(new OperationFailedError()));
          writeStream.on("error", () => preject(new OperationFailedError()));
          writeStream.on("close", presolve);

          readStream.pipe(writeStream);
        }
      } catch {
        throw new OperationFailedError();
      }
    });
  }

};