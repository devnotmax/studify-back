export interface IUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse extends Omit<IUser, "password"> {
  id: string;
}
