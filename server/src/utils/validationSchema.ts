import * as yup from 'yup';
import { isValidObjectId } from 'mongoose';
import { categories } from './audio_category';

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

export const AudioValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing."),
  about: yup.string().required("About is missing."),
  category: yup
    .string()
    .oneOf(categories, "Invalid category.")
    .required("Category is missing."),
});

export const NewPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  audioId: yup.string().transform(
    function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : "";
    }
  ),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!")
    .required("Visibility is missing!"),
});

export const OldPlaylistValidationSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  // * Audio ID validation
  item: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  // * Playlist ID validation
  id: yup.string().transform(function (value) {
    return this.isType(value) && isValidObjectId(value) ? value : "";
  }),
  visibility: yup
    .string()
    .oneOf(["public", "private"], "Visibility must be public or private!"),
  // .required("Visibility is missing!"),
});

export const UpdateHistorySchema = yup.object().shape({
  audio: yup
    .string()
    .transform(function (value) {
      return this.isType(value) && isValidObjectId(value) ? value : "";
    })
    .required("Invalid audio id."),
  progress: yup.number().required("History progress is missing."),
  date: yup
    .string()
    .transform(function (value) {
      const date = new Date(value);
      if (date instanceof Date) return value;
      return "";
    })
    .required("Invalid date."),
});