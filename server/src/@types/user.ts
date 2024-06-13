import { Request } from "express"

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  }
}

export interface VerifyEmailRequest extends Request {
  body: {
    token: string;
    userId: string;
  }
}

export interface resendVerificationTokenRequest extends Request {
  body: {
    userId: string;
  }
}

export interface generatePasswordResetLinkRequest extends Request {
  body: {
    email: string;
  }
}