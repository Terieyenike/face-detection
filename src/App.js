import { useState, useEffect } from "react";
import { Logo, ImageLinkForm, FaceRecognition, Auth } from "./components";
import "./App.css";
import { initJuno } from "@junobuild/core";

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "drhxq-dqaaa-aaaal-adsqa-cai",
      }))();
  }, []);

  const onInputChange = (event) => {
    setInput(event.target.value);

  }


  const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = process.env.REACT_APP_PAT;
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const IMAGE_URL = imageUrl

    const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

return requestOptions
}

const calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const img = document.getElementById("inputimage")
  const width = Number(img.width)
  const height = Number(img.height)
  return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
}

const displayFaceBox = (box) => {
  setBox(box)
}

const onPictureSubmit = async () => {
  if (!input) {
    setErrorMessage("Please enter a valid image URL")
    return;
  }
  try {
    setImageUrl(input);
    const response = await fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, returnClarifaiRequestOptions(input))
    const result = await response.json()
    displayFaceBox(calculateFaceLocation(result))
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="App">
      <Logo />
      <div>
        <p>face detection app</p>
      </div>
      <Auth>
        <ImageLinkForm onInputChange={onInputChange} onPictureSubmit={onPictureSubmit} errorMessage={errorMessage} />
        <FaceRecognition imageUrl={imageUrl} box={box} />
      </Auth>
    </div>
  );
}

export { App }
