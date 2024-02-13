import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';

@Injectable()
export class ValidateInputPipe extends ValidationPipe {
  async transform(value: Record<string, any>, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new UnprocessableEntityException(
          ValidateInputPipe.handleError(e.getResponse()),
        );
      }
    }
  }

  private static handleError(errors) {
    const mappedErrors = errors.message.map((error: string) => error);
    return mappedErrors[0];
  }
}
