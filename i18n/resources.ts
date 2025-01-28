import { AuthForgotPasswordEn, AuthForgotPasswordEs, AuthSignUpEn, AuthSignUpEs, AuthValidationsEn, AuthValidationsEs, EntryTranslationEn, EntryTranslationEs, ErrorsEn, ErrorsEs, OnboardingEn, OnboardingEs, SignInTranslationsEn, SignInTranslationsEs, } from "@/locales";


export const resources = {
  en: {
    auth: {
      entry: EntryTranslationEn,
      signin: SignInTranslationsEn,
      signup: AuthSignUpEn,
      validations: AuthValidationsEn,
      forgot_password: AuthForgotPasswordEn,
      onboarding: OnboardingEn
    },
    utils: ErrorsEn
  },
  es: {
    auth: {
      entry: EntryTranslationEs,
      signin: SignInTranslationsEs,
      signup: AuthSignUpEs,
      validations: AuthValidationsEs,
      forgot_password: AuthForgotPasswordEs,
      onboarding: OnboardingEs
    },
    utils: ErrorsEs
  }
};