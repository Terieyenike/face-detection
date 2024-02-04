import { useState } from "react";
import { Navigation, Logo, ImageLinkForm, Rank, FaceRecognition, Signin, Register, } from "./components";
import "./App.css";

const App = () => {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  })

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = '5cc6cc83980148c2915ab62c20ea1e6a';
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
  try {
    setImageUrl(input);
    const response = await fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, returnClarifaiRequestOptions(input))
    if (response) {
      fetch('http://localhost:4000/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: user.id
        })
      }).then(response => response.json())
      .then(count => {
        setUser(Object.assign(user, { entries: count}))
      })
    }
    const result = await response.json()
    displayFaceBox(calculateFaceLocation(result))
  } catch (error) {
    console.log(error)
  }
}

const onRouteChange = (route) => {
  if(route === "signout") {
    setIsSignedIn(false)
  } else if (route === "home") {
    setIsSignedIn(true)
  }
  setRoute(route)
}

  return (
    <div className="App">
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ?
      <div>
        <Logo />
        <Rank name={user.name} entries={user.entries} />
        <ImageLinkForm onInputChange={onInputChange} onPictureSubmit={onPictureSubmit} />
        <FaceRecognition imageUrl={imageUrl} box={box} />
      </div> : (
        route === "signin" ?
        <Signin onRouteChange={onRouteChange} loadUser={loadUser} />
        : <Register onRouteChange={onRouteChange} loadUser={loadUser} />
      )
      }
    </div>
  );
}

export { App }
