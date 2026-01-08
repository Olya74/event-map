export interface IAvatar {
  url: string;
  publicId?: string;
  _id?: string;
}
export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: IAvatar;
  role: 'user' | 'admin' | 'guest';
  eventId: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  captcha: string;
}

export interface IAuthResponse {
  message: string;
  userData: {
    accessToken: string;
    refreshToken: string;
    user: IUserResponse;
  };
}