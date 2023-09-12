function validation(values) {
  let error = {};
  const email_pattern =
    /^[a-zA-Z][a-zA-Z0-9]+@{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,4}$/;
  const password_pattern = /^.{8,}$/;

  if (values.email === "") {
    error.email = "email should not be empty";
  } else if (!email_pattern.test(values.email)) {
    error.email = "Email didn't match";
  } else {
    error.email = "";
  }
  if (values.password === "") {
    error.password = "password should not be empty";
  } else if (!password_pattern.test(values.password)) {
    error.password = "password didn't match";
  } else {
    error.password = "";
  }

  return error;
}

export default validation;
