export const prismaServiceMock = {
  user: {
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: Date.now().toString(),
        ...dto,
        createdAt: Date.now(),
        UpdateAt: Date.now(),
      }),
    ),

    findUnique: jest.fn().mockImplementation(() => {}),
  },
};
