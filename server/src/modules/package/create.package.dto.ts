import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  @MaxLength(10, { message: '不能超过10个字' })
  moduleName: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  version: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  @MaxLength(150, { message: '不能超过150个字' })
  updateLog: string;
}
