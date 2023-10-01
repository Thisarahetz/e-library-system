import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleContent } from './entities/articleContent.entity';
import { UploadFile } from './entities/upload.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import { CategoryService } from 'src/category/category.service';
import { generateResponse } from 'src/utility/response.utill';
import { AwsService } from 'src/upload/services/aws.services';

interface Search {
  page: number;
  limit: number;
  searchQuery?: string;
}

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(ArticleContent)
    private articleContentRepository: Repository<ArticleContent>,
    @InjectRepository(UploadFile)
    private uploadFileRepository: Repository<UploadFile>,

    private readonly categoryService: CategoryService,
    private readonly awsService: AwsService
  ) { }

  /**
   * Insert articles and article content
   * @param createArticleDto
   * @returns
   */
  async create(createArticleDto: CreateArticleDto) {
    try {
      const { article, upload_content, topic_id } = createArticleDto;

      //is topic_id exist?
      const topic = await this.categoryService.findOne(topic_id);

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }

      //temp array for save article content
      let articleContent = [];

      //save article content
      for (const article_content of article) {
        const { title, description, language } = article_content;

        const createArticleContent = this.articleContentRepository.create({
          title,
          description,
          language,
        });

        //save article content
        const saveArticleContent = await this.articleContentRepository.save(createArticleContent);
        articleContent.push(saveArticleContent);
      }

      let _saveUploadFile = [];

      //save upload file url
      for (const uploadContent of upload_content) {
        const createUploadFile = this.uploadFileRepository.create({
          key: uploadContent.key,
          name: uploadContent.name,
          size: uploadContent.size,
          fileType: uploadContent.fileType,
        });
        //save upload file
        const saveUploadFile = await this.uploadFileRepository.save(createUploadFile);
        _saveUploadFile.push(saveUploadFile);
      }

      // const uploadFile = this.uploadFileRepository.create({ uploadContent: upload_content });
      // const saveUploadFile = await this.uploadFileRepository.save(uploadFile);

      //save article
      const createArticle = this.articleRepository.create({
        topicId: topic_id,
        articleContent,
        uploadFile: _saveUploadFile,
      });
      await this.articleRepository.save(createArticle);

      return generateResponse(true, 200, 'Article created successfully');
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /*
   * Get all articles
   */
  async findAll() {
    try {
      const articles = await this.articleRepository.find({
        relations: ['articleContent', 'uploadFile'],
      });

      let articleList = [];

      for (const article of articles) {
        const topicName = await this.categoryService.findOne(article.topicId);
        articleList.push({ ...article, topicName: topicName.data.categoryContents, topicType: topicName.data.type });
      }

      return generateResponse(true, 200, 'Articles retrieved successfully', articleList);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /**
   * Find one article using id
   * @param id
   * @returns
   */
  async findOne(id: number) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['articleContent', 'uploadFile'],
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      return article;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /**
   * update article
   * @param id
   * @param updateArticleDto
   * @returns
   */
  async update(id: number, updateArticleDto: UpdateArticleDto) {
    try {
      const { article, upload_content } = updateArticleDto;

      //is article exist?
      const articleExist = await this.findOne(id);

      if (!articleExist) {
        throw new NotFoundException('Article not found');
      }

      //temp array for save article content
      let articleContent = [];

      //update article content
      for (const article_content of article) {
        const { id, title, description, language } = article_content;

        if (!id) {
          const createArticleContent = this.articleContentRepository.create({
            title,
            description,
            language,
          });

          //save article content
          const saveArticleContent = await this.articleContentRepository.save(createArticleContent);
          articleContent.push({
            id: saveArticleContent.id,
            title: saveArticleContent.title,
            description: saveArticleContent.description,
            language: saveArticleContent.language,
          });
        } else {
          //is article content exist?
          const articleContentExist = await this.articleContentRepository.findOne({ where: { id } });

          if (!articleContentExist) {
            throw new NotFoundException('Article content not found');
          }

          //update existing article content
          articleContent.push(
            await this.articleContentRepository.save({
              id,
              title,
              description,
              language,
            })
          );
        }
      }

      //get number of id from article content upload file
      const upload_contents = upload_content.map((upload_content) => upload_content.id);

      //delete upload file IN NOT IN upload_contents
      for (const uploadContent of articleExist.uploadFile) {
        if (!upload_contents.includes(uploadContent.id)) {
          await this.uploadFileRepository.delete(uploadContent.id);

          //delete file from aws
          await this.awsService.deleteFile(uploadContent.key);
        }
      }

      //update upload file url
      for (const uploadContent of upload_content) {
        const { id, key, name, size, fileType } = uploadContent;

        if (!id) {
          const createUploadFile = this.uploadFileRepository.create({
            key,
            name: name,
            size: size,
            fileType,
          });

          //save upload file
          const saveUploadFile = await this.uploadFileRepository.save(createUploadFile);
          articleExist.uploadFile.push(saveUploadFile);
        }
      }

      articleExist.articleContent = articleContent;

      //update article
      await this.articleRepository.save(articleExist);

      return generateResponse(true, 200, 'Article updated successfully');
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const article = await this.articleRepository.findOne({
        where: { id },
        relations: ['articleContent', 'uploadFile'],
      });

      if (!article) {
        throw new NotFoundException('Article not found');
      }

      if (article && article.articleContent.length > 0) {
        // delete article content and upload file
        await this.articleContentRepository.delete(article.articleContent?.map((articleContent) => articleContent.id));
      }

      if (article && article.uploadFile.length > 0) {
        //delete upload file from aws
        for (const uploadFile of article?.uploadFile) {
          await this.awsService.deleteFile(uploadFile.key);
        }

        //delete upload file
        await this.uploadFileRepository.delete(article.uploadFile?.map((uploadFile) => uploadFile.id));
      }

      //delete article
      await this.articleRepository.delete(id);

      return generateResponse(true, 200, 'Article deleted successfully');
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /**
   *
   * @param topic_id
   * @returns Topic[]
   */
  async findByTopicId(topic_id: string) {
    try {
      const articles = await this.articleRepository.find({
        where: { topicId: topic_id },
        relations: ['articleContent', 'uploadFile'],
      });

      if (!articles || articles.length === 0) {
        throw new NotFoundException('Articles not found');
      }

      let articleList = [];

      //get topic name
      for (const article of articles) {
        const topicName = await this.categoryService.findOne(article.topicId);
        articleList.push({ ...article, topicName: topicName.data.categoryContents });
      }

      return generateResponse(true, 200, 'Articles retrieved successfully', articleList);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  /**
   *
   * @param search
   * @returns
   */
  async search(search: Search) {
    try {
      const { page, limit, searchQuery } = search;

      const skip = (page - 1) * limit;

      const articles = await this.articleRepository.findAndCount({
        where: {
          articleContent: {
            title: ILike(`%${searchQuery}%`),
          },
        },
        relations: ['articleContent', 'uploadFile'],
        take: limit,
        skip: skip,
      });

      if (!articles) {
        throw new NotFoundException('Articles not found');
      }

      return generateResponse(true, 200, 'Articles retrieved successfully', articles);
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
