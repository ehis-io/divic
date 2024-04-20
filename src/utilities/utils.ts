import { v5 } from 'uuid';
import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';

export function randomNumber(
  min: number = 100000,
  max: number = 666666,
): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const makeUUID = (value: string) => {
  return v5(value, process.env.UUID_NAMESPACE);
};

export function generateChallenge(value?: number): string {
  // if (value == null) throw new BadRequestException();
  return crypto.randomBytes(32).toString('base64');
}
