import { Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar?: Types.ObjectId;
  password: string;
  role: "admin" | "user" | "guest";
  eventId?: Types.ObjectId[];
  activationLink?: string | null;
  isActivated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "guest"],
      default: "guest",
    },
    eventId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    activationLink: { type: String, default: null },
    isActivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", UserSchema);
export default User;
