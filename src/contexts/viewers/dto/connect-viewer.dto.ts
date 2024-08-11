import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class ConnectViewerDto {
    
    @IsString()
    @IsOptional()
    userId: string;

    @IsString()
    activityId: string;
    
    @IsString()
    status: string;

    @IsBoolean()
    @IsOptional()
    unique?: boolean = false;
}
