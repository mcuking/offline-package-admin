import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiUseTags,
  ApiOperation,
  ApiConsumes,
  ApiImplicitFile,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { PackageService } from './package.service';
import { CreatePackageDto } from './create.package.dto';
import { QueryPackageDto } from './query.package.dto';
import { StopPackageDto } from './stop.package.dto';
import { getFileName, getFilePath } from '../../common/utils/tools';
import { ApiException } from '../../common/exceptions/api.exception';
import { ApiErrorCode } from '../../common/enums/api-error-code.enum';

const destination = (req, file, cb) => {
  const { moduleName } = req.body;
  const mainPath = 'packages';
  if (!fs.existsSync(mainPath)) {
    fs.mkdirSync(mainPath);
  }
  const workPath = `packages/${moduleName}`;
  if (!fs.existsSync(workPath)) {
    fs.mkdirSync(workPath);
  }
  cb(null, `./packages/${moduleName}`);
};

const filename = (req, file, cb) => {
  const { moduleName, version } = req.body;
  const fileName = getFileName(moduleName, version);
  cb(null, `${fileName}_temp`);
};

const zipFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);

  if (ext !== '.zip') {
    return cb(
      new ApiException(
        '只能上传 zip 类型文件',
        ApiErrorCode.FILE_TYPE_INVALID,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }

  return cb(null, true);
};

@Controller('/')
@ApiUseTags('离线包')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post('getPackageInfoList')
  @ApiOperation({ title: '获取离线包列表' })
  async getPackageInfoList(@Body() dto: QueryPackageDto) {
    return await this.packageService.getPackageInfoList(dto);
  }

  @Post('pushPackageInfo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination,
        filename,
      }),
      fileFilter: zipFileFilter,
    }),
  )
  @ApiOperation({ title: '上传离线包' })
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', required: true })
  async pushPackageInfo(@Body() uploadInfo: CreatePackageDto) {
    const { moduleName, version } = uploadInfo;

    // 进行参数校验
    const lastVersion = await this.packageService.getLatestVersion(moduleName);
    if (lastVersion && lastVersion >= parseInt(version, 10)) {
      const tempFilePath =
        getFilePath(moduleName, parseInt(version, 10)) + '_temp';
      fs.unlinkSync(tempFilePath);
      throw new ApiException(
        '版本号不能低于或等于当前最新版本',
        ApiErrorCode.VERSION_INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.packageService.pushPackageInfo(uploadInfo, lastVersion);
  }

  @Post('stopPackage')
  @ApiOperation({ title: '终止发布某个离线包状态' })
  async stopPackage(@Body() dto: StopPackageDto) {
    return await this.packageService.stopPackage(dto.id);
  }

  @Get('getPackageIndex')
  @ApiOperation({ title: '获取最新版本离线包集合的json' })
  async getPackageIndex() {
    const latestPackageList = await this.packageService.getLatestPackageList();
    return {
      items: latestPackageList,
    };
  }
}
