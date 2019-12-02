import * as path from 'path';
import * as fs from 'fs';
import * as md5 from 'md5';
import * as crypto from 'crypto';

const getFilePath = (
  moduleName: string,
  version: number,
  lastVersion?: number,
) => {
  const fileName = getFileName(moduleName, version, lastVersion);
  return path.join(global.__basedir, 'packages', moduleName, fileName);
};

const getFileName = (
  moduleName: string,
  version: number,
  lastVersion?: number,
) => {
  if (lastVersion) {
    return md5(`${moduleName}${lastVersion}->${version}`);
  }
  return md5(`${moduleName}${version}`);
};

const getFileMd5 = (filePath: string) => {
  const buffer = fs.readFileSync(filePath);
  const fsHash = crypto.createHash('md5');
  fsHash.update(buffer);
  const fileMd5 = fsHash.digest('hex');
  return fileMd5;
};

export { getFilePath, getFileName, getFileMd5 };
