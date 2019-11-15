export interface IPackageInfo {
  id: number;
  key: number;
  moduleName: string;
  version: number;
  status: number;
  statusStr: string;
  createTime: string;
  updateLog: string;
  downloadUrl: string;
  patchUrls: string;
}

export interface IPackageInfoListQuery {
  page: number;
  size: number;
  moduleName?: string;
  status?: string;
}
