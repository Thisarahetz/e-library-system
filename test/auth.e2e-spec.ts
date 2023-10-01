import { HttpStatus } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/entities/user.entity';
import * as request from 'supertest';

// import { User } from '';

describe('AuthController (e2e)', () => {
  const authUrl = `http://localhost:8000/api/auth`;

  const mockUser: User = {
    email: 'test@gmail.com',
    lastName: 'test',
    employeeId: 'test',
    userId: 'test',
    username: 'test',
    password: 'test',
    role: 'test',
    status: true,
    userFeatureCategorys: null,
    id: 'test',
  };

  // describe('/auth/signup (POST)', () => {
  //   it('it should register a user and return the new user object', () => {
  //     return request(authUrl)
  //       .post('/signup')
  //       .set('Accept', 'application/json')
  //       .send(mockUser)
  //       .expect((response: request.Response) => {
  //         const { id, firstName, lastName, password, email, role } =
  //           response.body;

  //         expect(typeof id).toBe('string'),
  //           expect(firstName).toEqual(mockUser.firstName),
  //           expect(lastName).toEqual(mockUser.lastName),
  //           expect(email).toEqual(mockUser.email),
  //           expect(password).toBeUndefined();
  //         expect(imagePath).toBeNull();
  //         expect(role).toEqual('user');
  //       })
  //       .expect(HttpStatus.CREATED);
  //   });

  //   it('it should not register a new user if the passed email already exists', () => {
  //     return request(authUrl)
  //       .post('/signup')
  //       .set('Accept', 'application/json')
  //       .send(mockUser)
  //       .expect(HttpStatus.BAD_REQUEST);
  //   });
  // });

  describe('/auth/login (POST)', () => {
    it('it should not log in nor return a JWT for an unregistered user', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'layoutadmin@gmail.com', password: 'ses' })
        .expect((response: request.Response) => {
          const { access_token }: { access_token: string } = response.body;

          expect(access_token).toBeUndefined();
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('it should log in and return a JWT for a registered user', () => {
      return request(authUrl)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'layoutadmin@gmail.com', password: '123456789' })
        .expect((response: request.Response) => {
          const { access_token }: { access_token: string } = response.body;

          expect(jwt.verify(access_token, 'LAYOIUTINDEXLAYERJWTSECRET/s')).toBeTruthy();
        })
        .expect(HttpStatus.CREATED);
    });
  });
});
