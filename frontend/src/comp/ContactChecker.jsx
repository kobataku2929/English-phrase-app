function contactChecker(values) {
  let error = {};

  if (values.name === "") {
    error.name = "記入してください";
  } else {
    error.name = "";
  }
  if (values.message === "") {
    error.message = "記入してください";
  } else {
    error.message = "";
  }

  return error;
}

export default contactChecker;
