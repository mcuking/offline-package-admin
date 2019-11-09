import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class StopPackageDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  id: number;
}
