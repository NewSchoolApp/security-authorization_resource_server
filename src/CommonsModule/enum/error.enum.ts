export const ErrorEnum = {
  USER_NOT_FOUND: {
    message: 'Usuário não encontrado',
    errorCode: 'USER_NOT_FOUND',
  },
};

export type ErrorEnumKey = keyof typeof ErrorEnum;
