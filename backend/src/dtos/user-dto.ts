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
  notification_settings?;
  constructor(model: IUser) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.avatar = model.avatar || null;
    this.role = model.role ? model.role : "guest";
    this.isActivated = model.isActivated ?? false;
    this.notification_settings = model.notification_settings ?? { email_notifications: false, push_notifications: false };
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
  toPayload():MyJwtPayload {
    return {id:this.id.toString(),email:this.email,role:this.role};
  }
  }
export default UserDTO;

