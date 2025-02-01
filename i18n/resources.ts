import { AuthForgotPasswordEn, AuthForgotPasswordEs, AuthSignUpEn, AuthSignUpEs, AuthValidationsEn, AuthValidationsEs, EntryTranslationEn, EntryTranslationEs, ErrorsEn, ErrorsEs, HomeEn, HomeEs, OnboardingEn, OnboardingEs, SignInTranslationsEn, SignInTranslationsEs, } from "@/locales";


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
    home: {
      home: HomeEn
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
    home: {
      home: HomeEs
    },
    utils: ErrorsEs
  }
};