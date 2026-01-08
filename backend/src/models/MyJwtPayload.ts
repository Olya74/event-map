import { Schema, Types } from 'mongoose';
export interface MyJwtPayload {
  id: Types.ObjectId;
  email: string;
  role: string;
}