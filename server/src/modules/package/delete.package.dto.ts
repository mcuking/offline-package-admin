import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class DeletePackageDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty()
  id: number;
}
