import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmsArticle } from './cms-article.entity';
import { CmsService } from './cms.service';
import { CmsController } from './cms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CmsArticle])],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}