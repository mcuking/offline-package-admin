import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreatePackageDto {
  @IsNotEmpty({ message: '必填项' })
  @IsString()
  @ApiModelProperty()
  moduleName: string;

  @IsNotEmpty({ message: '必填项' })
  @ApiModelProperty()
  version: number;

  @IsNotEmpty({ message: '必填项' })
  @IsString()
  @ApiModelProperty()
  updateLog: string;

  @IsNotEmpty({ message: '必填项' })
  file: any;
}
