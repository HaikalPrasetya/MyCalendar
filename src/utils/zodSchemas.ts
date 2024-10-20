import z from "zod";
import { conformZodMessage } from "@conform-to/zod";

export const OnboardingValidationSchema = z.object({
  fullName: z.string().min(3).max(150),
  username: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, number and -",
    }),
});

export const OnboardingAsyncValidationSchema = (options: {
  isUsernameIsUnique: () => Promise<boolean>;
}) => {
  return z.object({
    username: z
      .string()
      .min(3)
      .max(150)
      .regex(/^[a-zA-Z0-9-]+$/, {
        message: "Username can only contain letters, number and -",
      })
      .pipe(
        z.string().superRefine((_, ctx) => {
          if (typeof options?.isUsernameIsUnique !== "function") {
            ctx.addIssue({
              code: "custom",
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUsernameIsUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: "custom",
                message: "Username is already used",
              });
            }
          });
        })
      ),
    fullName: z.string().min(3).max(150),
  });
};

export const SettingsValidationSchema = z.object({
  fullName: z.string().min(3).max(150),
  imageUrl: z.string(),
});

export const NewEventValidationSchema = z.object({
  title: z.string().min(3).max(150),
  url: z.string().min(3).max(50),
  description: z.string().min(3).max(300),
  duration: z.number().min(15),
  videoCallProviders: z.string(),
});
