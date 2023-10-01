import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { ForbiddenError } from '@casl/ability';
// import { UpdateUserPsw } from './dto/update-psw-input';
import { Action } from './entities/action.entity';
import { UserFeatureCategory } from './entities/user-feature-category.entity';
import * as bcrypt from 'bcrypt';
import { MailingService } from 'src/mail/mailing.service';
import { UpdatePasswordDto, UpdateProfileDto } from './dto';
import { generateResponse } from 'src/utility/response.utill';
import { AuthService } from 'src/auth/auth.service';
import { log } from 'console';
import { Role } from 'src/auth/enums';

@Injectable()
export class UserService {
  //verify password
  async verifyPassword(password: string, password1: string) {
    try {
      const passwordMatches = await bcrypt.compare(password, password1);

      if (passwordMatches) {
        return true;
      }
      return false;
    } catch (error) {
      throw new ForbiddenException('Not valid Password', error.message);
    }
  }

  //encrypt password
  async hashPassword(password: string) {
    const saltRounds = 10;

    const hashedPassword: string = await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) reject(err);
        resolve(hash);
      });
    });

    return hashedPassword;
  }

  //generate random password
  async generatePassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_+=<>?';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Action)
    private actionsRepository: Repository<Action>,
    @InjectRepository(UserFeatureCategory)
    private userFeatureCategory: Repository<UserFeatureCategory>,

    readonly mailingService: MailingService,
    @Inject(forwardRef(() => AuthService))
    readonly authService: AuthService
  ) {}

  //update profile
  async updateProfile(id: string, updateUserDto: UpdateProfileDto) {
    try {
      const { profile_image, new_password, old_password } = updateUserDto;

      //check password
      if (new_password && !old_password) {
        throw new BadRequestException('Old password is required');
      }

      const user = await this.findOneById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      //check if old password is correct
      if (new_password && old_password) {
        const passwordMatches = await this.verifyPassword(old_password, user.password);
        if (!passwordMatches) {
          throw new ForbiddenException('Invalid old password');
        }

        if (new_password && old_password) user.password = await this.hashPassword(new_password);
      }

      if (profile_image) user.profileImage = profile_image;

      await this.usersRepository.save(user);

      return generateResponse(true, 200, 'Profile updated successfully');
    } catch (error) {
      throw new BadRequestException(error.message, error.status || 500);
    }
  }

  //find user by id
  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['userFeatureCategorys.actions'],
        where: { id: id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find user by id without password
  async findOneByIdWithoutPassword(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['userFeatureCategorys.actions'],
        where: { id: id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      delete user.password;

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //find user by email
  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      relations: ['userFeatureCategorys', 'userFeatureCategorys.actions'],

      where: { email: email },
    });
  }

  //find user by email without password
  async getOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['userFeatureCategorys', 'userFeatureCategorys.actions'],

      where: { email: email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    delete user.password;

    return user;
  }

  //find all users with actions
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: ['userFeatureCategorys', 'userFeatureCategorys.actions'],
      select: ['id', 'username', 'employeeId', 'userId', 'email', 'lastName', 'role', 'status'],
    });
  }

  /**
   *
   * @param userDetails
   * @returns
   */
  async createUser(userDetails: CreateUserDto): Promise<any> {
    try {
      const { username, user_id, employee_id: emplyeeId, email, role, actions, status } = userDetails;

      //check if email exists exists the where role is not admin
      const existingUserWithEmail = await this.usersRepository.find({
        where: {
          email: email,
          role: role,
        },
      });

      if (existingUserWithEmail && existingUserWithEmail.length > 0) {
        throw new BadRequestException('Email already exists');
      }

      if (role === Role.CALL_AGENTS) {
        // Check if employee id already exists
        const existingUserWithEmployeeId = await this.usersRepository.findOneBy({ employeeId: emplyeeId });

        if (existingUserWithEmployeeId) {
          throw new BadRequestException('Employee ID already exists f');
        }
      }

      if (role === Role.ADMIN) {
        // Check if user id already exists
        const existingUserWithUserId = await this.usersRepository.findOneBy({ userId: user_id });

        if (existingUserWithUserId) {
          throw new BadRequestException('User ID already exists');
        }
      }

      // action.map((item) => {})
      let action = [];

      //save actions
      actions.forEach(async (_action) => {
        const _actions = this.actionsRepository.create({
          action: _action.action,
          categoryId: _action.category_id,
          categoryName: _action.category_name,
          categoryType: _action.category_type,
        });
        action.push(await this.actionsRepository.save(_actions));
      });

      const users = this.usersRepository.create({
        email,
        employeeId: emplyeeId,
        role,
        password: null,
        username,
        userId: user_id,
        lastName: null,
        status: status,
      });

      //save user
      const savedUser = await this.usersRepository.save(users);

      const userFeatureCategory = this.userFeatureCategory.create({
        users: [savedUser],
        actions: action,
      });

      //save user feature category
      await this.userFeatureCategory.save(userFeatureCategory);

      if (status) {
        await this.sendEmail(savedUser, 'Account Created successfully!', 'Account Created');
      }

      return generateResponse(true, 200, 'The new user has been added successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update user
   * @param id
   * @param updateUserDto
   * @returns null
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const { actions, email, employee_id: emplyeeId, role, status, user_id, username } = updateUserDto;

      const user = await this.usersRepository.findOne({
        relations: ['userFeatureCategorys', 'userFeatureCategorys.actions'],
        where: { id: id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      //check if email exists exists the use mail

      if (user.role === Role.CALL_AGENTS) {
        // Check if employee id already exists
        const existingUserWithEmployeeId = await this.usersRepository.findOneBy({ employeeId: emplyeeId });

        if (existingUserWithEmployeeId && user.employeeId !== emplyeeId) {
          throw new BadRequestException('Employee ID already exists');
        }
      }

      if (user.role === Role.ADMIN) {
        // Check if user id already exists
        const existingUserWithUserId = await this.usersRepository.findOneBy({ userId: user_id });

        if (existingUserWithUserId && user.userId !== user_id) {
          throw new BadRequestException('User ID already exists');
        }
      }

      let _action = [];

      //update actions
      if (actions && actions.length > 0) {
        for (const item of actions) {
          let action = null;

          //get exists action
          action = await this.actionsRepository.findOne({
            where: {
              id: item.id,
            },
          });

          //if action exists update it
          if (action) {
            let updatedAction = await this.actionsRepository.save({
              id: item.id,
              action: item.action,
              categoryId: item.category_id,
              categoryName: item.category_name,
              categoryType: item.category_type,
            });
            _action.push(updatedAction);
          } else {
            let newAction = await this.actionsRepository.save({
              action: item.action,
              categoryId: item.category_id,
              categoryName: item.category_name,
              categoryType: item.category_type,
            });
            _action.push(newAction);
          }
        }
      }

      //update user
      user.username = username ? username : user.username;
      user.employeeId = emplyeeId ? emplyeeId : user.employeeId;
      user.userId = user_id ? user_id : user.userId;
      user.email = email ? email : user.email;
      user.role = role ? role : user.role;
      user.status = status;

      if (status && !user.isActive) {
        //password remove
        // user.password = null;
        await this.sendEmail(user, 'Account activated successfully!', 'Account Activated');
      }

      if (status) user.isActive = true;
      if (!status) user.isActive = false;

      // await this.usersRepository.save(user);

      //update user feature category
      const userFeatureCategory = await this.userFeatureCategory.findOne({
        where: {
          users: {
            id: user.id,
          },
        },
      });

      if (!userFeatureCategory) throw new NotFoundException('User feature category not found');

      const users = await this.usersRepository.save(user);

      //update user feature category
      if (userFeatureCategory) userFeatureCategory.actions = _action;
      if (userFeatureCategory) userFeatureCategory.users = [users];

      await this.userFeatureCategory.save(userFeatureCategory);

      return generateResponse(true, 200, 'The user has been updated successfully');
    } catch (error) {
      return generateResponse(false, error.status || 500, error.message);
    }
  }

  //update user password
  async resetPassword(token: string, new_password: string): Promise<any> {
    //verify token
    const decoded = await this.authService.verifyToken(token);

    const { id } = decoded;

    // encrypt password
    const newPassword = await this.hashPassword(new_password);

    try {
      const user = await this.findOneById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.password = newPassword;
      user.isActive = true;

      await this.usersRepository.save(user);

      return generateResponse(true, 200, 'Password updated successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //forgot password
  async forgotPassword(email: string): Promise<any> {
    try {
      const user = await this.findOneByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      //send email
      await this.sendEmail(user, 'Password reset link', 'Password Reset');

      return generateResponse(true, 200, 'Email sent successfully');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //delete user
  async remove(id: string): Promise<void> {
    try {
      const user = await this.findOneById(id);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.usersRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserPermission(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        relations: ['userFeatureCategorys', 'userFeatureCategorys.actions'],
        where: { id: id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { userFeatureCategorys } = user;

      return generateResponse(true, 200, 'User permissions retrieved successfully', userFeatureCategorys);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //send email
  async sendEmail(user: User, topic: string, subject: string): Promise<any> {
    const { email, id, username, role } = user;

    //generate token for email verification
    const token = await this.authService.generateToken({ id: id, username: username, role: role }, '15m');

    try {
      const options = {
        email: email,
        token: token,
        topic: topic,
      };

      //send email
      await this.mailingService.sendMail(subject, options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
