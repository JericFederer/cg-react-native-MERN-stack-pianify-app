import * as yup from 'yup';

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