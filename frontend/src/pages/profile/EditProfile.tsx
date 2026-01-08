import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import { updateUser } from "../../app/features/users/ActionCreator";
import {type IUser} from "../../app/models/UserTypes";
import { useState } from "react";




function EditProfile() {

      const currentUser=useAppSelector((state) => state.userReducer.currentUser);
  const dispatch = useAppDispatch();
    const handleUpdateUser = async (userData) => {
  const resultAction = await dispatch(updateUser(userData));
  if (updateUser.fulfilled.match(resultAction)) {
    const user = resultAction.payload
   // showToast('success', `Updated ${user.name}`)
  } else {
    if (resultAction.payload) {
      // Since we passed in `MyKnownError` to `rejectValue` in `updateUser`, the type information will be available here.
      // Note: this would also be a good place to do any handling that relies on the `rejectedWithValue` payload, such as setting field errors
      //showToast('error', `Update failed: ${resultAction.payload.errorMessage}`)
    } else {
     // showToast('error', `Update failed: ${resultAction.error.message}`)
    }
  }
}
  return (
    <div>EditProfile</div>
  )
}

export default EditProfile