export const ErrorEnum = {
  USER_NOT_FOUND: {
    message: 'User not found',
    errorCode: 'USER_NOT_FOUND',
  },
  ROLE_NOT_FOUND: {
    message: 'Role not found',
    errorCode: 'ROLE_NOT_FOUND',
  },
};

export type ErrorEnumKey = keyof typeof ErrorEnum;
