import { access, readdir, stat } from 'fs/promises';
import { homedir } from 'os';
import { isAbsolute, resolve } from 'path';
import { OperationFailedError } from './errors.js';
import { printer } from './helpers.js';

export class NavigationService {
  _cwd = homedir()

  constructor() {
    if (NavigationService._cwd) return NavigationService._cwd;
    NavigationService._cwd = this;
  }

  set cwd(value) {
    this._cwd = value;
  }

  get cwd() {
    return this._cwd
  }

  async validatePath(args, validateDir = false, raiseOnFileExist = false) {
    try {
      const [targetPath] = args
      const destPath = isAbsolute(targetPath) ? targetPath : resolve(this.cwd, targetPath);
      try {
        await access(destPath);
      } catch (err) {
        if (raiseOnFileExist) throw err
      }
      const destPathStat = await stat(destPath);
      const fileTypeCondition = validateDir ? !destPathStat.isDirectory() : destPathStat.isDirectory()
      if (fileTypeCondition) throw new OperationFailedError();
      return destPath;
    } catch (err) {
      throw new OperationFailedError();
    }
  }

  async changeDirectory(args) {
    const destination = await this.validatePath(args, true);
    this.cwd = destination;
  }

  async up() {
    await this.changeDirectory([".."]);
  }

  async list() {
    try {
      const entries = await readdir(this.cwd, { withFileTypes: true });
      const filesTable = entries.map((entry) => ({
        Name: entry.name,
        Type: entry.isDirectory() ? "directory" : entry.isFile() ? "file" : "unknown",
      })).sort((a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name));
      console.table(filesTable);
    } catch (err) {
      printer.error(err.message);
    }
  }
}
