import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import S3 from 'react-aws-s3';
import React, { useEffect, useState } from "react";
import Select from 'react-select-me';
import 'react-select-me/lib/ReactSelectMe.css';
import "./App.css";
import { getRange, getRandomImage, images, brandList, modelList } from "./extraFile";

// const s3 = new AWS.S3({
//   region: 'us-east-2',
//   service_name: 's3',
//   aws_access_key_id: 'AKIA5QEOO5ZIE7DHPJGP',
//   aws_secret_access_key: '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'
// });

// export async function getFoldersByPrefix(bucket, prefix) {
//   let nextMarker = null;
//   let isTruncated = false;
//   const folders = [];

//   // Returns all objects in current 'directory'
//   do {
//     const s3Objects = await s3.listObjects({
//       Bucket: bucket,
//       Prefix: prefix || '',
//       Delimiter: '/',
//       Marker: nextMarker
//     }).promise();
//     // Store the folder paths
//     const prefixes = s3Objects.CommonPrefixes.map(common => common.Prefix);
//     folders.push.apply(folders, prefixes)
//     // Check if there are more objects in this directory
//     isTruncated = s3Objects.IsTruncated;
//     nextMarker = isTruncated ? s3Objects.NextMarker : null;
//   } while (isTruncated);
  
//   return folders;
// }

const config = {
  bucketName: '',
  dirName: 'html_survey_submission',
  region: 'us-west-1',
  accessKeyId: 'AKIA5QEOO5ZIE7DHPJGP',
  secretAccessKey: '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',
  s3Url: '',
}

function App() {
  // Initialization of useState functions for unique image/button display
  const [imageIndex, setImage] = useState(getRandomImage());

  const [globalRenameArray, updateRenameArray] = useState([]);
  const [globalImageArray, updateImageArray] = useState([]);

  const [brandDropdown, setBrandDropdown] = useState([]);
  const [brandSelection, setBrandSelection] = useState(0)

  const [modelDropdown, setModelDropdown] = useState([]);
  const [modelSelection, setModelSelection] = useState(0)

  const [angleDropdown, setAngleDropdown] = useState([]);
  const [angleSelection, setAngleSelection] = useState(0)

  // Will update image to new random image after button click
  function UpdateImage() {
    var newImage = getRandomImage();
    setImage(newImage);
    return newImage;
  }

  function StoreSubmission () {
    if (brandSelection != 0 || modelSelection != 0 || angleSelection != 0) {
      UpdateButton();
    }
    // console.log(globalRenameArray)
    // console.log(globalImageArray)
    if (globalRenameArray.length == 10 && globalImageArray.length == 10) {

    }
  }

  // Will update buttons to new random buttons after button click
  function UpdateButton() {
    var imageRename = brandDropdown[brandSelection] + ' ' + modelDropdown[modelSelection] + ' ' + angleDropdown[angleSelection]
    // console.log(imageRename);

    setBrandSelection(0);
    setModelSelection(0);
    setAngleSelection(0);

    var newImageIndex = UpdateImage();
    globalRenameArray.push(imageRename);
    globalImageArray.push(images[newImageIndex]);
  
    var localBrandList = [...brandList];
    var localModelList = [...modelList];
    var buttonBrandArray = ["Select a Brand"];
    var buttonModelArray = ["Select a Model"];
    var buttonAngleArray = ["Select an Orientation", "Bottom", "Top", "Side", "Back", "Back-Angled", "Front", "Front-Angled"];

    // Code below grabs name of brand from image and puts it in buttons
    var shoeName = images[newImageIndex];
    shoeName = shoeName.default.replace('/static/media/google', '');
    for (var i = 0; i < shoeName.length; i++) {
      if (shoeName.charAt(i) >= '0' && shoeName.charAt(i) <= '9') {
        shoeName = shoeName.substring(0, i);
      }
    }
    buttonBrandArray.push(shoeName);
    var correctBrand = localBrandList.indexOf(shoeName);
    localBrandList.splice(correctBrand, 1);

    // Code below ensures all buttons are unique
    for (var i = 1; i < 4; i++) {
      var index = getRange(0, localBrandList.length);
      var newBrandButton = localBrandList.splice(index, 1).pop();
      buttonBrandArray.push(newBrandButton);
    }
    buttonBrandArray.push('No Brand')

    for (var i = 1; i < 4; i++) {
      var index = getRange(0, localModelList.length);
      var newModelButton = localModelList.splice(index, 1).pop();
      buttonModelArray.push(newModelButton);
    }
    buttonModelArray.push('No Model')
  
    setBrandDropdown([...buttonBrandArray])
    setModelDropdown([...buttonModelArray])
    setAngleDropdown([...buttonAngleArray])
  }

  function onBrandSelectionChange(newSelection) {
    const newSelectionIndex = brandDropdown.indexOf(newSelection.value)
    setBrandSelection(newSelectionIndex)
  }
  function onModelSelectionChange(newSelection) {
    const newSelectionIndex = modelDropdown.indexOf(newSelection.value)
    setModelSelection(newSelectionIndex)
  }
  function onAngleSelectionChange(newSelection) {
    const newSelectionIndex = angleDropdown.indexOf(newSelection.value)
    setAngleSelection(newSelectionIndex)
  }

  // On startup will run these commands/functions
  useEffect (() =>{
    UpdateButton()
    updateRenameArray([])
    updateImageArray([])
  }, [])

  // Button formatting
  let buttonStyle = {
    height: 35,
    width: 100,
  }

  // Webpage display code
  return (
    <div className="App">
      <header className="App-header">
        <img height={500} width={500} src={images[imageIndex].default} id="showImage" />

        <Select options={brandDropdown} value={brandDropdown[brandSelection]} onChange={onBrandSelectionChange}/>
        <Select options={modelDropdown} value={modelDropdown[modelSelection]} onChange={onModelSelectionChange}/>
        <Select options={angleDropdown} value={angleDropdown[angleSelection]} onChange={onAngleSelectionChange}/>

        <button style={buttonStyle} onClick={StoreSubmission}>Submit</button>

      </header>
    </div>
  );
}

export default App;