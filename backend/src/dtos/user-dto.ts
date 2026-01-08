import { MyJwtPayload } from "../models/MyJwtPayload.js";
import { IUser } from "../models/User.js";

class UserDTO {
  /**
   * User Data Transfer Object
   * @param {Object} model - The user model object
   */
  email;
  id;
  name;
  avatar;
  role;
  isActivated ;
  createdAt?;
  updatedAt?;
  constructor(model: IUser) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.avatar = model.avatar || null;
    this.role = model.role ? model.role : "guest";
    this.isActivated = model.isActivated ?? false;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
  toPayload():MyJwtPayload {
    return {id:this.id,email:this.email,role:this.role};
  }
  }
export default UserDTO;

