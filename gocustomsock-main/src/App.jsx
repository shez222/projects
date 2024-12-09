"use client";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCartPlus, FaSignOutAlt } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import { spiral } from "ldrs";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

import "./../src/globals.css";
import Swatches from "./components/colorswatches";
import * as THREE from "three";
import { Suspense } from "react";
import { Canvas, events } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Modal, Button, Form, Input, Tooltip, Checkbox } from "antd";
// Component Import
import { combineTextures } from "./combine_texture";
import { combinePattern } from "./combine_pattern";
import { combineSockcolor } from "./combine_color";
import { combineLogoChange } from "./comine_logo";
import Menu from "./components/menu";
// Component Import

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Sidebar Icons
import FitbitSharpIcon from "@mui/icons-material/FitbitSharp";
import DesignServicesSharpIcon from "@mui/icons-material/DesignServicesSharp";
import TextureSharpIcon from "@mui/icons-material/TextureSharp";
import LocationSearchingSharpIcon from "@mui/icons-material/LocationSearchingSharp";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import EditNoteIcon from "@mui/icons-material/EditNote";
// Sidebar Icons

const cuffColorSwatches = [
  "#401e72",
  "#29217d",
  "#081e2c",
  "#5f6468",
  "#003b49",
];
const heelColorSwatches = [
  "#401e72",
  "#29217d",
  "#081e2c",
  "#5f6468",
  "#003b49",
];
const toeColorSwatches = [
  "#401e72",
  "#29217d",
  "#081e2c",
  "#5f6468",
  "#003b49",
];
spiral.register();
export default function Home() {
  const [cuffColor, setCuffColor] = useState("#ffffff");
  const [heelColor, setHeelColor] = useState("#ffffff");
  const [dsockColor, setDsockColor] = useState(null);
  const [toeColor, setToeColor] = useState("#ffffff");
  const [texture, setTexture] = useState(null);
  const [logo, setLogo] = useState(null);
  const [defaultSockTexture, setDefaultSockTexture] = useState(null);
  const [pattern, setPattern] = useState(""); // Pattern state
  const [logoPlacement, setLogoPlacement] = useState("calf");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedUploadedTexture, setSelectedUploadedTexture] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [notes, setNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlacement, setNewPlacement] = useState("");
  const [isLogoUploadedOrSkipped, setIsLogoUploadedOrSkipped] = useState(false);
  const [isLogoSkipped, setIsLogoSkipped] = useState(false);
  const detailsRef = useRef(null);
  const [sockText, setSockText] = useState(null);
  const inputRef = useRef(null); // Use ref to access the input value directl
  const [sockTextColor, setSockTextColor] = useState("black");
  const [sockTextPlacement, setSockTextPlacement] = useState("Front");
  const [dotColors, setDotColors] = useState([
    "#85BFCB",
    "#01284D",
    "#D9D9D9",
    "#006868",
  ]);
  const [checkBoardColors, setCheckBoardColors] = useState([
    "#282A2C",
    "#E56E46",
    "#CFCFCF",
  ]);
  const [illusionistic_colors, setIllusionisticColors] = useState([
    "#000",
    "#ff0000",
    "#810808",
  ]);
  const [csts1, setCsts1] = useState([
    "#ffffff",
    "#FF0000",
    "#0000FF",
    "#FF0000",
    "#0000FF",
  ]);
  const [csts2, setCsts2] = useState([
    "#023865",
    "#ffffff",
    "#E4CB63",
    "#EBB14A",
    "#F1653F",
  ]);
  const [csts3, setCsts3] = useState([
    "#ffffff",
    "#035CB5",
    "#83C0CC",
    "#E1C85F",
    "#CA0F34",
    "#035CB5",
    "#83C0CC",
    "#E1C85F",
    "#CA0F34",
  ]);
  const [csts4, setCsts4] = useState([
    "#1F1E7A",
    "#83C0CC",
    "#83C0CC",
    "#E1C85F",
    "#CA0F34",
    "#83C0CC",
    "#035CB5",
    "#83C0CC",
    "#E1C85F",
    "#83C0CC",
    "#035CB5",
    "#83C0CC",
    "#E1C85F",
    "#CA0F34",
    "#83C0CC",
    "#83C0CC",
    "#83C0CC",
  ]);

  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState(null);



  const [selectedFont, setSelectedFont] = useState("Raleway"); // Default font



  const handleTexttPlacement = (placement) => {
    setSelectedPlacement(placement);
  };


  // ----------------------------Modell- ----------------------------------
  // Modal Function Start //

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load("/sockTexture.png", (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      // texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      // texture.magFilter = THREE.NearestFilter; // For a more pixelated, sharp look
      // texture.generateMipmaps = true;

      setDefaultSockTexture(texture);
    });
  }, []);

  function Model({ cuffColor, heelColor, toeColor, texture }) {
    const { nodes, materials } = useGLTF("/SockModel.gltf");

    useEffect(() => {
      // Apply default textures
      const defaultCuffTexture = new THREE.TextureLoader().load(
        "/cuffTexture.png"
        // ,(defaultCuffTexture) => {
        //   defaultCuffTexture.encoding = THREE.sRGBEncoding;
        //   defaultCuffTexture.minFilter = THREE.LinearFilter;
        //   defaultCuffTexture.magFilter = THREE.LinearFilter;
        // }
      );
      const defaultHeelTexture = new THREE.TextureLoader().load(
        "/cuffTexture.png"
        // ,(defaultHeelTexture) => {
        //   defaultHeelTexture.encoding = THREE.sRGBEncoding;
        //   // texture.minFilter = THREE.LinearFilter;
        //   defaultHeelTexture.magFilter = THREE.LinearFilter;
        //   }
      );
      const defaultToeTexture = new THREE.TextureLoader().load(
        "/cuffTexture.png"
        // ,(defaultToeTexture) => {
        //   defaultToeTexture.encoding = THREE.sRGBEncoding;
        //   // texture.minFilter = THREE.LinearFilter;
        //   defaultToeTexture.magFilter = THREE.LinearFilter;
        //   }
      );

      materials.Cuff.map = defaultCuffTexture;
      materials.Cuff.needsUpdate = true;

      materials.Heel.map = defaultHeelTexture;
      materials.Heel.needsUpdate = true;

      materials.Toe.map = defaultToeTexture;
      materials.Toe.needsUpdate = true;

      materials.Sock_Texture.map = texture || defaultSockTexture;
      materials.Sock_Texture.needsUpdate = true;

      materials.Cuff.color.set(cuffColor);
      materials.Cuff.needsUpdate = true;

      materials.Heel.color.set(heelColor);
      materials.Heel.needsUpdate = true;

      materials.Toe.color.set(toeColor);
      materials.Toe.needsUpdate = true;
    }, [
      cuffColor,
      heelColor,
      toeColor,
      dsockColor,
      texture,
      materials,
      defaultSockTexture,
    ]);

    return (
      <group dispose={null} position={[0, -0.15, 0]}>
        <mesh
          geometry={nodes.mesh005_3.geometry}
          material={materials.Cuff}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.mesh005.geometry}
          material={materials.Sock_Texture}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.mesh005_1.geometry}
          material={materials.Heel}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.mesh005_2.geometry}
          material={materials.Toe}
          castShadow
          receiveShadow
        />
      </group>
    );
  }
  // --------------------------------------------------------------------------

  const handleSkipLogo = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute("open");
    }
    setIsLogoUploadedOrSkipped(true);
  };

  const handleLogoUploadAndOptionClick = (option) => {
    setIsLogoUploadedOrSkipped(true);

    if (!activeOptions.includes(option)) {
      setActiveOptions([...activeOptions, option]);
    }
  };

  const handleCuffColorChange = (event, index) => {
    const updatedColors = [...cuffColorSwatches];
    updatedColors[index] = event.target.value;
    setCuffColor(updatedColors);
    // updatePattern(pattern);
  };

  // --------------------------SOCK COLOR-----------------------------
  const handleColorOnChange = (color) => {
    // console.log(color);
    setPattern(null);
    setSelectedUploadedTexture(null);
    setTexture(null);

    setDsockColor(color);
    if (defaultSockTexture) {
      const updatedTexture = combineSockcolor(
        defaultSockTexture,
        logo,
        logoPlacement,
        color,
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
  };

  // --------------------textureUPload-----------------------------------------
  const handleTextureChange = (event) => {
    setPattern(null);
    setDsockColor(null);
    setTexture(null);

    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Display the selected image in the UI
        setSelectedUploadedTexture(reader.result);
        processTexture(reader.result); // Move the processing logic to a separate function
      };
      reader.readAsDataURL(file);
    }
  };

  const processTexture = (textureURL) => {
    if (textureURL && defaultSockTexture) {
      const img = new Image();
      img.src = textureURL;

      img.onload = () => {
        // Create a canvas to draw the image and apply transformations
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;

        // Flip the image upside down
        ctx.translate(0, img.height);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Create a new Image object with the flipped image
        const flippedImage = new Image();
        flippedImage.src = canvas.toDataURL();

        flippedImage.onload = () => {
          // Merge the flipped image with the existing texture and logo
          const mergedTexture = combineTextures(
            defaultSockTexture,
            flippedImage,
            logo,
            logoPlacement,
            sockText,
            sockTextColor,
            sockTextPlacement,
            selectedFont
          );
          mergedTexture.encoding = THREE.sRGBEncoding;
          mergedTexture.magFilter = THREE.LinearFilter;
          setTexture(mergedTexture);
        };
      };
    }
  };
  const handleTextureDelete = () => {
    setSelectedUploadedTexture(null);
    setDsockColor(null);
    setPattern("");
    if (defaultSockTexture) {
      const updatedTexture = combineTextures(
        defaultSockTexture,
        null,
        logo,
        logoPlacement,
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
    const textureInput = document.getElementById("textureInput");
    if (textureInput) {
      textureInput.value = "";
    }
  };
  // -----------------PATTERN-------------------------------------------
  const updatePattern = (newPattern) => {
    setDsockColor(null);
    setSelectedUploadedTexture(null);
    setTexture(null);
    console.log(sockText, sockTextColor, sockTextPlacement);

    if (defaultSockTexture) {
      const updatedTexture = combinePattern(
        defaultSockTexture,
        logo,
        newPattern,
        logoPlacement,
        dotColors,
        checkBoardColors,
        illusionistic_colors,
        csts1,
        csts2,
        csts3,
        csts4,
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
  };
  useEffect(() => {
    if (pattern) {
      // console.log(pattern);
      updatePattern(pattern); // Ensure texture updates on pattern change
    } else if (selectedUploadedTexture) {
      // console.log(selectedUploadedTexture);
      console.log("texture");

      processTexture(selectedUploadedTexture);
    } else if (dsockColor) {
      // console.log(dsockColor);
      handleColorOnChange(dsockColor);
    } else {
      // console.log("nothing");
      console.log("nothing");

      handleTextPlacement(sockTextPlacement); // Ensure texture updates on pattern change
    }
  }, [
    dotColors,
    checkBoardColors,
    illusionistic_colors,
    csts1,
    csts2,
    csts3,
    csts4,
    pattern,
    sockText,
    sockTextColor,
    selectedFont,
    sockTextPlacement,
    dsockColor,
    selectedUploadedTexture,
  ]);

  const handlePatternChange = (event) => {
    const newPattern = event.target.value;
    setPattern(newPattern);
    updatePattern(newPattern);
  };

  const handleDotColorChange = (event, index) => {
    const updatedColors = [...dotColors];
    updatedColors[index] = event.target.value;
    setDotColors(updatedColors);
    updatePattern(pattern);
  };

  const handleCheckBoardColorChange = (event, index) => {
    const updatedColors = [...checkBoardColors];
    updatedColors[index] = event.target.value;
    setCheckBoardColors(updatedColors);
    updatePattern(pattern);
  };

  const handleIllusionisticColorChange = (event, index) => {
    const updatedColors = [...illusionistic_colors];
    updatedColors[index] = event.target.value;
    setIllusionisticColors(updatedColors);
    updatePattern(pattern);
  };

  const handleCsts1Change = (event, index) => {
    const updatedColors = [...csts1];
    updatedColors[index] = event.target.value;
    setCsts1(updatedColors);
    updatePattern(pattern);
  };

  const handleCsts2Change = (event, index) => {
    const updatedColors = [...csts2];
    updatedColors[index] = event.target.value;
    setCsts2(updatedColors);
    updatePattern(pattern);
  };

  const handleCsts3Change = (event, index) => {
    const updatedColors = [...csts3];
    updatedColors[index] = event.target.value;
    setCsts3(updatedColors);
    updatePattern(pattern);
  };

  const handleCsts4Change = (event, index) => {
    const updatedColors = [...csts4];
    updatedColors[index] = event.target.value;
    setCsts4(updatedColors);
    updatePattern(pattern);
  };

  // ---------------------------------------------------------------------
  // useEffect(() => {
  //   return () => {
  //     if (texture) {
  //       texture.dispose(); // Dispose of the texture to free up memory
  //     }
  //   };
  // }, [texture]);

  // ---------------------------Logo------------------------------------------
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleLogoDelete = () => {
    // Clear the logo state
    setSelectedImage(null); // Ensure this matches the state used for preview
    setLogo(null);

    // Clear the image from the model
    if (defaultSockTexture) {
      const updatedTexture = combineLogoChange(
        defaultSockTexture,
        logo, // Set to null or a default placeholder as needed
        "no_logo",
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }

    // Clear the file input value
    const logoInput = document.getElementById("logoInput");
    if (logoInput) {
      logoInput.value = ""; // Reset the input value
    }
  };

  const handleContinue = () => {
    handleTextureDelete();

    setLogoPlacement(newPlacement);
    if (defaultSockTexture) {
      const updatedTexture = combineLogoChange(
        defaultSockTexture,
        logo,
        newPlacement,
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
    setIsModalOpen(false);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Create a FileReader to read the file and display the image
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the selected image to display it in the UI
        setSelectedImage(reader.result);

        // Create an Image object to handle the file
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          // Create a canvas to draw the image and apply transformations
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Set canvas dimensions to match the image
          canvas.width = img.width;
          canvas.height = img.height;

          // Flip the image upside down
          ctx.translate(0, img.height);
          ctx.scale(1, -1);
          ctx.drawImage(img, 0, 0, img.width, img.height);

          // Create a new Image object with the flipped image
          const flippedImage = new Image();
          flippedImage.src = canvas.toDataURL();

          flippedImage.onload = () => {
            setLogo(null);
            setLogo(flippedImage);

            // Call the removeBackground function and handle the result
            // console.log(removeBackground(flippedImage));

            if (defaultSockTexture) {
              // Combine the textures and update the texture state
              const updatedTexture = combineTextures(
                defaultSockTexture,
                texture?.image,
                flippedImage,
                logoPlacement,
                sockText,
                sockTextColor,
                sockTextPlacement,
                selectedFont
              );
              updatedTexture.encoding = THREE.sRGBEncoding;
              // updatedTexture.minFilter = THREE.LinearFilter;
              updatedTexture.magFilter = THREE.LinearFilter;
              setTexture(updatedTexture);
            }
          };
        };
      };
      // Read the file as a Data URL for displaying it in the UI
      reader.readAsDataURL(file);

      // Close the <details> tag after uploading the logo
      if (detailsRef.current) {
        detailsRef.current.removeAttribute("open");
      }
    }
  };

  const handleLogoPlacementChange = (placement) => {
    // const newLogoPlacement = event.target.value;
    setNewPlacement(placement);
    setIsModalOpen(true);
  };
  const handleLogoPlacement2 = (placement) => {
    // const newLogoPlacement = event.target.value;
    setLogoPlacement(placement);
    if (defaultSockTexture) {
      // console.log(logoPlacement);
      const updatedTexture = combineLogoChange(
        defaultSockTexture,
        logo,
        placement,
        sockText,
        sockTextColor,
        sockTextPlacement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      // updatedTexture.minFilter = THREE.LinearFilter;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
  };
  // ---------------------------------Handle Text--------------------------------------
  const handleSubmitText = (text) => {
    setSockText(text); // Apply the text to the model here
  };
  const handleTextPlacement = (placement) => {
    setSockTextPlacement(placement);
    if (defaultSockTexture) {
      const updatedTexture = combineLogoChange(
        defaultSockTexture,
        logo,
        logoPlacement,
        sockText,
        sockTextColor,
        placement,
        selectedFont
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
  };
  const handleFontChange = (event) => {
    console.log(event.target.value);
    let style = event.target.value;

    setSelectedFont(style);
    if (defaultSockTexture) {
      const updatedTexture = combineLogoChange(
        defaultSockTexture,
        logo,
        logoPlacement,
        sockText,
        sockTextColor,
        sockTextPlacement,
        style
      );
      updatedTexture.encoding = THREE.sRGBEncoding;
      updatedTexture.magFilter = THREE.LinearFilter;
      setTexture(updatedTexture);
    }
  };
  // --------------------------------------------------------------------

  const handleSave = async () => {
    if (!texture) {
      // Show error if no texture is available
      toast.error(
        "No texture uploaded. Please upload a texture before saving."
      );
      return; // Exit the function early
    }

    setLoading(true); // Show loader
    // test hata dena 
    alert("sucess");
    setLoading(false); // Show loader
    // 

    // const canvas = document.createElement("canvas");
    // canvas.width = texture.image.width;
    // canvas.height = texture.image.height;
    // const context = canvas.getContext("2d");

    // // Flip the image vertically
    // context.translate(0, canvas.height);
    // context.scale(1, -1); // Scale Y-axis by -1 to flip vertically

    // // Draw the image
    // context.drawImage(texture.image, 0, 0);

    // canvas.toBlob(async (blob) => {
    //   const formData = new FormData();
    //   formData.append("file", blob, "customized_sock_texture.png");
    //   const username = "socksadmin";
    //   const password = "JoIl 8Qvr L7j5 6ZRN 9MDT nlm6";

    //   const credentials = btoa(`${username}:${password}`);
    //   // console.log("skjdkj");

    //   try {
    //     const response = await fetch(
    //       "https://gocustomsock.com/wp-json/wp/v2/media",
    //       {
    //         method: "POST",
    //         headers: {
    //           Authorization: `Basic ${credentials}`,
    //         },
    //         body: formData,
    //       }
    //     );

    //     if (response.ok) {
    //       const data = await response.json();
    //       toast.success(`Upload successful! Image ID: ${data.id}`);
    //       handleSubmit(data.id); // Pass the image ID to the submit function
    //     } else {
    //       const errorData = await response.json();
    //       toast.error(`Upload failed: ${errorData.message || "Unknown error"}`);
    //     }
    //   } catch (error) {
    //     toast.error("An error occurred during the upload.");
    //   } finally {
    //     setLoading(false); // Hide loader
    //   }
    // }, "image/png");
  };




  const handleSubmit = async (imageId) => {
    setLoading(true);

    const data = {
      name,
      phone,
      email,
      notes,
      sockDesign: parseInt(imageId, 10),
      cuffColor,
      toeColor,
      heelColor,
      text: sockText,
      textstyle: selectedFont,
      textcolor: sockTextColor,
    };

    try {
      const response = await axios.post(
        "https://gocustomsock.com/wp-json/socks/v1/order",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      toast.success("Data submitted successfully!");
      // Close the modal or reset the form if necessary
    } catch (error) {
      console.error("Error sending data:", error);
      toast.error("Error submitting data.");
    } finally {
      setLoading(false); // Hide loader after submission
    }
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setLoading(false); // Reset loader state when closing the modal
  };

  // Modal Function End //

  const [open, setOpen] = useState(true);
  const [activeOptions, setActiveOptions] = useState([]);

  const handleOptionClick = (option) => {
    if (!activeOptions.includes(option)) {
      setActiveOptions([...activeOptions, option]);
    }
  };

  const handleDelete = (option) => {
    setActiveOptions(activeOptions.filter((opt) => opt !== option));
  };

  const scroll = (amount) => {
    const container = document.querySelector(".scroll-container");
    container?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const renderToolbarContent = (option) => {
    switch (option) {
      case "Upload Logo":
        return (
          <>
            <div className="w-full h-full flex justify-between gap-x-5 items-center my-2 mx-1 lg:mx-2">
              {!selectedImage ? (
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center relative  w-60 md:w-96 flex flex-col justify-center items-center">
                  <CloudUploadIcon style={{ fontSize: 35, color: "red" }} />
                  <p className="text-gray-500 text-sm capitalize font-semibold">
                    Upload your image here
                  </p>
                  <input
                    id="logoInput"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleLogoChange}
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="w-60 md:w-64 rounded-lg  shadow-lg relative overflow-visible bg-white">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="w-full h-24 object-cover"
                    />
                    <Tooltip title="Delete">
                      <ClearIcon
                        onClick={handleLogoDelete}
                        className="absolute -top-5 right-0 text-red-500 animate-bounce cursor-pointer"
                        style={{ fontSize: 18 }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
              {selectedImage && (
                <div className="w-60 md:w-96 space-y-4 px-5">
                  <div className="grid grid-cols-2 gap-4">
                    {["calf", "footbed", "calf_footbed", "repeating"].map(
                      (placement) => (
                        <div
                          key={placement}
                          className={`flex items-center justify-center text-xs lg:text-base p-1 lg:p-2 text-center border rounded-lg cursor-pointer transition duration-150 ease-in-out ${logoPlacement === placement
                              ? "bg-red-500 text-white border-red-500"
                              : "bg-white text-gray-700 border-gray-300"
                            } hover:bg-blue-100 hover:text-black`}
                          onClick={() => {
                            if (
                              dsockColor !== null ||
                              pattern !== "" ||
                              selectedUploadedTexture !== null
                            ) {
                              handleLogoPlacementChange(placement);
                            } else {
                              handleLogoPlacement2(placement);
                            }
                          }}
                        >
                          {placement.charAt(0).toUpperCase() +
                            placement.slice(1).replace("_", " ")}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {(dsockColor !== null ||
                pattern !== "" ||
                selectedUploadedTexture !== null) && (
                  <Modal
                    title={null}
                    visible={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    centered
                    className="custom-modal rounded-lg !font-[Raleway]"
                  >
                    <div className="w-full h-auto p-3 lg:p-12 rounded-lg flex flex-col items-center">
                      <div className="bg-red-300 rounded-full p-3 mb-6 flex items-center justify-center">
                        <IoIosWarning className="text-red-500 text-4xl animate-pulse" />
                      </div>
                      <h1 className="text-3xl font-bold text-red-600 text-center mb-5">
                        Warning: Changing Logo Position Without Saving
                      </h1>
                      <p className="text-gray-500 text-lg text-center tracking-tight leading-7 mb-8">
                        Switching to a different logo position without saving your
                        current design will erase any changes you've made. If you
                        are certain about changing the position and accept the
                        loss of your current design, feel free to click
                        "Continue".
                      </p>
                      <div className="flex flex-col space-y-4 w-full">
                        <button
                          onClick={handleCancel}
                          className="border border-red-600 py-4 rounded-md text-lg font-semibold text-red-600 hover:bg-red-600  transition  hover:text-white focus:ring-blue-400 w-full"
                        >
                          Edit Current Design
                        </button>
                        <button
                          onClick={handleContinue}
                          className="bg-red-600 text-white py-4 text-lg rounded-md font-semibold hover:bg-red-700 focus:ring-red-400 w-full"
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}
            </div>
          </>
        );

      case "Upload Text":
        return (
          <>
            <div className="w-full h-full flex justify-between items-center my-2 mx-1 lg:mx-2">
              <div className="p-6 rounded-lg text-center relative h-28 w-60 md:w-96 flex flex-col justify-center items-start space-y-2">
                <p className="text-gray-500 text-sm capitalize font-semibold text-left">
                  Enter your text here
                </p>
                <input
                  id="textInput"
                  type="text"
                  placeholder="Type to Preview"
                  className={`border-2 border-gray-300 rounded-md p-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                  style={{ fontFamily: selectedFont }} // Apply selected Google Font
                  ref={inputRef} // Reference to access the input value directly
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 text-sm px-4 font-medium"
                  onClick={() => handleSubmitText(inputRef.current.value)} // Submit on button click
                >
                  Submit
                </button>
              </div>

              {sockText && (
                <>
                  <div className="w-96 lg:w-full border border-gray-200 bg-white p-2 lg:p-5 space-y-1 lg:space-y-3 rounded-lg -mt-8">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold tracking-tight">
                        Customize Color:
                      </span>
                      <div className="bg-transparent rounded-full flex justify-center items-center border border-gray-800 cursor-pointer w-8 h-8">
                        <label
                          htmlFor="colorInput"
                          className="flex justify-center items-center"
                        >
                          <AddIcon htmlColor="#000000" />
                        </label>
                        <input
                          type="color"
                          id="colorInput"
                          className="opacity-0 absolute cursor-pointer"
                          onChange={(e) => setSockTextColor(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                    <span className="text-sm font-bold tracking-tight">Text Positions:</span>
                    <div className="grid grid-cols-5 gap-1 mt-2 ">
                      {[ "Front","bottom", "Repeat", "Calf", "Calf+Bottom"].map((placement) => (
                        <button
                          key={placement}
                          className={`flex items-center justify-center text-xs  p-1 lg:p-2 border rounded-lg cursor-pointer transition duration-150 ease-in-out ${
                            sockTextPlacement === placement
                              ? "bg-red-700 text-white border-red-700"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-red-700 hover:text-white"
                          }`}
                          onClick={() => {
                            handleTextPlacement(placement);
                          }}
                        >
                          {placement.charAt(0).toUpperCase() +
                            placement.slice(1).replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                    <div className="flex justify-between items-center">
                      <label className="text-gray-600 text-sm font-medium mr-2">
                        Choose Font:
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(event) => handleFontChange(event)} // Update selected Google Font
                        className="border border-gray-300 rounded-md p-1 text-sm"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Trebuchet MS">Trebuchet MS</option>
                        <option value="Comic Sans MS">Comic Sans MS</option>
                        <option value="Impact">Impact</option>
                        <option value="Lucida Sans">Lucida Sans</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

            </div>
          </>
        );
      case "Upload Texture":
        return (
          <>
            <div className="w-full h-full flex justify-between items-center my-3 mx-0 md:mx-2">
              {!selectedUploadedTexture ? (
                <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center relative  w-60 md:w-96 flex flex-col justify-center items-center">
                  <CloudUploadIcon style={{ fontSize: 35, color: "red" }} />
                  <p className="text-gray-500 text-sm capitalize font-semibold">
                    Upload your Texture
                  </p>
                  <input
                    id="textureInput"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleTextureChange}
                  />
                </div>
              ) : (
                <div className="w-60  rounded-lg  shadow-lg relative overflow-visible bg-white">
                  <img
                    src={selectedUploadedTexture}
                    alt="Selected Texture"
                    className="w-full h-24 object-cover"
                  />
                  <Tooltip title="Delete">
                    <ClearIcon
                      onClick={handleTextureDelete}
                      className="absolute top-1 right-1 text-red-500 cursor-pointer"
                      style={{ fontSize: 18 }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          </>
        );
      case "Choose Pattern":
        return (
          <>
            <div className="flex flex-col justify-center items-center my-3 mx-0 md:my-2 md:mx-2 h-24 lg:h-40 w-[240px]">
              <select
                value={pattern}
                onChange={handlePatternChange}
                className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              >
                <option value="" className="text-gray-500">
                  None
                </option>
                <option value="dots">Dots</option>
                <option value="checkerboard">Checkerboard</option>
                <option value="illusionistic">Illusionistic</option>
                <option value="custom_1">Custom-1</option>
                <option value="custom_2">Custom-2</option>
                <option value="custom_3">Custom-3</option>
                <option value="custom_4">Custom-4</option>
              </select>

              {pattern === "dots" && (
                <div className="flex flex-col justify-center items-center w-full gap-2 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center mt-3">
                    Colors:
                  </h2>
                  <div className="grid grid-cols-4 gap-2">
                    {dotColors.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) => handleDotColorChange(event, index)}
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {pattern === "checkerboard" && (
                <div className="flex flex-col justify-center items-center w-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center mt-3">
                    Colors:
                  </h2>
                  <div className="grid grid-cols-4 items-center justify-center gap-2">
                    {checkBoardColors.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) =>
                          handleCheckBoardColorChange(event, index)
                        }
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
              {pattern === "illusionistic" && (
                <div className="flex flex-col justify-center items-center w-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center mt-3">
                    Colors:
                  </h2>
                  <div className="grid grid-cols-4 items-center justify-center gap-2">
                    {illusionistic_colors.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) =>
                          handleIllusionisticColorChange(event, index)
                        }
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {pattern === "custom_1" && (
                <div className="flex flex-col justify-center items-center w-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center mt-3">
                    Colors:
                  </h2>
                  <div className="grid grid-cols-5 items-center justify-center gap-2">
                    {csts1.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) => handleCsts1Change(event, index)}
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {pattern === "custom_2" && (
                <div className="flex flex-col justify-center items-center w-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center mt-3">
                    Colors:
                  </h2>
                  <div className="grid grid-cols-5 items-center justify-center gap-2">
                    {csts2.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) => handleCsts2Change(event, index)}
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {pattern === "custom_3" && (
                <div className="flex flex-col justify-center items-center w-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center">
                    Colors:
                    <br />
                    <span className="text-xs">(Scroll To View)</span>
                  </h2>
                  <div className="grid grid-cols-5 items-center justify-center gap-2 h-12">
                    {csts3.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) => handleCsts3Change(event, index)}
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {pattern === "custom_4" && (
                <div className="flex flex-col justify-center items-center w-full h-full gap-4 cursor-pointer">
                  <h2 className="text-sm font-semibold text-nowrap text-gray-600 text-center">
                    Colors: <br />
                    <span className="text-xs">(Scroll To View)</span>
                  </h2>
                  <div className="grid grid-cols-5 items-center justify-center gap-2 h-20 overflow-y-auto">
                    {csts4.map((color, index) => (
                      <input
                        key={index}
                        type="color"
                        value={color}
                        onChange={(event) => handleCsts4Change(event, index)}
                        className="w-[35px] h-[35px] rounded-full cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case "Customize Color":
        return (
          <>
            <div className="p-2 flex flex-col w-[1200px] h-24">
              <div className="grid gap-3 grid-cols-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cuff Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cuffColorSwatches.map((color) => (
                      <button
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full border-2 ${cuffColor === color
                            ? "border-blue-500"
                            : "border-gray-300"
                          } transition-transform transform hover:scale-110`}
                        onClick={() => setCuffColor(color)}
                      />
                    ))}
                    <div className="bg-transparent w-10 h-10 rounded-full flex justify-center items-center border border-gray-800 cursor-pointer">
                      <label
                        htmlFor="colorInput"
                        className="flex justify-center items-center"
                      >
                        <AddIcon htmlColor="#000000" />
                      </label>
                      <input
                        type="color"
                        id="colorInput"
                        className="opacity-0 absolute  cursor-pointer"
                        onChange={(e) => setCuffColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Heel Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {heelColorSwatches.map((color) => (
                      <button
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full border-2 ${heelColor === color
                            ? "border-blue-500"
                            : "border-gray-300"
                          } transition-transform transform hover:scale-110`}
                        onClick={() => setHeelColor(color)}
                      />
                    ))}
                    <div className="bg-transparent w-10 h-10 rounded-full flex justify-center items-center border border-gray-800 cursor-pointer">
                      <label
                        htmlFor="colorInput"
                        className="flex justify-center items-center"
                      >
                        <AddIcon htmlColor="#000000" />
                      </label>
                      <input
                        type="color"
                        id="colorInput"
                        className="opacity-0 absolute  cursor-pointer"
                        onChange={(e) => setHeelColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Sock Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Swatches onSelectColor={handleColorOnChange} />
                    <div className="bg-transparent w-10 h-10 rounded-full flex justify-center items-center border border-gray-800 cursor-pointer">
                      <label
                        htmlFor="colorInput"
                        className="flex justify-center items-center"
                      >
                        <AddIcon htmlColor="#000000" />
                      </label>
                      <input
                        type="color"
                        id="colorInput"
                        className="opacity-0 absolute  cursor-pointer"
                        onChange={(e) => handleColorOnChange(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Toe Color:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {toeColorSwatches.map((color) => (
                      <button
                        key={color}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-full border-2 ${toeColor === color
                            ? "border-blue-500"
                            : "border-gray-300"
                          } transition-transform transform hover:scale-110`}
                        onClick={() => setToeColor(color)}
                      />
                    ))}
                    <div className="bg-transparent w-10 h-10 rounded-full flex justify-center items-center border border-gray-800 cursor-pointer">
                      <label
                        htmlFor="colorInput"
                        className="flex justify-center items-center"
                      >
                        <AddIcon htmlColor="#000000" />
                      </label>
                      <input
                        type="color"
                        id="colorInput"
                        className="opacity-0 absolute  cursor-pointer"
                        onChange={(e) => setToeColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <p>Unknown Option</p>;
    }
  };
  // softShadows();
  return (
    <div className="h-screen w-full flex">
      {/* Sidebar for large screens */}
      <div
        className={`sidebar lg:block sm:hidden md:hidden border border-[#efeee8] shadow-xl duration-500 ${open ? "w-[18%]" : "w-[84px]"
          }`}
      >
        <div className="flex justify-normal items-center h-20 px-3 mb-8">
          <div>
            <button
              onClick={() => setOpen(!open)}
              className={`rounded-full duration-500 p-5 ${!open ? "rotate-180" : "rotate-0"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width={25}
                height={25}
                viewBox="0 0 50 50"
                fill="sidebarTEXT"
              >
                <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z" />
              </svg>
            </button>
          </div>
          {open && (
            <img
              src="https://gocustomsock.com/wp-content/uploads/2024/07/Logo3_vectorized-removebg-preview-e1724879817878.png"
              className="w-36"
              alt=""
            />
          )}
        </div>
        <div className="px-2 flex flex-col gap-y-3">
          <div className="px-2 flex flex-col gap-y-3">
            <div className="px-4 flex flex-col gap-y-10">
              <details ref={detailsRef} className="w-full" open>
                <summary
                  className={`py-3 flex gap-x-4 cursor-pointer hover:bg-blue-50 rounded-lg p-1 ${isLogoSkipped ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  <FitbitSharpIcon htmlColor="#E3262C" />
                  {open && (
                    <div>
                      <h1 className="text-sidebarTEXT font-semibold">
                        Logo and Placement
                      </h1>
                    </div>
                  )}
                </summary>
                <div className="flex flex-col items-start px-4 space-y-3 w-full ml-3">
                  {open && (
                    <>
                      <button
                        className={`w-full text-sm cursor-pointer px-4 py-2 rounded-full font-bold transition duration-150 ease-in-out
                        ${!isLogoSkipped
                            ? "bg-[#E3262C] text-white hover:bg-red-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        onClick={
                          !isLogoSkipped
                            ? () =>
                              handleLogoUploadAndOptionClick("Upload Logo")
                            : null
                        }
                        disabled={isLogoSkipped}
                      >
                        Click to upload Logo
                      </button>

                      <button
                        className="w-full text-sm bg-gray-500 text-white font-bold px-4 py-2 rounded-full hover:bg-gray-600 transition duration-150 ease-in-out"
                        onClick={handleSkipLogo}
                      >
                        Skip Logo Upload
                      </button>
                    </>
                  )}
                </div>
              </details>

              <div
                className={`pb-3 flex gap-x-4 cursor-pointer hover:bg-blue-50 rounded-lg w-full p-1 ${!isLogoUploadedOrSkipped && "opacity-50 cursor-not-allowed"
                  }`}
                onClick={
                  isLogoUploadedOrSkipped
                    ? () => handleOptionClick("Upload Text")
                    : null
                }
              >
                <EditNoteIcon htmlColor="#E3262C" />
                {open && (
                  <h1 className="text-sidebarTEXT font-semibold">
                    Upload Text
                  </h1>
                )}
              </div>

              {/* Upload Texture option */}
              <div
                className={`pb-3 flex gap-x-4 cursor-pointer hover:bg-blue-50 rounded-lg w-full p-1 ${!isLogoUploadedOrSkipped && "opacity-50 cursor-not-allowed"
                  }`}
                onClick={
                  isLogoUploadedOrSkipped
                    ? () => handleOptionClick("Upload Texture")
                    : null
                }
              >
                <TextureSharpIcon htmlColor="#E3262C" />
                {open && (
                  <h1 className="text-sidebarTEXT font-semibold">
                    Upload Texture
                  </h1>
                )}
              </div>

              {/* Choose Pattern option */}
              <div
                className={`py-3 flex gap-x-4 cursor-pointer hover:bg-blue-50 rounded-lg w-full p-1 ${!isLogoUploadedOrSkipped && "opacity-50 cursor-not-allowed"
                  }`}
                onClick={
                  isLogoUploadedOrSkipped
                    ? () => handleOptionClick("Choose Pattern")
                    : null
                }
              >
                <DesignServicesSharpIcon htmlColor="#E3262C" />
                {open && (
                  <h1 className="text-sidebarTEXT font-semibold">
                    Choose Pattern
                  </h1>
                )}
              </div>

              {/* Customize Color option */}
              <div
                className={`py-3 flex gap-x-4 cursor-pointer hover:bg-blue-50 rounded-lg w-full p-1 ${!isLogoUploadedOrSkipped && "opacity-50 cursor-not-allowed"
                  }`}
                onClick={
                  isLogoUploadedOrSkipped
                    ? () => handleOptionClick("Customize Color")
                    : null
                }
              >
                <LocationSearchingSharpIcon htmlColor="#E3262C" />
                {open && (
                  <h1 className="text-sidebarTEXT font-semibold">
                    Customize Color
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sidebar for small screens */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 lg:hidden mx-auto">
        <div className="flex justify-center items-center h-16 px-2 mb-6">
          <div className="flex flex-row justify-center items-center gap-y-2">
            <div className="py-2 px-2 flex flex-row gap-y-2 bg-red-100 rounded-lg ">
              <Tooltip title="Upload Logo" placement="bottomRight">
                <div
                  className="flex justify-center items-center gap-x-2 cursor-pointer hover:bg-blue-50 rounded-lg p-2"
                  onClick={() => handleOptionClick("Upload Logo")}
                >
                  <FitbitSharpIcon htmlColor="#E3262C" className="text-sm" />
                </div>
              </Tooltip>
              <Tooltip title="Upload Text" placement="bottomRight">
                <div
                  className="flex justify-center items-center gap-x-2 cursor-pointer hover:bg-blue-50 rounded-lg p-2"
                  onClick={() => handleOptionClick("Upload Text")}
                >
                  <EditNoteIcon htmlColor="#E3262C" className="text-sm" />
                </div>
              </Tooltip>

              <Tooltip title="Upload Texture" placement="bottomRight">
                <div
                  className="flex justify-center items-center gap-x-2 cursor-pointer hover:bg-blue-50 rounded-lg p-2"
                  onClick={() => handleOptionClick("Upload Texture")}
                >
                  <TextureSharpIcon htmlColor="#E3262C" className="text-sm" />
                </div>
              </Tooltip>

              <Tooltip title="Choose Pattern" placement="bottomRight">
                <div
                  className="flex justify-center items-center gap-x-2 cursor-pointer hover:bg-blue-50 rounded-lg p-2"
                  onClick={() => handleOptionClick("Choose Pattern")}
                >
                  <DesignServicesSharpIcon
                    htmlColor="#E3262C"
                    className="text-sm"
                  />
                </div>
              </Tooltip>

              <Tooltip title="Customize Color" placement="bottomRight">
                <div
                  className="flex justify-center items-center gap-x-2 cursor-pointer hover:bg-blue-50 rounded-lg p-2"
                  onClick={() => handleOptionClick("Customize Color")}
                >
                  <LocationSearchingSharpIcon
                    htmlColor="#E3262C"
                    className="text-sm"
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative w-full duration-500 ${open ? "w-[82%]" : "w-[100%]"
          }`}
      >
        <div className="border border-t-gray-200 border-b-0 border-l-0 border-r-0 w-full h-[8%] flex justify-center items-center bg-transparent">
          <div className="w-full h-4/5 lg:h-full absolute left-0 top-3 lg:-top-20 mb-56 lg:mb-0">
            <Canvas camera={{ position: [1, 0, 1], fov: 50 }} shadows>
              <Suspense fallback={null}>
                <ambientLight intensity={0.6} />
                <spotLight
                  intensity={0.5}
                  angle={0.6}
                  // penumbra={0}
                  position={[0, 5, 2]}
                  castShadow
                  shadow-mapSize-width={2048}
                  shadow-mapSize-height={2048}
                />
                <Model
                  cuffColor={cuffColor}
                  heelColor={heelColor}
                  toeColor={toeColor}
                  texture={texture}
                />
                <mesh
                  receiveShadow
                  position={[0, -0.17, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                >
                  <planeGeometry args={[5, 5]} />
                  <shadowMaterial opacity={0.2} />
                </mesh>
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={0.6}
                  minDistance={0.32}
                />
              </Suspense>
            </Canvas>
          </div>
          <div className="mt-6 flex gap-x-2 absolute top-0 right-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <div className="space-x-3 hidden sm:block">
                <button
                  onClick={handleOpenModal}
                  className="mb-4 p-2 text-sm lg:text-base bg-[#E3262C] text-white font-semibold sm:rounded-lg rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  Buy Now
                </button>

                <a href="">
                  <button className="mb-4 p-2 text-sm lg:text-base bg-[#E3262C] text-white font-semibold sm:rounded-lg rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out">
                    Exit Editor
                  </button>
                </a>
              </div>
            </div>

            <div className="flex flex-col mt-24 md:flex-row md:items-center sm:hidden">
              <div className="mb-4 md:mb-0 ">
                <button
                  onClick={handleOpenModal}
                  className="flex items-center justify-center px-4 py-3 md:px-4 md:py-1 text-sm lg:text-base bg-[#E3262C] text-white font-semibold  rounded-full shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  <span className="hidden md:inline">Buy Now</span>
                  <FaCartPlus className="md:hidden h-5 w-5" />
                </button>
              </div>

              <a href="">
                <button className="flex items-center justify-center px-4 py-3 md:px-4 md:py-1 text-sm lg:text-base bg-[#E3262C] text-white sm:rounded-lg rounded-full font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out">
                  <span className="hidden md:inline">Exit Editor</span>
                  <FaSignOutAlt className="md:hidden h-5 w-5" />
                </button>
              </a>
            </div>

            <ToastContainer />


            <Modal
              visible={isModalVisible}
              onOk={handleSave}
              onCancel={handleCloseModal}
              okText="Upload and Submit"
              width={window.innerWidth < 540 ? "90%" : 600} // This gives a max width of 90% on mobile devices
              centered
              className="!font-[Raleway]"
              footer={[
                <div
                  className="flex flex-col items-center space-y-2"
                  key="footer-buttons"
                >
                  <div className="flex justify-center space-x-4 w-full">
                    <button
                      onClick={handleCloseModal}
                      className=" md:text-xl text-lg text-black border border-black md:py-4 py-2 md:px-4  rounded w-full"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-red-500 hover:bg-red-700 md:py-4 py-2 text-xl text-white px-4 rounded w-full"
                    >
                      Save
                    </button>
                  </div>
                  <p className="text-center mt-2 text-lg font-semibold">
                    Have an account?{" "}
                    <a
                      href=""
                      className="text-blue-500 underline"
                    >
                      Login
                    </a>
                  </p>
                </div>,
              ]}
            >

              <Form
                onFinish={handleSubmit}
                layout="vertical"
                className="!font-[Raleway] space-y-3 lg:space-y-5"
              >
                <h1 className="text-center md:text-xl text-lg font-bold">
                  Where should we send your socks design?
                </h1>
                <p className="text-center text-gray-600">
                  Some designs may require adjustments to ensure optimal
                  knitting quality. Our team of expert designers will carefully
                  review your submission and provide feedback within 24 business
                  hours.
                </p>

                <Form.Item label="Name" className="w-full font-medium">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-gray-100 border  md:py-2 py-0"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone Number (Optional)"
                  className="w-full font-medium"
                >
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-gray-100 border  md:py-2 py-0"
                  />
                </Form.Item>

                <Form.Item label="Email" className="w-full font-medium">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-gray-100 border  md:py-2 py-0"
                  />
                </Form.Item>

                <Form.Item className="w-full text-lg font-medium">
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  >
                    <h1 className="text-lg text-red-700">
                      Want free professional socks?
                    </h1>
                  </Checkbox>
                </Form.Item>

                <Form.Item label="Notes" className="w-full font-semibold">
                  <Input.TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-transparent border-gray-100 border  md:py-2 py-0"
                    rows={4}
                  />
                </Form.Item>
              </Form>

              {loading && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                  <l-spiral size="40" speed="0.9" color="black"></l-spiral>
                </div>
              )}
            </Modal>
          </div>
        </div>
        <motion.div
          className="mx-auto w-full h-[28%] lg:h-[25%] absolute left-0 bottom-10 md:bottom-10 bg-transparent overflow-visible p-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex overflow-x-auto scrollbar-hide scroll-container h-full lg:h-auto w-full relative">
            {activeOptions.map((option) => (
              <motion.div
                key={option}
                className="p-2 px-3 flex flex-col border rounded-lg bg-gray-100 shadow-md m-1 lg:m-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex justify-normal gap-x-1 items-center">
                    <button
                      onClick={() => handleDelete(option)}
                      className="text-red-800 z-20"
                    >
                      <ArrowBackIosNewOutlinedIcon size="small" />
                    </button>
                    <h3 className="font-bold lg:font-medium text-red-800 text-base  lg:text-xl">
                      {option}
                    </h3>
                  </div>
                </div>
                <div className="relative z-10 pb-2">
                  {renderToolbarContent(option)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll buttons */}
          <div className="absolute flex justify-between items-center gap-x-2 right-5 -top-10 transform -translate-y-1/2 z-20 bg-transparent">
            <button
              onClick={() => scroll(-100)}
              className="bg-gray-200 py-3 px-4 rounded-full"
            >
              <ArrowBackIcon htmlColor="red" />
            </button>
            <button
              onClick={() => scroll(100)}
              className="bg-gray-200 py-3 px-4 rounded-full"
            >
              <ArrowForwardIcon htmlColor="red" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
