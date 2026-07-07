export class AuthError extends Error {
  details: BetterAuthError;
  constructor(error: BetterAuthError) {
    super(error.message || error.statusText || 'Authentication failed');
    this.name = 'AuthError';
    this.details = error;
  }
}

export interface BetterAuthError {
  status: number;
  statusText: string;
  message?: string;
  code?: string;
}

const ERROR_CODE_MAP: Record<string, { title: string; description: string }> = {
  // Session & auth
  FAILED_TO_GET_SESSION: {
    title: 'Session Retrieval Failed',
    description:
      'We could not retrieve your session from the server. This usually means the session has expired or was revoked.',
  },
  FAILED_TO_CREATE_SESSION: {
    title: 'Session Creation Failed',
    description:
      'The server was unable to create a new session. Please try signing in again.',
  },
  SESSION_EXPIRED: {
    title: 'Session Expired',
    description: 'Your session has expired. Please sign in again to continue.',
  },
  INVALID_SESSION_TOKEN: {
    title: 'Invalid Session',
    description:
      'Your session token is invalid or has been tampered with. Please sign in again.',
  },

  // Credentials
  INVALID_EMAIL_OR_PASSWORD: {
    title: 'Invalid Credentials',
    description: 'The email or password you entered is incorrect.',
  },
  INVALID_PASSWORD: {
    title: 'Invalid Password',
    description: 'The password you provided is incorrect.',
  },
  INVALID_EMAIL: {
    title: 'Invalid Email',
    description: 'The email address provided is not valid.',
  },
  EMAIL_NOT_VERIFIED: {
    title: 'Email Not Verified',
    description:
      'Your email address has not been verified. Please check your inbox for a verification link.',
  },
  USER_NOT_FOUND: {
    title: 'User Not Found',
    description:
      'No account was found with this information. Please check your details or sign up.',
  },
  USER_ALREADY_EXISTS: {
    title: 'Account Already Exists',
    description:
      'An account with this email already exists. Please sign in instead.',
  },

  // OAuth & social
  INVALID_CALLBACK_REQUEST: {
    title: 'Invalid Callback',
    description:
      'The authentication callback request was invalid. Please try signing in again.',
  },
  STATE_NOT_FOUND: {
    title: 'OAuth State Missing',
    description:
      'The OAuth state parameter was not found. This can happen if you waited too long. Please try again.',
  },
  STATE_MISMATCH: {
    title: 'OAuth State Mismatch',
    description:
      'The OAuth state does not match. This could indicate a CSRF attack or a stale request. Please try again.',
  },
  NO_CODE: {
    title: 'Authorization Code Missing',
    description:
      'No authorization code was received from the provider. Please try signing in again.',
  },
  NO_CALLBACK_URL: {
    title: 'Callback URL Missing',
    description:
      'No callback URL was configured. Please contact the application administrator.',
  },
  OAUTH_PROVIDER_NOT_FOUND: {
    title: 'Provider Not Found',
    description:
      'The authentication provider is not configured. Please contact the application administrator.',
  },
  UNABLE_TO_GET_USER_INFO: {
    title: 'User Info Unavailable',
    description:
      'We could not retrieve your information from the authentication provider. Please try again.',
  },
  UNABLE_TO_LINK_ACCOUNT: {
    title: 'Account Linking Failed',
    description:
      'We were unable to link this account. The email may already be associated with another sign-in method.',
  },
  ACCOUNT_ALREADY_LINKED_TO_DIFFERENT_USER: {
    title: 'Account Already Linked',
    description:
      'This account is already linked to a different user. Please sign in with the original account.',
  },

  // Email
  EMAIL_NOT_FOUND: {
    title: 'Email Not Found',
    description: 'No account is associated with this email address.',
  },
  "EMAIL_DOESN'T_MATCH": {
    title: 'Email Mismatch',
    description: 'The email address does not match the expected value.',
  },

  // Account & signup
  SIGNUP_DISABLED: {
    title: 'Sign Up Disabled',
    description:
      'New account registration is currently disabled. Please contact the application administrator.',
  },
  ACCOUNT_NOT_FOUND: {
    title: 'Account Not Found',
    description: 'The requested account could not be found.',
  },
  FAILED_TO_CREATE_USER: {
    title: 'User Creation Failed',
    description:
      'We were unable to create your account. Please try again or contact support.',
  },

  // 2FA
  INVALID_TWO_FACTOR_CODE: {
    title: 'Invalid 2FA Code',
    description:
      'The two-factor authentication code you entered is invalid or has expired.',
  },

  // Rate limiting
  TOO_MANY_REQUESTS: {
    title: 'Too Many Requests',
    description:
      'You have made too many requests. Please wait a moment and try again.',
  },
};

/**
 * HTTP status-based fallbacks for when no error code is present.
 */
const HTTP_STATUS_MAP: Record<number, { title: string; description: string }> =
  {
    400: {
      title: 'Bad Request',
      description: 'The request was malformed or contained invalid data.',
    },
    401: {
      title: 'Unauthorized',
      description:
        'You are not authenticated. Your session may have expired or you need to sign in.',
    },
    403: {
      title: 'Forbidden',
      description: 'You do not have permission to access this resource.',
    },
    404: {
      title: 'Not Found',
      description: 'The requested resource could not be found.',
    },
    408: {
      title: 'Request Timeout',
      description:
        'The authentication server took too long to respond. Please try again.',
    },
    429: {
      title: 'Rate Limited',
      description:
        'You have been rate limited. Please wait a moment before trying again.',
    },
    500: {
      title: 'Server Error',
      description:
        'An internal server error occurred. Please try again later or contact support.',
    },
    502: {
      title: 'Bad Gateway',
      description:
        'The authentication server is unreachable. Please try again later.',
    },
    503: {
      title: 'Service Unavailable',
      description:
        'The authentication service is temporarily unavailable. Please try again later.',
    },
  };

export function isUnauthenticatedError(error: BetterAuthError): boolean {
  const unauthCodes = new Set([
    'FAILED_TO_GET_SESSION',
    'SESSION_EXPIRED',
    'INVALID_SESSION_TOKEN',
  ]);

  if (error.code && unauthCodes.has(error.code)) {
    return true;
  }

  // 401 without a specific code is a generic "not authenticated"
  return error.status === 401 && !error.code;
}

export function resolveAuthError(error: BetterAuthError): {
  title: string;
  description: string;
  code: string | undefined;
  status: number;
} {
  // Try error code first
  if (error.code && error.code in ERROR_CODE_MAP) {
    return {
      ...ERROR_CODE_MAP[error.code],
      code: error.code,
      status: error.status,
    };
  }

  if (error.status in HTTP_STATUS_MAP) {
    return {
      ...HTTP_STATUS_MAP[error.status],
      code: error.code,
      status: error.status,
    };
  }

  return {
    title: 'Authentication Error',
    description:
      error.message ||
      error.statusText ||
      'An unexpected authentication error occurred.',
    code: error.code,
    status: error.status,
  };
}
