function addEnglishChecker(values) {
  let error = {};
  const maxLength = 100;

  if (values.phrase === "") {
    error.phrase = "記入してください";
  } else if (values.phrase.length > maxLength) {
    error.phrase = "100字以内にしてください";
  } else {
    error.phrase = "";
  }
  if (values.japanese === "") {
    error.japanese = "記入してください";
  } else {
    error.japanese = "";
  }
  //console.log(phraseAsNumber);
  console.log(values.phrase);

  return error;
}

export default addEnglishChecker;
