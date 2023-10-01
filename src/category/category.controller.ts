import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index';
// import { CheckPolicies } from 'src/policies/check-policies.decorator';
// import { PoliciesGuard } from 'src/policies/policies-guard';
// import { createCategoryPolicyHandler } from 'src/policies/category/create-category-policy-handler';
import { Roles } from 'src/auth/authorization/roles.decorator';
import { Role } from 'src/auth/enums';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createCategoryPolicyHandler)
  @Roles(Role.LIADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createCategoryPolicyHandler)
  @Roles(Role.LIADMIN)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createCategoryPolicyHandler)
  @Roles(Role.LIADMIN)
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createCategoryPolicyHandler)
  @Roles(Role.LIADMIN)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies(createCategoryPolicyHandler)
  @Roles(Role.LIADMIN)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
