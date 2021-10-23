import React, { useEffect, useState } from "react";
import "./App.css";
import { getRange, getRandomImage, images, brandList } from "./extraFile";

function App() {
  // Initialization of useState functions for unique image/button display
  const [imageIndex, setImage] = useState(getRandomImage());
  const [brands, setButtons] = useState([]);

  // Will update image to new random image after button click
  function UpdateImage() {
    var newImage = getRandomImage();
    setImage(newImage);
    return newImage
  }

  // Will update buttons to new random buttons after button click
  function UpdateButton() {

    var newImageIndex = UpdateImage();
  
    var localBrandList = [...brandList];
    var buttonArray = [];

    // Code below grabs name of brand from image and puts it in buttons
    var shoeName = images[newImageIndex];
    shoeName = shoeName.default.replace('/static/media/google', '');
    for (var i = 0; i < shoeName.length; i++) {
      if (shoeName.charAt(i) >= '0' && shoeName.charAt(i) <= '9') {
        shoeName = shoeName.substring(0, i);
      }
    }
    buttonArray.push(shoeName);
    var correct = localBrandList.indexOf(shoeName);
    localBrandList.splice(correct, 1);
    // console.log("Shoe Name: " + shoeName);

    // Code below ensures all buttons are unique
    for (var i = 1; i < 5; i++) {
      var index = getRange(0, localBrandList.length);
      var newButton = localBrandList.splice(index, 1).pop();
      buttonArray.push(newButton);
    }

    // Code below ensures that button with name matching the image name is in a unique location every time
    var buttonChange = getRange(0, 5);
    var temp = buttonArray[0];
    buttonArray[0] = buttonArray[buttonChange];
    buttonArray[buttonChange] = temp;

    setButtons(buttonArray);
  }

  // On startup will run these commands/functions
  useEffect (() =>{
    UpdateButton()
  }, [])

  // Button formatting
  let buttonStyle = {
    height: 30,
    width: 100
  }

  // Webpage display code
  return (
    <div className="App">
      <header className="App-header">
        <img height={500} width={500} src={images[imageIndex].default} id="showImage" />

        {brands.map((brand, index) => {
          return <button style={buttonStyle} onClick={UpdateButton} key={index}>{brand}</button>
        })}
        <button style={buttonStyle} onClick={UpdateButton}>no+brand</button>

      </header>
    </div>
  );
}

export default App;