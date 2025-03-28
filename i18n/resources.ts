import { AuthForgotPasswordEn, AuthForgotPasswordEs, AuthSignUpEn, AuthSignUpEs, AuthValidationsEn, AuthValidationsEs, BookingEn, BookingEs, EntryTranslationEn, EntryTranslationEs, ErrorsEn, ErrorsEs, HistoryEn, HistoryEs, HomeEn, HomeEs, NewPasswordEn, NewPasswordEs, OnboardingEn, OnboardingEs, ProfileEn, ProfileEs, SignInTranslationsEn, SignInTranslationsEs, WalletEn, WalletEs, } from "@/locales";


export const resources = {
  en: {
    auth: {
      entry: EntryTranslationEn,
      signin: SignInTranslationsEn,
      signup: AuthSignUpEn,
      validations: AuthValidationsEn,
      forgot_password: AuthForgotPasswordEn,
      onboarding: OnboardingEn,
      new_password: NewPasswordEn
    },
    home: {
      home: HomeEn
    },
    profile: {
      profile: ProfileEn
    },
    booking: {
      booking: BookingEn
    },
    wallet: WalletEn,
    history: HistoryEn,
    utils: ErrorsEn
  },
  es: {
    auth: {
      entry: EntryTranslationEs,
      signin: SignInTranslationsEs,
      signup: AuthSignUpEs,
      validations: AuthValidationsEs,
      forgot_password: AuthForgotPasswordEs,
      onboarding: OnboardingEs,
      new_password: NewPasswordEs
    },
    home: {
      home: HomeEs
    },
    profile: {
      profile: ProfileEs
    },
    booking: {
      booking: BookingEs
    },
    wallet: WalletEs,
    history: HistoryEs,
    utils: ErrorsEs
  }
};