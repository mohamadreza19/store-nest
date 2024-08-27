import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports:[ConfigModule,TypeOrmModule.forRootAsync({
        imports: [ConfigModule], // Ensure ConfigModule is imported
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          synchronize: true,
          ssl: true
        }),
      }),]
})
export class DatabaseModule {

}
