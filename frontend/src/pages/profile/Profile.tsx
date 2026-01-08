import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import {
  selectedCurrentUser,
  updateAvatar,
} from "../../app/features/auth/authSlice";
import { useCreateAvatarMutation } from "../../app/services/users/usersApi";
import EventsDashboard from "../../app/services/events/pages/EventDashboard";
import { getErrorMessage } from "../../helpers/functions/errorHelper";
import { useGetJoinedEventsQuery, useGetMyEventsQuery } from "../../app/services/events/EventService";
import { useAvatarPreview } from "../../hooks/useAvatarPreview";

export default function Profile() {
  const user = useAppSelector(selectedCurrentUser);
  const dispatch = useAppDispatch();

  const  {data: myEvents=[] , isLoading: isMyEventsLoading} = useGetMyEventsQuery();
   const { data: joinedEvents=[], isLoading: isJoinedEventsLoading } = useGetJoinedEventsQuery();

 
  const { file, preview, onSelect, reset,}=useAvatarPreview();
  const [createAvatar, { isLoading }] = useCreateAvatarMutation();


  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !user) return;

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("avatar", file);

    try {
      const res = await createAvatar(formData).unwrap();
    
      if (res) {
        dispatch(updateAvatar(res));
        reset();
      }
      
    } catch (err) {
      getErrorMessage(err, "Avatar upload failed");
    }
  };

  const stats = [
    { label: "Created Events", value: myEvents.length },
    { label: "Joined Events", value: joinedEvents.length },
  ];

 

  return (
    <div className="max-w-[160rem] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-10 justify-center items-start">
      <div className="lg:col-span-1 space-y-10 mr-20 border-r pr-20  border-gray-400">
  {/* PROFILE CARD */}
  <section className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-6">
    {user?.avatar?.url ? (
      <img
        src={user.avatar.url}
        alt="avatar"
        className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100"
      />
    ) : (
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
        No Avatar
      </div>
    )}

    <div className="text-center space-y-1">
      <h1 className="text-2xl font-bold">{user?.name}</h1>
      <p className="text-gray-500">{user?.email}</p>
      <p className="text-sm text-gray-400">
        Joined {user?.createdAt?.split("T")[0]}
      </p>
    </div>
  </section>

  {/* AVATAR UPLOAD */}
  <section className="bg-white rounded-2xl shadow-md p-6 space-y-6">
   <section className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-center">Profile Avatar</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            className="flex flex-col items-center justify-center
                       border-2 border-dashed rounded-xl p-6
                       cursor-pointer hover:border-blue-500 transition"
          >
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={onSelect}
            />
            <span className="text-gray-500 text-center">
              Click or drag image here
            </span>
          </label>

          {preview && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="relative group">
                <img
                  src={preview}
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
            
            </div>
          )}

          <button
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-blue-600
                       hover:bg-blue-500 transition text-white
                       font-semibold text-lg disabled:opacity-50"
          >
            {isLoading
              ? "Uploading..."
              : user?.avatar
              ? "Change Avatar"
              : "Upload Avatar"}
          </button>
        </form>
      </section>
  </section>
</div>

<div className="lg:col-span-3 space-y-10">
  {/* STATS */}
  <section className="grid grid-cols-2 gap-4">
    {stats.map((s) => (
      <div
        key={s.label}
        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-sm"
      >
        <p className="text-sm text-gray-600">{s.label}</p>
        <p className="text-3xl font-bold text-blue-700">{s.value}</p>
      </div>
    ))}
  </section>

  {/* EVENTS DASHBOARD */}
  <section className="space-y-6">
    <h2 className="text-lg sm:text-4xl font-semibold text-center text-white bg-[url('/balloons.jpg')] bg-cover bg-center rounded-2xl p-10  shadow-lg animate-(--my-animationBgmove) ">
    My Events
    </h2>
    <EventsDashboard
      myEvents={myEvents}
      joinedEvents={joinedEvents}
      loading={isMyEventsLoading || isJoinedEventsLoading}
    />
  </section>
</div>
    </div>
  );
}
