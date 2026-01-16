import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetEventByIdQuery, useUpdateEventMutation } from "../EventService";
import {
  EVENT_CATEGORIES,
  type EventCategory,
} from "@event-map/shared";
import type { IMedia } from "../../../models/Media";
import Loader from "../../../../components/loading/Loader";
import { useFilePreview } from "../../../../hooks/useFilePreview";
import { useThema } from "../../../../context/ThemaContext";
import { inputStyle, selectStyle, dateStyle } from "../../../../styles/style";
import "./event.css";
import useForm from "../../../../hooks/useForm";
import Success from "../../../../components/success/Success";
import ErrorMessage from "../../../../components/errors/ErrorMessage";

export const EventEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: event, isLoading } = useGetEventByIdQuery(id!);
  const [updateEvent] = useUpdateEventMutation();
  const { thema } = useThema();
  const { files, previews, handlePreview, removeFile, reset } =
    useFilePreview();
  const [keptMedia, setKeptMedia] = useState<IMedia[]>([]);
  const [mounted, setMounted] = useState(false);
  const { handleSubmit } = useForm();
  const [successMsg, setSuccessMsg] = useState<string | null>("");
  const [errorMsg, setErrorMsg] = useState<string | null>("");
  const successRef = React.useRef<HTMLDivElement>(null);
  const errRef = React.useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<EventCategory>("other");

  const [subCategory, setSubCategory] = useState<string>("other");
  useEffect(() => {
    if (!event) return;
      setCategory(event.category);
      setSubCategory(event.subCategory as string);
  }, [event]);

  useEffect(() => {
    if (event?.media) {
      setKeptMedia(event.media);
      setMounted(true);
    }
  }, [event]);

  useEffect(() => {
    if (!successMsg && !errorMsg) return;

    const timer = setTimeout(() => {
      setSuccessMsg("");
      setErrorMsg("");
      navigate("/events");
    }, 2000);

    return () => clearTimeout(timer);
  }, [successMsg, errorMsg, navigate]);

  if (isLoading || !event) {
    return <Loader />;
  }

  const toggleMedia = (mediaId: string) => {
    setKeptMedia((prev) =>
      prev.some((m) => m._id === mediaId)
        ? prev.filter((m) => m._id !== mediaId)
        : [...prev, event.media.find((m) => m._id === mediaId)!]
    );
  };

  const handleUpdate = handleSubmit(async (formData) => {
    formData.set("existingMedia", JSON.stringify(keptMedia.map((m) => m._id)));

    files.forEach((file) => formData.append("files", file));
    try {
      await updateEvent({ id: event._id, updatedEvent: formData }).unwrap();
      setSuccessMsg("Event updated successfully!");
      successRef.current?.focus();
      reset();
    } catch (err) {
      setErrorMsg("Failed to update event. Please try again.");
      errRef.current?.focus();
    }
  });

  return (
    <div className={`container mx-auto min-h-screen py-6 px-10 `}>
      {successMsg && <Success success={successMsg} ref={successRef} />}
      {errorMsg && <ErrorMessage error={errorMsg} ref={errRef} />}
      <h1
        className={` max-w-3xl mx-auto text-center  text-2xl sm:text-3xl lg:text-4xl text-wrap bg-gradient-to-r ${
          thema === "light"
            ? "from-indigo-600 from-10% via-sky-600 via-30% to-emerald-500 to-90%"
            : "from-violet-600 via-sky-600 to-emerald-800"
        } p-4 mb-6 font-extrabold text-transparent  rounded-md shadow-md shadow-blue-900 bg-clip-text backdrop-blur-lg contrast-150`}
      >
        Update Event:&nbsp;
        <span className="text-5xl text-capitalize ">{event.title}</span>
      </h1>

      <div
        className={`max-w-2xl sm:max-w-6xl mx-auto flex flex-col lg:flex-row gap-8
        p-4 sm:p-6 lg:p-8 rounded-lg shadow-lg
        transition-all duration-700 ease-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${
          thema === "dark"
            ? "bg-gray-800 text-white"
            : "bg-[rgba(212,212,208,0.8)] backdrop-blur-sm text-gray-600"
        }`}
      >
        {/* LEFT — STICKY PREVIEW */}
        <aside className="w-full lg:w-1/2 lg:sticky lg:top-24 self-start flex flex-col gap-6">
          <section className="flex flex-col gap-4 text-sm">
            <h2 className="text-lg font-semibold sm:text-3xl">
              Existing images
            </h2>
            <p className="text-sm sm:text-2xl">
              (Uncheck images you want to remove)
            </p>

            <div className="flex flex-wrap gap-4">
              {event.media.map((img) => (
                <div
                  key={img._id}
                  className="relative group w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />

                  <label
                    className="absolute bottom-2 left-2 flex gap-2 items-center
                    bg-[rgba(255,255,255,0.6)] text-black px-2 py-1 rounded text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={keptMedia.some((m) => m._id === img._id)}
                      onChange={() => toggleMedia(img._id)}
                    />
                    Keep
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* NEW FILE PREVIEW */}
          {previews.length > 0 && (
            <section className="flex flex-col gap-2 text-sm">
              <h2 className="text-lg sm:text-3xl font-semibold">New images</h2>
              <p className="text-sm sm:text-2xl">(hover to remove)</p>
              <div className="flex flex-wrap gap-3">
                {previews.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36
                      object-cover rounded-lg"
                      alt=""
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white
                      text-xs px-2 py-1 rounded opacity-0
                      group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>

        {/* DIVIDER */}
        <div className="max-lg:h-px lg:w-3 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-60" />

        {/* RIGHT — FORM */}
        <form
          onSubmit={handleUpdate}
          className="w-full lg:w-1/2 flex flex-col gap-4 text-md sm:text-2xl"
        >
          <div className="flex flex-col ">
            <label>Date</label>
            <input
              type="date"
              name="date"
              defaultValue={event.date.split("T")[0]}
              className={dateStyle}
            />
          </div>
          <div>
            <label>Title</label>
            <input
              name="title"
              defaultValue={event.title}
              className={inputStyle}
            />
          </div>

          <div>
            <label>Description</label>
            <input
              name="description"
              defaultValue={event.description}
              className={inputStyle}
            />
          </div>

          <section className="grid grid-cols-1  sm:grid-cols-2 gap-4">
            <div className="flex flex-col ">
              <p>Event Category</p>
              <select
                name="category"
                value={category}
                onChange={(e) => {
                  const newCategory = e.target.value as EventCategory;
                  setCategory(newCategory);

                  // сбрасываем подкатегорию при смене категории
                  setSubCategory(
                    EVENT_CATEGORIES[newCategory].subcategories[0]
                  );
                }}
                className={selectStyle}
              >
                <option defaultValue={event.category}>{event.category}</option>
                {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
            {EVENT_CATEGORIES[category] && (
              <div className="flex flex-col">
                <p>Event Subcategory</p>

                <select
                  name="subCategory"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className={selectStyle}
                >
                  <option value={event.subCategory} > {event.subCategory}</option>
                  {EVENT_CATEGORIES[category].subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </section>
<div>
  <label>GPS:</label>
  <div className="flex gap-4">
    <input
      type="number"
      step="0.000001"
      name="lat"
      defaultValue={event.location.lat}
      className={inputStyle}
      placeholder="Latitude"
    />  
    <input
      type="number"
      step="0.000001"
      name="lng"
      defaultValue={event.location.lng}
      className={inputStyle}
      placeholder="Longitude"
    />
  </div>
</div>
          <div>
            <label>Street</label>
            <input
              name="street"
              defaultValue={event.address?.street}
              className={inputStyle}
            />
          </div>

          <div>
            <label>Zip</label>
            <input
              name="zip"
              defaultValue={event.address?.zip}
              className={inputStyle}
            />
          </div>

          <div>
            <label>Number</label>
            <input
              name="number"
              defaultValue={event.address?.number}
              className={inputStyle}
            />
          </div>

          <label className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition">
            <input type="file" multiple hidden onChange={handlePreview} />
            <span>Click or drag images here</span>
          </label>

          <button
            type="submit"
            className={`bg-[url("/balloons.jpg")] bg-cover bg-center bg-clip-text font-semibold text-md sm:text-6xl text-transparent rounded-md p-2 hover:text-blue-500 transition-ease-in-out duration-500`}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};
