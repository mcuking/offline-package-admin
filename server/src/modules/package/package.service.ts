import * as bsdiff from 'bsdiff-nodejs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { PackageEntity } from './package.entity';
import { QueryPackageDto } from './query.package.dto';
import config from '../../common/config';
import { getFilePath, getFileName } from '../../common/utils/tools';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(PackageEntity)
    private readonly packageEntity: Repository<PackageEntity>,
  ) {}

  async pushPackageInfo(dto, lastVersion: number | void) {
    const { moduleName, version } = dto;

    // 因校验通过，因此需去除本地文件名的 _tmp 后缀
    const tempFilePath = getFilePath(moduleName, version) + '_temp';
    const filePath = getFilePath(moduleName, version);
    fs.renameSync(tempFilePath, filePath);

    let patchUrls = '';

    // 如果存在上个版本，则使用 bsdiff 算法计算两个版本的差分包
    if (lastVersion) {
      const oldFilePath = getFilePath(moduleName, lastVersion);

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

      const patchFileName = getFileName(moduleName, version, lastVersion);
      patchUrls = JSON.stringify({
        [lastVersion]: `${config.downloadUrl}/${moduleName}/${patchFileName}`,
      });
    }

    const fileName = getFileName(moduleName, version);
    const packageInfo: PackageEntity = {
      status: 1,
      downloadUrl: `${config.downloadUrl}/${moduleName}/${fileName}`,
      patchUrls,
      ...dto,
    };

    this.packageEntity.save(this.packageEntity.create(packageInfo));
  }

  getPackageInfoList(query: QueryPackageDto) {
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

  getLatestVersion(moduleName: string) {
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

  stopPackage(id: number) {
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

        return {
          packageId: latestItem.moduleName,
          version: latestItem.version.toString(),
          status: 1,
          isPatch: latestItem.version !== 1,
        };
      }),
    );
  }
}
