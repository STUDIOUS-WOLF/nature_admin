import React, { useState } from "react";
import { db } from "../firebase";
import "./styles.css";
import {
  collection,
  addDoc,
  Timestamp,
  getFirestore,
  getDocs,
} from "firebase/firestore";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

function AddProduct() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [imgUrl, setImgUrl] = useState(null);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setImgUrl(downloadURL);
        console.log("image uploaded");
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgUrl) {
      alert("Please select an image");
      return;
    }
    var isUnique = true;

    // test for uinque elements
    try {
      console.log("Fetching documents...");
      const firestore = getFirestore();
      const querySnapshot = await getDocs(collection(firestore, "Products"));
      console.log("Documents fetched successfully!");
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data().Name.toLowerCase());
        // console.log(
        //   doc.data().Name,
        //   doc.data().Name.toString() === categoryName,
        //   categoryName
        // );
        if (
          doc.data().Name.trim().toLowerCase() ===
          productName.trim().toLowerCase()
        )
          isUnique = false;
      });
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
    // test for unique elements ends
    if (isUnique) {
      try {
        await addDoc(collection(db, "Products"), {
          Name: productName,
          Price: Number(productPrice),
          Category: productCategory,
          Description: productDescription,
          Image: imgUrl,
          IsFeatured: true,
        });

        console.log("Product uploaded successfully!");
      } catch (error) {
        console.error("Error uploading product:", error);
        alert("Error uploading product. Please try again.");
      }

      console.log("Product uploaded successfully!");
    } else {
      alert("product already exists");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="number"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
        <input
          className="form-input"
          type="text"
          placeholder="Category"
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
          required
        />
        <textarea
          className="form-input"
          placeholder="Description"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          required
        ></textarea>
        {/* <input
          className="form-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required
        /> */}
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

export default AddProduct;
