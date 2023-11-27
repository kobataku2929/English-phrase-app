function addEnglishChecker(values) {
  let error = {};

  if (values.phrase === "") {
    error.phrase = "記入してください";
  } else {
    error.phrase = "";
  }
  if (values.japanese === "") {
    error.japanese = "記入してください";
  } else {
    error.japanese = "";
  }

  return error;
}

export default addEnglishChecker;
