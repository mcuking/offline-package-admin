import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetLatestPackageDto {
  @IsNotEmpty()
  @IsString()
  @ApiModelProperty()
  appName: string;
}
