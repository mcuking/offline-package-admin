import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class QueryPackageDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  size: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  @MaxLength(10, { message: '不能超过10个字' })
  moduleName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty()
  @MaxLength(10, { message: '不能超过10个字' })
  appName: string;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty()
  status: number;
}
