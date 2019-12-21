import http from '../http';
import { packageInfoTranslator } from './translators';

import { IPackageInfo } from '@/types';

export interface IPackageService {
  pushPackageInfo(data: FormData): void;
  getPackageInfoList(
    query: ListQuery
  ): Promise<{ total: number; list: IPackageInfo[] }>;
  deletePackage(id: number): void;
}

class PackageService implements IPackageService {
  public async pushPackageInfo(data: FormData) {
    await http({
      method: 'post',
      url: '/pushPackageInfo',
      data
    });
  }

  public async getPackageInfoList(
    query: ListQuery
  ): Promise<{ total: number; list: IPackageInfo[] }> {
    const {
      data: { list, total }
    } = await http({
      method: 'get',
      url: '/getPackageInfoList',
      data: query
    });
    return {
      list: list.map((item: IPackageInfo) => packageInfoTranslator(item)),
      total
    };
  }

  public async deletePackage(id: number) {
    await http({
      method: 'post',
      url: '/deletePackage',
      data: {
        id
      }
    });
  }
}

const packageService = new PackageService();

export default packageService;
