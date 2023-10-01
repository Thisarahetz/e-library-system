import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryContent } from './entities/categoryContent.entity';
import { ResponseData, generateResponse } from 'src/utility/response.utill';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(CategoryContent)
    private categoryContentRepository: Repository<CategoryContent>,

    @InjectRepository(Article)
    private articleRepository: Repository<Article> // readonly articleService: ArticleService,
  ) {}

  /**
   *
   * @body createCategoryDto
   * create new category with multiple languages using category and category content entities
   * @returns new user object
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<ResponseData<Category>> {
    const { parent_id: parentId, topic, type } = createCategoryDto;

    let _category = [];

    //check if the topic name is in parent in the topic
    if (parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent topic not found');
      }

      if (parentId) {
        const article = await this.articleRepository.findOne({
          where: { topicId: parentId },
        });

        if (article) {
          throw new BadRequestException('This topic is already assigned to an article');
        }
      }
    }

    for (const lang of Object.keys(topic)) {
      const categoryContent = this.categoryContentRepository.create({
        language: lang,
        topicName: topic[lang],
      });
      _category = [await this.categoryContentRepository.save(categoryContent), ..._category];
    }

    const category = this.categoryRepository.create({
      categoryContents: _category,
      parentId,
      type,
    });
    this.categoryRepository.save(category);

    //parentId null - sub topic eka update successfully
    return generateResponse(true, 200, `The new ${category.parentId ? 'sub' : ''} topic has been added successfully`);
  }

  /*
   * @returns all categories with their contents
   */
  async findAll(): Promise<ResponseData<Category[]>> {
    try {
      const categories = await this.categoryRepository.find({
        relations: ['categoryContents'],
      });

      return generateResponse(true, 200, 'Categories retrieved successfully', categories);
    } catch (error) {
      throw new HttpException(error.message || 'bad request', error.status || 500);
    }
  }

  /*
   * @param id
   * @returns category with given id
   */
  async findOne(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          categoryContents: true,
        },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      return generateResponse(true, 200, 'Categories retrieved successfully', category);
    } catch (error) {
      throw new HttpException(error.message || 'bad request', error.status || 500);
    }
  }

  /*
   * @param id
   * @param updateCategoryDto
   * @returns updated category with given id
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { parent_id: parentId, topic, type } = updateCategoryDto;

      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          categoryContents: true,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const catagoriesContents = category.categoryContents.map((content) => {
        return {
          ...content,
          topicName: topic[content.language],
        };
      });

      const updatedCategoryContents = await this.categoryContentRepository.save(catagoriesContents);

      const catagories = this.categoryRepository.create({
        id,
        parentId,
        type,
        categoryContents: updatedCategoryContents,
      });

      //category save
      await this.categoryRepository.save(catagories);

      //parentId null - sub topic eka update successfully
      return generateResponse(true, 200, `The ${category.parentId ? 'sub' : ''} topic has been updated successfully`);
    } catch (error) {
      throw new HttpException(error.message || 'bad request', error.status || 500);
    }
  }

  /*
   * @param id
   * @returns deleted category with given id
   */
  async remove(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: {
          categoryContents: true,
        },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }

      category.categoryContents.forEach(async (content) => {
        await this.categoryContentRepository.delete(content.id);
      });

      await this.categoryRepository.delete(id);

      return generateResponse(true, 200, `The ${category.parentId ? 'sub' : ''} topic has been deleted successfully`);
    } catch (error) {
      throw new HttpException(error.message || 'bad request', error.status || 500);
    }
  }
}
