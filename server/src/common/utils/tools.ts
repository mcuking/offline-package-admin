import * as path from 'path';
import * as md5 from 'md5';

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

export { getFilePath, getFileName };
