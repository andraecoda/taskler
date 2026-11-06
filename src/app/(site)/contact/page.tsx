'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eyebrow } from '@/components/premium/SectionHeading';
import { Alert } from '@/components/ui/Alert';
import { PremiumButton } from '@/components/premium/Button';
import { Card } from '@/components/premium/Card';
import { PremiumFormField } from '@/components/premium/FormField';
import { PremiumInput, PREMIUM_INPUT_CLASSES } from '@/components/premium/Input';
import { submitContactMessage } from '@/features/marketing/api';
import { contactSchema, type ContactFormValues } from '@/features/marketing/schemas';
import { getErrorMessage } from '@/lib/error-message';

export default function ContactPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    setServerError(null);
    try {
      const result = await submitContactMessage({
        fullName: values.fullName,
        email: values.email,
        subject: values.subject || undefined,
        message: values.message,
      });
      setSuccessMessage(result.message);
      reset();
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  return (
    <section className="px-6 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>Get in touch</Eyebrow>
        <h1 className="mt-3.5 font-pd-display text-[32px] font-semibold leading-[1.1] tracking-[-.02em] text-pd-text sm:text-[40px]">
          Contact us
        </h1>
        <p className="mt-4 flex items-center gap-2 text-[15px] text-pd-text-muted">
          <Mail className="h-4 w-4" aria-hidden />
          You can also reach us directly at{' '}
          <a href="mailto:hello@kobo.app" className="font-medium text-pd-accent hover:text-pd-accent/80">
            hello@kobo.app
          </a>
        </p>

        <Card className="mt-10">
          {successMessage && (
            <div className="mb-4">
              <Alert variant="success">{successMessage}</Alert>
            </div>
          )}
          {serverError && (
            <div className="mb-4">
              <Alert variant="error">{serverError}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <PremiumFormField label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
              <PremiumInput id="fullName" autoComplete="name" hasError={!!errors.fullName} {...register('fullName')} />
            </PremiumFormField>

            <PremiumFormField label="Email" htmlFor="email" error={errors.email?.message}>
              <PremiumInput
                id="email"
                type="email"
                autoComplete="email"
                hasError={!!errors.email}
                {...register('email')}
              />
            </PremiumFormField>

            <PremiumFormField label="Subject (optional)" htmlFor="subject" error={errors.subject?.message}>
              <PremiumInput id="subject" hasError={!!errors.subject} {...register('subject')} />
            </PremiumFormField>

            <PremiumFormField label="Message" htmlFor="message" error={errors.message?.message}>
              <textarea
                id="message"
                rows={5}
                className={`${PREMIUM_INPUT_CLASSES} ${errors.message ? 'border-red-400 bg-red-50/50' : 'border-hairline-strong focus:border-pd-accent/50'}`}
                {...register('message')}
              />
            </PremiumFormField>

            <PremiumButton type="submit" isLoading={isSubmitting} className="w-full">
              Send message
            </PremiumButton>
          </form>
        </Card>
      </div>
    </section>
  );
}
