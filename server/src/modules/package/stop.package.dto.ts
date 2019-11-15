import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class StopPackageDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  id: number;
}
