import { useAppDispatch, useAppSelector } from "../../app/hooks/hooks";
import {
  selectedCurrentUser,
  updateAvatar,
} from "../../app/features/auth/authSlice";
import {
  useCreateAvatarMutation,
  useUpdateNotificationSettingsMutation,
} from "../../app/services/users/usersApi";
import EventsDashboard from "../../app/services/events/pages/EventDashboard";
import { getErrorMessage } from "../../helpers/functions/errorHelper";
import {
  useGetJoinedEventsQuery,
  useGetMyEventsQuery,
} from "../../app/services/events/EventService";
import { useAvatarPreview } from "../../hooks/useAvatarPreview";
import { useState, useEffect, useRef } from "react";
import Succcess from "../../components/success/Success";
import ErrorMessage from "../../components/errors/ErrorMessage";

type NotificationSettings = {
  emailNotifications: boolean;
  pushNotifications: boolean;
};

export default function Profile() {
  const user = useAppSelector(selectedCurrentUser);
  const dispatch = useAppDispatch();

  const { data: myEvents = [], isLoading: isMyEventsLoading } =
    useGetMyEventsQuery();
  const { data: joinedEvents = [], isLoading: isJoinedEventsLoading } =
    useGetJoinedEventsQuery();

  const { file, preview, onSelect, reset } = useAvatarPreview();
  const [createAvatar, { isLoading: isUploading }] = useCreateAvatarMutation();
  const [updateSettings] = useUpdateNotificationSettingsMutation();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const [notificationsSettings, setNotificationsSettings] =
    useState<NotificationSettings>({
      emailNotifications:
        user?.notification_settings?.email_notifications ?? false,
      pushNotifications:
        user?.notification_settings?.push_notifications ?? false,
    });

  // Синхронизируем state с user при первом рендере / обновлении user
  useEffect(() => {
    if (user) {
      setNotificationsSettings({
        emailNotifications: user.notification_settings.email_notifications,
        pushNotifications: user.notification_settings.push_notifications,
      });
    }
  }, [user]);

  useEffect(() => {
    if (successMessage) {
      successRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    if (errorMessage) {
      errorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  // Checkbox handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationsSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Сохранение notification settings
  const handleSaveSettings = async () => {
    if (!user) return;
    try {
      const res = await updateSettings({
        email_notifications: notificationsSettings.emailNotifications,
        push_notifications: notificationsSettings.pushNotifications,
      }).unwrap();
      setSuccessMessage(
        res?.message || "Notification settings updated successfully",
      );
    } catch (err) {
      setErrorMessage(
        getErrorMessage(err, "Failed to update notification settings"),
      );
    }
  };

  // Avatar upload handler
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
        setSuccessMessage("Avatar uploaded successfully");
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err, "Avatar upload failed"));
    }
  };

  const stats = [
    { label: "Created Events", value: myEvents.length },
    { label: "Joined Events", value: joinedEvents.length },
  ];

  return (
    <div className="max-w-[160rem] mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-10 justify-center items-start">
      <div className="lg:col-span-1 space-y-10 mr-20 sm:border-r sm:pr-20 border-gray-400 mx-auto">
        <div ref={successRef} role="status" aria-live="polite">
          {successMessage && <Succcess success={successMessage} />}
        </div>
        <div ref={errorRef} role="alert" aria-live="assertive">
          {errorMessage && <ErrorMessage error={errorMessage} />}
        </div>
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
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            Profile Avatar
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                hidden
                aria-label="Upload profile avatar"
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
              disabled={isUploading}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold text-lg disabled:opacity-50"
            >
              {isUploading
                ? "Uploading..."
                : user?.avatar
                  ? "Change Avatar"
                  : "Upload Avatar"}
            </button>
          </form>
        </section>

        {/* NOTIFICATION SETTINGS */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            🔔 Notification Settings
          </h2>
          <fieldset className="space-y-4">
            <legend className="sr-only">Notification settings</legend>
            <div className="flex items-center justify-between mt-4">
              <input
                type="checkbox"
                name="emailNotifications"
                id="emailNotifications"
                checked={notificationsSettings.emailNotifications}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="emailNotifications">
                Получать email-уведомления
              </label>
            </div>

            <div className="flex items-center justify-between mt-4">
              <input
                type="checkbox"
                name="pushNotifications"
                id="pushNotifications"
                checked={notificationsSettings.pushNotifications}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="pushNotifications">
                Получать push-уведомления
              </label>
            </div>
          </fieldset>
          <button
            type="button"
            aria-busy={isUploading}
            className="w-full py-4 mt-4 rounded-xl bg-blue-600 hover:bg-blue-400 transition text-white font-semibold text-lg"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </section>
      </div>

      {/* DASHBOARD AND STATS */}
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
          <h2 className="text-lg sm:text-4xl font-semibold text-center text-white bg-[url('/balloons.jpg')] bg-cover bg-center rounded-2xl p-10 shadow-lg animate-(--my-animationBgmove)">
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
