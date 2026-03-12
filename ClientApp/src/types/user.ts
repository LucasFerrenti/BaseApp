export interface UserBasic {
  email: string;
  roleId: number;
  role: string;
  name: string;
  surname: string;
  photo: string;
}

export interface LoginResult {
  token: string;
  user: UserBasic;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserRegisterPayload {
  name: string;
  surname: string;
  email: string;
  state: number;
  city: string;
  password: string;
}
