import { object, string, number } from 'yup';

export const validationSchema = object({
  title: string().required(),
  description: string().required(),
  price: number().required(),
  count: number().required(),
});
