declare module 'bsdiff-nodejs';

declare namespace NodeJS {
  export interface Global {
    __basedir: string;
  }
}

interface AnyObject {
  [propName: string]: any;
}
