import * as bsdiff from 'bsdiff-nodejs';
import * as fs from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackageEntity } from './package.entity';
import { IUploadInfo } from '../../types';
import { QueryPackageDto } from './query.package.dto';
import config from '../../common/config';
import { getFilePath, getFileName, getFileMd5 } from '../../common/utils/tools';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageEntity: Repository<PackageEntity>,
  ) {}

  async pushPackageInfo(uploadInfo: IUploadInfo, lastVersion: number | void) {
    try {
      const { moduleName, version } = uploadInfo;

      // 因校验通过，因此需去除本地文件名的 _tmp 后缀
      const tempFilePath = getFilePath(moduleName, version) + '_temp';
      const filePath = getFilePath(moduleName, version);
      fs.renameSync(tempFilePath, filePath);
      const fileMd5 = getFileMd5(filePath);

      let patchUrls = '';

      // 如果存在上个版本，则使用 bsdiff 算法计算两个版本的差分包
      if (lastVersion) {
        const oldFilePath = getFilePath(moduleName, lastVersion);

        const patchFileName = getFileName(moduleName, version, lastVersion);
        const patchFilePath = getFilePath(moduleName, version, lastVersion);

        await bsdiff.diff(
          oldFilePath,
          filePath,
          patchFilePath,
          (result: any, err: any) => {
            if (err) {
              Logger.error(err);
              return;
            }
            Logger.log('diff:' + String(result).padStart(4) + '%');
          },
        );

        const patchFileMd5 = getFileMd5(patchFilePath);

        patchUrls = JSON.stringify({
          [lastVersion]: {
            fileUrl: `${config.downloadUrl}/${moduleName}/${patchFileName}`,
            fileMd5: patchFileMd5,
          },
        });
      }

      const fileName = getFileName(moduleName, version);
      const packageInfo = {
        status: 1,
        fileUrl: `${config.downloadUrl}/${moduleName}/${fileName}`,
        fileMd5,
        patchUrls,
        ...uploadInfo,
      };

      return this.packageEntity.save(this.packageEntity.create(packageInfo));
    } catch (error) {
      Logger.log('service: pushPackageInfo', error);
    }
  }

  async getPackageInfoList(query: QueryPackageDto) {
    const subQuery = this.packageEntity.createQueryBuilder('package');

    let whereCondition = '1=1';

    if (query.moduleName !== undefined) {
      whereCondition += ' And package.moduleName=:moduleName';
    }

    if (query.status !== undefined) {
      whereCondition += ' And package.status=:status';
    }

    return subQuery
      .where(whereCondition, {
        moduleName: query.moduleName,
        status: query.status,
      })
      .skip((query.page - 1) * query.size)
      .take(query.size)
      .getManyAndCount()
      .then(([list, count]) => {
        return {
          list,
          total: count * 1,
        };
      });
  }

  async getLatestVersion(moduleName: string) {
    return this.packageEntity
      .createQueryBuilder('package')
      .where('package.moduleName=:moduleName', { moduleName })
      .orderBy('package.version', 'DESC')
      .getOne()
      .then(item => {
        if (item) {
          return item.version;
        } else {
          return null;
        }
      })
      .catch(error => Logger.log('service: getLatestVersion', error));
  }

  async stopPackage(id: number) {
    return this.packageEntity
      .findOneOrFail({ id })
      .then(() => this.packageEntity.update({ id }, { status: 0 }))
      .then(() => null);
  }

  async getLatestPackageList() {
    const items = await this.packageEntity
      .createQueryBuilder('package')
      .groupBy('moduleName')
      .select('moduleName')
      .addSelect('MAX(version)', 'version')
      .getRawMany();

    return await Promise.all(
      items.map(async item => {
        const latestItem = await this.packageEntity
          .createQueryBuilder('package')
          .where(
            'package.moduleName=:moduleName And package.version=:version',
            {
              moduleName: item.moduleName,
              version: item.version,
            },
          )
          .getOne();

        let { patchUrls } = latestItem;
        patchUrls = patchUrls ? JSON.parse(patchUrls) : '';
        const preVersion = patchUrls ? Object.keys(patchUrls)[0] : '';
        const patchFileMd5 = patchUrls ? patchUrls[preVersion].fileMd5 : '';

        return {
          packageId: latestItem.moduleName,
          version: latestItem.version.toString(),
          preVersion,
          fileMd5: latestItem.fileMd5,
          patchFileMd5,
          status: 1,
          isPatch: latestItem.version !== 1,
        };
      }),
    );
  }
}
