import { z } from 'zod';
import { CRAFT_SLUGS, LEVELS, OPPORTUNITY_TYPES } from '../config/constants.js';

const craftEnum = z.enum(CRAFT_SLUGS, {
  errorMap: () => ({ message: `Craft must be one of: ${CRAFT_SLUGS.join(', ')}` }),
});

// Case-insensitive level: "beginner" -> "Beginner"
const levelSchema = z
  .string()
  .transform((s) => LEVELS.find((l) => l.toLowerCase() === s.toLowerCase()))
  .refine(Boolean, { message: `Level must be one of: ${LEVELS.join(', ')}` });

const phone = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number (starts with 6-9)');

// The phone number is the login ID, so there is no separate username
const profileFields = {
  fullName: z.string().trim().min(2, 'Please enter your full name').max(80),
  age: z.coerce.number().int().min(14, 'Age should be at least 14').max(100, 'Age should be 100 or less'),
  location: z.object({
    city: z.string().trim().min(1, 'City is required').max(60),
    state: z.string().trim().min(1, 'State is required').max(60),
  }),
  primaryCraft: craftEnum,
  experienceYears: z.coerce.number().int().min(0, 'Experience cannot be negative').max(80),
  bio: z.string().trim().max(150, 'Bio must be 150 characters or less').default(''),
  craftStory: z.string().trim().max(2000, 'Craft story is too long').default(''),
};

const experienceNotAboveAge = (d) => d.age === undefined || d.experienceYears === undefined || d.experienceYears <= d.age;
const experienceIssue = { message: 'Experience cannot be more than your age', path: ['experienceYears'] };

export const registerSchema = z
  .object({
    phone,
    password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long'),
    ...profileFields,
  })
  .strict()
  .refine(experienceNotAboveAge, experienceIssue);

export const loginSchema = z
  .object({
    phone,
    password: z.string().min(1, 'Password is required'),
  })
  .strict();

// All profile fields optional; phone/password are NOT allowed here
export const updateProfileSchema = z
  .object({
    fullName: profileFields.fullName.optional(),
    age: profileFields.age.optional(),
    location: profileFields.location.partial().optional(),
    primaryCraft: craftEnum.optional(),
    experienceYears: profileFields.experienceYears.optional(),
    bio: z.string().trim().max(150, 'Bio must be 150 characters or less').optional(),
    craftStory: z.string().trim().max(2000).optional(),
  })
  .strict()
  .refine((d) => Object.keys(d).length > 0, { message: 'Nothing to update' })
  .refine(experienceNotAboveAge, experienceIssue);

export const craftParamSchema = z.object({ craft: craftEnum });

export const roadmapParamSchema = z.object({ craft: craftEnum, level: levelSchema });

export const stepParamSchema = z.object({
  craft: craftEnum,
  level: levelSchema,
  order: z.coerce.number().int().min(1, 'Step number must be 1 or more').max(20),
});

export const progressSchema = z
  .object({
    craft: craftEnum,
    level: levelSchema,
    order: z.coerce.number().int().min(1),
    completed: z.boolean().optional(), // omit to toggle
  })
  .strict();

export const opportunityQuerySchema = z.object({
  craft: craftEnum.optional(),
  type: z
    .string()
    .transform((s) => OPPORTUNITY_TYPES.find((t) => t.toLowerCase() === s.toLowerCase()))
    .refine(Boolean, { message: `Type must be one of: ${OPPORTUNITY_TYPES.join(', ')}` })
    .optional(),
  location: z.string().trim().max(60).optional(),
});
