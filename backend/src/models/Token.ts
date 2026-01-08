import { Schema, Types, model } from "mongoose";

interface IToken {
  user: Types.ObjectId;
  refreshToken: string;
}

const tokenSchema = new Schema<IToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);
const Token = model<IToken>("Token", tokenSchema);
export default Token;
