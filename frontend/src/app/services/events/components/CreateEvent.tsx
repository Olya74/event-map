import { useRef, useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/hooks";
import { selectedCurrentUser } from "../../../features/auth/authSlice";
import { useCreateEventMutation } from "../EventService";
import type { CreateEventDTO } from "../../../models/IEvent";
import ErrorMessage from "../../../../components/errors/ErrorMessage";
import Success from "../../../../components/success/Success";
import { useLocation, useNavigate } from "react-router-dom";
import type { Lat, Lng } from "../../../models/location-types";
import { useThema } from "../../../../context/ThemaContext";
import "./event.css";
import { useFilePreview } from "../../../../hooks/useFilePreview";
import { inputStyle, selectStyle, dateStyle } from "../../../../styles/style";
import { EVENT_CATEGORIES, type EventCategory } from "@event-map/shared";

export default function CreateEvent() {
  const [createEvent] = useCreateEventMutation();
  const { thema } = useThema();
  const location = useLocation();
  const navigate = useNavigate();
  const lat = (location.state as { lat?: Lat })?.lat;
  const lng = (location.state as { lng?: Lng })?.lng;
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const successRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);
  const [formEvent, setFormEvent] = useState<CreateEventDTO>({
    title: "",
    description: "",
    date: "",
    category: "",
    subCategory: "",
    street: "",
    number: "",
    zip: "",
  });

  const user = useAppSelector(selectedCurrentUser);
  const { files, previews, handlePreview, removeFile, reset } =
    useFilePreview();

  useEffect(() => {
    if (successMsg || errorMsg) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setFormEvent({
        title: "",
        description: "",
        date: "",
        category: "",
        subCategory: "",
        street: "",
        number: "",
        zip: "",
      });
    }

    let timer = setTimeout(() => {
      if (successMsg) {
        navigate("/events");
      }
      setSuccessMsg("");
      setErrorMsg("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMsg, errorMsg]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if (user) formData.append("userId", user.id);

    const hasCoords =
      lat !== null && lng !== null && lat !== undefined && lng !== undefined;

    const hasAddress = Boolean(formEvent.street && formEvent.zip);

    if (!hasAddress && !hasCoords) {
      setErrorMsg("Please provide an address or map coordinates.");
      errRef.current?.focus();
      return;
    }

    if (hasCoords) {
      formData.append("lat", String(lat));
      formData.append("lng", String(lng));
    }

    files.forEach((file) => formData.append("files", file));
    if (!formEvent.category) {
      setErrorMsg("Please choose event category");
      return;
    }

    Object.entries(formEvent).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        formData.append(k, String(v));
      }
    });
console.log("Submitting formEvent:", formEvent);
    try {
      await createEvent(formData).unwrap();

      setSuccessMsg(`Event ${formEvent.title} created successfully!`);

      successRef.current?.focus();
      reset();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || err.error || "Error creating event");
      errRef.current?.focus();
    }
  };

  return (
    <div className={` min-h-screen flex justify-center  px-4 py-10`}>
      <div
        className={`w-full h-fit max-w-2xl rounded-2xl shadow-xl p-6 md:p-8 create-event ${thema}`}
      >
        {successMsg && <Success success={successMsg} ref={successRef} />}
        {errorMsg && <ErrorMessage error={errorMsg} ref={errRef} />}

        <h2 className={`text-2xl font-semibold text-center mb-6 `}>
          Create Event
        </h2>

        <form
          onSubmit={handleSubmit}
          className={`space-y-5  sm:text-xl font-semibold form-field`}
        >
          <div className="space-y-1">
            <label htmlFor="date">Date: </label>
            <input
              id="date"
              name="date"
              type="date"
              onChange={handleChange}
              className={`${dateStyle}`}
            />
          </div>
          {/* Title */}
          <div className="space-y-1 ">
            <label htmlFor="title" className="">
              Title
            </label>
            <input
              id="title"
              name="title"
              required
              onChange={handleChange}
              className={`${inputStyle}`}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              onChange={handleChange}
              className={`${inputStyle} resize-none`}
            />
          </div>

          {/* Date & Type */}
          <div className="grid grid-cols-1 sm:grid-flow-col sm:auto-cols-max gap-10 justify-between ">
            <div className={`space-y-1 `}>
              <select
                id="category"
                name="category"
                onChange={handleChange}
                className={`${selectStyle}`}
              >
                <option value={formEvent.category}>
                  {formEvent.category
                    ? `Selected category: ${formEvent.category}`
                    : "Choose a category"}
                </option>
                {Object.keys(EVENT_CATEGORIES).map((category) => (
                  <option key={category} value={category}>
                    {EVENT_CATEGORIES[category as EventCategory].label}
                  </option>
                ))}
              </select>
            </div>

            {formEvent.category && (
              <div className={`space-y-1`}>
                <h4>{formEvent.category}</h4>
                <select
                  id="subCategory"
                  name="subCategory"
                  onChange={handleChange}
                  className={`${selectStyle}`}
                >
                  {EVENT_CATEGORIES[
                    formEvent.category as EventCategory
                  ].subcategories.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {/* Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 form-field">
            <div>
              <label htmlFor="street">Street:</label>
              <input
                id="street"
                name="street"
                placeholder="Street"
                onChange={handleChange}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <label htmlFor="zip">ZIP:</label>
              <input
                id="zip"
                name="zip"
                placeholder="ZIP"
                onChange={handleChange}
                className={`${inputStyle}`}
              />
            </div>
            <div>
              <label htmlFor="number">No.:</label>
              <input
                id="number"
                name="number"
                placeholder="No."
                onChange={handleChange}
                className={`${inputStyle}`}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <label className="sm:text-xl font-semibold block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
              <input type="file" multiple hidden onChange={handlePreview} />
              <span className="text-gray-500">Click or drag images here</span>
            </label>

            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center items-center sm:gap-8">
                {previews.map((img, i) => (
                  <div key={`${img}-${i}`} className="relative group">
                    <img
                      src={img}
                      className="h-36 w-36 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-center">Hover image to remove</p>
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-[#a5c7dd] py-4 rounded-lg transition font-semibold  sm:text-2xl ${thema} text-white`}
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
}
