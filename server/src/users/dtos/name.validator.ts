import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "IsUsername", async: false })
export class IsUsername implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return /^([a-zA-Z])[0-9a-zA-Z_]{3,}$/!.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid username`;
  }
}
