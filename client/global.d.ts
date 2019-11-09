declare module '*.less';

interface AnyObject {
  [propName: string]: any;
}

interface ListQuery extends AnyObject {
  page: number;
  size: number;
}
