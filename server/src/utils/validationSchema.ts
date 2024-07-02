import * as yup from 'yup';
import { isValidObjectId } from 'mongoose';

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name field is empty.")
    .min(3, "Name must have 3 to 15 characters.")
    .max(15, "Name must have 3 to 15 characters."),
  email: yup
    .string()
    .required("Email field is empty.")
    .email("Email provided is invalid"),
  password: yup
    .string()
    .trim()
    .required("Password field is empty.")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[1-9]).{3,}$/, "Password must have a minimum of 3 characters and must also have numerical characters.")
});

export const TokenAndIDValidationSchema = yup.object().shape({
  token : yup
    .string()
    .trim()
    .required("Invalid token."),
  userId : yup
    .string()
    .transform(function(value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value
      }
      return "";
    })
    .required("Invalid userId")
});

export const UpdatePasswordSchema = yup.object().shape({
  token : yup
    .string()
    .trim()
    .required("Invalid token."),
  userId : yup
    .string()
    .transform(function(value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value
      }
      return "";
    })
    .required("Invalid userId."),
  password: yup
    .string()
    .trim()
    .required("Password field is empty.")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[1-9]).{3,}$/, "Password must have a minimum of 3 characters and must also have numerical characters.")
});

export const SignInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email field is empty.")
    .email("Email provided is invalid"),
  password: yup
    .string()
    .trim()
    .required("Password field is empty."),
})