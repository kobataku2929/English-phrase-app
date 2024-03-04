function FolderNameChecker(values) {
  let errors = {};

  if (values.name === "") {
    errors.name = "記入してください";
  } else {
    errors.name = "";
  }

  return errors;
}

export default FolderNameChecker;
