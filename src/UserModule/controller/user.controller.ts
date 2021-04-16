import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserMapper } from '../mapper/user.mapper';
import {
  ApiBearerAuth,
  ApiBody,
  ApiGoneResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RoleEnum } from '../../SecurityModule/enum/role.enum';
import { SecurityService } from '../../SecurityModule/service/security.service';
import { AdminChangePasswordDTO } from '../dto/admin-change-password.dto';
import { ChangePasswordRequestIdDTO } from '../dto/change-password-request-id.dto';
import { ForgotPasswordDTO } from '../dto/forgot-password';
import { ChangePasswordForgotFlowDTO } from '../dto/change-password-forgot-flow.dto';
import { UserDTO } from '../dto/user.dto';
import { NewUserDTO } from '../dto/new-user.dto';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { Constants } from '../../CommonsModule/constants';
import { RoleGuard } from '../../CommonsModule/guard/role.guard';
import {
  NeedPolicies,
  NeedRoles,
} from '../../CommonsModule/decorator/role-guard-metadata.decorator';

@ApiTags('User')
@ApiBearerAuth()
@Controller(
  `${Constants.API_PREFIX}/${Constants.API_VERSION_1}/${Constants.USER_ENDPOINT}`,
)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly service: UserService,
    private readonly mapper: UserMapper,
    @Inject(forwardRef(() => SecurityService))
    private readonly securityService: SecurityService,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get Users', description: 'Get all users' })
  @ApiOkResponse({ type: NewUserDTO, isArray: true, description: 'All users' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/GET_ALL_USERS`)
  @UseGuards(RoleGuard)
  public async getAll(): Promise<UserDTO[]> {
    return this.mapper.toDtoList(await this.service.getAll());
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOkResponse({ type: NewUserDTO })
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOperation({ summary: 'Find user by id', description: 'Find user by id' })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(
    '@AUTHORIZATION-RESOURCE-SERVER/GET-USER',
    `${Constants.POLICY_PREFIX}/GET_ALL_USERS`,
  )
  public async findById(@Param('id') id: UserDTO['id']): Promise<UserDTO> {
    this.logger.log(`user id: ${id}`);
    return this.mapper.toDtoAsync(await this.service.findById(id));
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Add user', description: 'Creates a new user' })
  @ApiBody({ type: NewUserDTO })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/CREATE_USER`)
  public async add(@Body() user: NewUserDTO): Promise<UserDTO> {
    this.logger.log(`user: ${user}`);
    return this.mapper.toDto(await this.service.add(user));
  }

  @Put(':id')
  @HttpCode(200)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
    description: 'User id',
  })
  @ApiOperation({ summary: 'Update user', description: 'Update user by id' })
  @ApiOkResponse({ type: UserDTO })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have ADMIN role',
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/UPDATE_USER`)
  public async update(
    @Param('id') id: string,
    @Body() userUpdatedInfo: UserUpdateDTO,
  ): Promise<UserDTO> {
    this.logger.log(`user id: ${id}, new user information: ${userUpdatedInfo}`);
    return this.mapper.toDto(await this.service.update(id, userUpdatedInfo));
  }

  @Put(':id/change-password')
  @HttpCode(200)
  @ApiOkResponse({ type: UserDTO })
  @ApiOperation({
    summary: 'change-password',
    description: 'Changes password from an authenticated user',
  })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description: `throw if there is not an authorization token, if authorization token does not have STUDENT role or if the id param is different from the user id`,
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/CHANGE_USER_PASSWORD`)
  public async changeUserPassword(
    @Param('id') id: string,
    @Body() changePassword: AdminChangePasswordDTO,
  ): Promise<UserDTO> {
    this.logger.log(`user id: ${id}`);
    return this.mapper.toDto(
      await this.service.adminChangePassword(id, changePassword),
    );
  }

  @Post('/forgot-password')
  @HttpCode(200)
  @ApiOkResponse({ type: ChangePasswordRequestIdDTO })
  @ApiOperation({
    summary: 'Create change password request',
    description: 'Create change password request',
  })
  @ApiNotFoundResponse({ description: 'thrown if user is not found' })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/FORGOT_PASSWORD`)
  public async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<ChangePasswordRequestIdDTO> {
    this.logger.log(`forgot password: ${forgotPasswordDTO}`);
    const forgotPasswordRequestId = await this.service.forgotPassword(
      forgotPasswordDTO,
    );
    return { id: forgotPasswordRequestId };
  }

  @Get('/forgot-password/:changePasswordRequestId/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Validate change password request',
    description:
      'validate change password expiration time. If time is not expired, 200 is returned',
  })
  @ApiGoneResponse({
    description: 'thrown if change password request time is up',
  })
  @ApiNotFoundResponse({
    description: 'thrown if change password request is not found',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @UseGuards(RoleGuard)
  @NeedRoles(RoleEnum.ADMIN)
  @NeedPolicies(
    `${Constants.POLICY_PREFIX}/VALIDATE_CHANGE_PASSWORD_EXPIRATION_TIME`,
  )
  public async validateChangePasswordExpirationTime(
    @Param('changePasswordRequestId') changePasswordRequestId: string,
  ): Promise<void> {
    this.logger.log(`change password request id: ${changePasswordRequestId}`);
    await this.service.validateChangePassword(changePasswordRequestId);
  }

  @Post('/forgot-password/:changePasswordRequestId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'change password on forgot password flow',
  })
  @ApiNotFoundResponse({
    description: 'thrown if change password request is not found',
  })
  @ApiUnauthorizedResponse({
    description:
      'thrown if there is not an authorization token or if authorization token does not have EXTERNAL role',
  })
  @NeedRoles(RoleEnum.ADMIN, RoleEnum.EXTERNAL)
  @NeedPolicies(`${Constants.POLICY_PREFIX}/CHANGE_PASSWORD`)
  @UseGuards(RoleGuard)
  public async changePassword(
    @Param('changePasswordRequestId') changePasswordRequestId: string,
    @Body() changePasswordDTO: ChangePasswordForgotFlowDTO,
  ): Promise<void> {
    this.logger.log(
      `change password request id: ${changePasswordRequestId}, change password information: ${changePasswordDTO}`,
    );
    await this.service.changePasswordForgotPasswordFlow(
      changePasswordRequestId,
      changePasswordDTO,
    );
  }
}
