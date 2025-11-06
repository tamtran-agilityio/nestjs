import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ExceptionService } from '../../common/exceptions/exception.service';
import { Role } from 'src/common/enums/role.enum';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let exceptionService: ExceptionService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
  };

  const mockExceptionService = {
    throwEntityNotFound: jest.fn(),
    throwDuplicateEntity: jest.fn(),
    ensureEntityExists: jest.fn((entity, name, id) => {
      if (!entity) {
        throw new Error(`${name} with id ${id} not found`);
      }
      return entity;
    }),
    ensureNoDuplicate: jest.fn((exists, field, value) => {
      if (exists) {
        throw new Error(`${field} ${value} already exists`);
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: ExceptionService,
          useValue: mockExceptionService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    exceptionService = module.get<ExceptionService>(ExceptionService);
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const createUserDto = {
        userName: 'testuser',
        email: 'testuser@example.com',
        password: 'securepassword',
        age: 30,
        isActive: true,
        roles: [Role.USER],
      };
      const savedUser = {
        id: 1,
        ...createUserDto,
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(savedUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          userName: 'user1',
          email: 'user1@example.com',
          isActive: true,
        },
        {
          id: 2,
          userName: 'user2',
          email: 'user2@example.com',
          isActive: false,
        },
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll(true, 0);

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: 1,
        userName: 'user1',
        email: 'user1@example.com',
        isActive: true,
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const mockUser = {
        id: 1,
        userName: 'user1',
        email: 'user1@example.com',
        isActive: true,
      };
      const updateUserDto = {
        userName: 'updatedUser',
      };
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
      };

      mockUserRepository.findOneBy.mockResolvedValueOnce(mockUser); // for findOne
      mockUserRepository.update.mockResolvedValue(undefined);
      mockUserRepository.findOneBy.mockResolvedValueOnce(updatedUser); // for returning updated user

      const result = await service.update(1, updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove the user', async () => {
      const mockUser = {
        id: 1,
        userName: 'user1',
        email: 'user1@example.com',
        isActive: true,
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: 1,
        userName: 'user1',
        email: 'user1@example.com',
        isActive: true,
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findByEmail('user1@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'user1@example.com',
      });
    });
  });
});
