import { useState } from "react";
import React from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [parentId, setParentId] = useState("");
  const [imgUrl, setImgUrl] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_change", () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setImgUrl(downloadUrl);
        console.log("image uploaded");
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imgUrl) {
      alert("please upload image");
      return;
    }
    var isUnique = true;

    // test for uinque elements
    try {
      console.log("Fetching documents...");
      const firestore = getFirestore();
      const querySnapshot = await getDocs(collection(firestore, "Categories"));
      console.log("Documents fetched successfully!");
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().Name.toLowerCase());
        // console.log(
        //   doc.data().Name,
        //   doc.data().Name.toString() === categoryName,
        //   categoryName
        // );
        if (doc.data().Name.toString() === categoryName) isUnique = false;
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
    // test for unique elements ends
    if (isUnique) {
      try {
        await addDoc(collection(db, "Categories"), {
          Name: categoryName,
          Image: imgUrl,
          ParentId: parentId,
        });
        console.log("category added");
      } catch (error) {
        console.error("Error uploading product:", error);
        alert("Error uploading Category. Please try again.");
      }
    } else {
      alert("category already present");
    }
  };
  return (
    <div className="form-container">
      <h1 className="form-title">Add Category</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <input
          className="form-input"
          placeholder="Parent Id"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          required
        />
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

export default AddCategory;
