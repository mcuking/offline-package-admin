export interface IPackageInfo {
  id: number;
  key: number;
  moduleName: string;
  version: number;
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
  moduleName?: string;
  status?: string;
}
