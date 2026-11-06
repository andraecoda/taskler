import { z } from 'zod';

// Mirrors backend/src/modules/contact/dto/create-contact-message.dto.ts
export const contactSchema = z.object({
  fullName: z.string().min(2, 'Full name is too short').max(120),
  email: z.string().email('Enter a valid email address').max(255),
  subject: z.string().max(200).optional().or(z.literal('')),
  message: z.string().min(10, 'Tell us a bit more (at least 10 characters)').max(5000),
});
export type ContactFormValues = z.infer<typeof contactSchema>;

// Mirrors backend/src/modules/newsletter/dto/subscribe-newsletter.dto.ts
export const newsletterSchema = z.object({
  email: z.string().email('Enter a valid email address').max(255),
});
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
