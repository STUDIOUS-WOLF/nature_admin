import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";

function AddBanner() {
  const [imgUrl, setImageUrl] = useState("");
  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed", () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setImageUrl(downloadUrl);
        console.log("image uploaded");
      });
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) {
      alert("upload image first");
      return;
    }
    try {
      await addDoc(collection(db, "Banner"), {
        ImageUrl: imgUrl,
        Active: Boolean(true),
        TargetScreen: "",
      });
      URL.revokeObjectURL(imgUrl);

      alert("Banner uploaded successfully!");
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Error uploading bannert. Please try again.");
    }

    console.log("Banner uploaded successfully!");
  };
  return (
    <div className="form-container">
      <h1 className="form-title">Add Banner</h1>
      <form onSubmit={handleSubmit}>
        <label className="form-file">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {imgUrl && (
            <img className="uploaded-image" src={imgUrl} alt="Uploaded" />
          )}
          <span className="form-file-label">Upload Image</span>
        </label>

        <button className="form-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddBanner;
