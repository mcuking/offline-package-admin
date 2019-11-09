import http from '../http';
import { packageInfoTranslator } from './translators';

export interface IPackageService {
  pushPackageInfo(data: any): void;
  getPackageInfoList(query: ListQuery): any;
  stopPackage(id: number): void;
}

export class PackageService implements IPackageService {
  public async pushPackageInfo(data: any) {
    await http({
      method: 'post',
      url: '/pushPackageInfo',
      data
    });
  }

  public async getPackageInfoList(
    query: ListQuery
  ): Promise<{ total: number; list: any[] }> {
    const {
      data: { list, total }
    } = await http({
      method: 'get',
      url: '/getPackageInfoList',
      data: query
    });
    return {
      list: list.map((item: any) => packageInfoTranslator(item)),
      total
    };
  }

  public async stopPackage(id: number) {
    await http({
      method: 'get',
      url: '/stopPackage',
      data: {
        id
      }
    });
  }
}
