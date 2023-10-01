import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { validate } from 'class-validator';
// import { PoliciesGuard } from 'src/policies/policies-guard';
// import { CheckPolicies } from 'src/policies/check-policies.decorator';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/enums';
// import { createArticlePolicyHandler } from 'src/policies/article/article-category-policy-handler';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UsePipes(ValidationPipe)
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(id, updateArticleDto);
  }

  @Delete(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Get('topic/:id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createArticlePolicyHandler)
  @Roles(Role.LIADMIN)
  findByTopicId(@Param('id') id: string) {
    return this.articleService.findByTopicId(id);
  }

  @Get('search/:searchQuery')
  search(@Query() search: Search) {
    return this.articleService.search(search);
  }
}
