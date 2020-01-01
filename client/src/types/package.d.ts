export interface IPackageInfo {
  id: number;
  key: number;
  moduleName: string;
  version: number;
  appName: string;
  status: number;
  statusStr: string;
  updateLog: string;
  fileUrl: string;
  patchUrls: string;
  createTime: string;
}

export interface IPackageInfoListQuery {
  page: number;
  size: number;
  appName?: string;
  moduleName?: string;
  status?: string;
}
