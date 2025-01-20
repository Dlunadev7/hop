export enum AuthRoutes {
  ENTRY = 'index',
  SIGN_UP = 'sign-up',
  SIGN_IN = 'sign-in',
  FINISH_ONBOARDING = 'finish-onboarding',
  WAITING_VALIDATION = 'waiting-validation',
  RECOVERY_PASSWORD = 'recovery-password',
  NEW_PASSWORD = 'new-password',
  FINISH_RECOVER_PASSWORD = 'finish-recover-password',
  MAP = 'map'
}

export enum AuthRoutesLink {
  ENTRY = '/',
  SIGN_UP = '/(auth)/sign-up',
  SIGN_IN = '/(auth)/sign-in',
  FINISH_ONBOARDING = '/(auth)/finish-onboarding',
  WAITING_VALIDATION = '/(auth)/waiting-validation',
  RECOVERY_PASSWORD = '/(auth)/recovery-password',
  NEW_PASSWORD = '/(auth)/new-password',
  FINISH_RECOVER_PASSWORD = '/(auth)/finish-recover-password',
  MAP = '/(auth)/map'
}