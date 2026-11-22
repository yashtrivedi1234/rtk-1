// All request validation is done with Yup. A schema describes what the request must look like.
const badRequest = (error) => Object.assign(new Error(error.errors.join(", ")), { status: 400 });

// Validates req.body (and the uploaded file as "image") and replaces req.body with the cleaned values
// (trimmed, lowercased, unknown fields removed).
export const validate = (schema) => async (req, res, next) => {
  try {
    const values = await schema.validate({ ...req.body, image: req.file }, { abortEarly: false, stripUnknown: true });
    delete values.image; // the file stays in req.file
    req.body = values;
    next();
  } catch (error) {
    next(error.name === "ValidationError" ? badRequest(error) : error);
  }
};

// Validates the URL parameters, for example /students/:id
export const validateParams = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.params, { abortEarly: false });
    next();
  } catch (error) {
    next(error.name === "ValidationError" ? badRequest(error) : error);
  }
};
