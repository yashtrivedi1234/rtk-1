# Student CRUD: MERN + RTK Query (feature-based)

A beginner-friendly full-stack project. A user registers (with a profile photo), logs in, lands on a
dashboard and manages their own students (Create, Read, Update, Delete).

**Stack:** Node + Express 5 (ES modules) + Mongoose, React (JavaScript) + Tailwind CSS + RTK Query,
react-hook-form + Yup, React Toastify, Cloudinary (images), Nodemailer (emails), JWT (login).

---

## 1. Folder structure

Both sides are **feature-based**: everything about one feature (auth, students, dashboard) lives together.

```
RTK Query/
├── backend/
│   ├── .env / .env.example
│   └── src/
│       ├── server.js                 checks required env, connects services, starts the server
│       ├── app.js                    Express app + middlewares
│       ├── config/                   connections to external services
│       │   ├── db.js                 MongoDB
│       │   ├── cloudinary.js         Cloudinary setup + "connected / failed" message
│       │   └── mailer.js             Nodemailer setup + "connected / failed" message
│       ├── features/
│       │   ├── auth/                 user.model, pending-user.model, auth.controller, auth.routes, auth.middleware (protect)
│       │   ├── students/             student.model, student.controller, student.routes
│       │   └── dashboard/            dashboard.controller, dashboard.routes
│       ├── services/                 email.service.js (send with Nodemailer), email.templates.js (welcome / reset emails)
│       ├── middlewares/              shared: error, upload (multer), rateLimit
│       ├── routes/index.js           mounts every feature under /api
│       └── utils/                    regex.js, image.js (upload / delete on Cloudinary)
│
└── frontend/
    ├── .env / .env.example           VITE_API_URL
    └── src/
        ├── main.jsx, App.jsx         providers, routes, <ToastContainer />
        ├── app/                      api.js (one RTK Query slice), baseQuery.js (token + 401), store.js
        ├── layouts/                  AuthLayout, DashboardLayout (+ Sidebar)
        ├── features/
        │   ├── auth/                 authSlice, auth.api, auth.schema, components/, pages/ (Login, Register, ForgotPassword, ResetPassword)
        │   ├── students/             student.api, student.schema, components/ (StudentForm, StudentCard), pages/ (Get, Add, Update, Delete)
        │   └── dashboard/            dashboard.api, pages/Dashboard
        ├── components/               shared UI: Field, ImageField, Button, Avatar, StatCard, Message, Skeleton, PageHeader
        ├── hooks/                    useImagePreview
        └── utils/                    regex.js, cloudinary.js (thumbnail URL), toast.js (error message helper)
```

**Rule of thumb:** a file used by one feature stays inside that feature folder. Only things shared
by many features go to `components/`, `utils/`, `hooks/` (frontend) or `middlewares/`, `utils/` (backend).

---

## 2. How a request travels (Add student)

```
StudentForm.jsx         Yup validation passes, addStudent(formData) is called
student.api.js          POST /api/students   (RTK Query adds the Authorization header)
app.js                  cors + json, then routes/index.js
routes/index.js         /students -> protect (checks the token) -> student.routes.js
student.controller.js   validates, uploads the photo to Cloudinary (utils/image.js), saves
student.model.js        regex rules + MongoDB
Response                RTK Query refetches the list and dashboard (tags) and a toast is shown
```

MVC mapping: **Model** = `*.model.js`, **View** = React pages/components, **Controller** = `*.controller.js`.
`services/` holds only the email code (`email.service.js` sends, `email.templates.js` builds the messages).

---

## 3. Backend config and startup messages

`server.js` runs in this order and prints what happened (each config file checks its own env variables):

| Step | Success | Problem |
|---|---|---|
| Required env (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`) | continues | `Missing required environment variables: ...` and the server stops |
| MongoDB | `MongoDB connected` | `MongoDB connection failed: ...` and the server stops |
| Cloudinary | `Cloudinary connected` | `Cloudinary not configured. Missing env: ...` or `Cloudinary connection failed: ...` |
| Mailer | `Mailer connected` | `Mailer not configured. Missing env: ...` or `Mailer connection failed: ...` |

Cloudinary and the mailer are optional at startup so you can still develop (but registration needs both). Without Cloudinary, uploads
return a clear 503 error. Without SMTP, emails are not sent: the welcome email is skipped (and logged as an error),
and forgot password returns an error.

---

## 4. Environment variables

Copy `backend/.env.example` to `backend/.env` and fill it in. Never commit `.env`.

| Variable | Purpose |
|---|---|
| `PORT` | server port (`5001`; on macOS port 5000 is used by AirPlay) |
| `MONGO_URI` | MongoDB connection string |
| `CLIENT_URL` | frontend URL, allowed by CORS and used in reset links |
| `CLOUDINARY_*` | cloud name, API key, API secret |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | login token |
| `SMTP_*`, `EMAIL_FROM` | emails. For Gmail: enable 2-step verification, create an App Password, use `smtp.gmail.com` and port `587` |

Frontend: `frontend/.env` has `VITE_API_URL=http://localhost:5001/api`.

---

## 5. Features

**Auth flow:** Register in 2 steps -> welcome email -> Log in (JWT) -> Dashboard.

**Registration with email verification (2 steps):** the account is created only after the email is verified.

1. `POST /api/auth/register` (name, email, password): validates the data, stores a *pending* registration (password already hashed) and emails a 6-digit code. No user exists yet.
2. `POST /api/auth/verify-email` (email, code, profile photo): if the code is right, the photo is uploaded to Cloudinary and the user is created. The photo is uploaded here, so unverified sign-ups never touch Cloudinary.

- The code is valid for 10 minutes, only its hash is stored, and 5 wrong tries cancel the registration.
- A new code can be requested once a minute (`POST /api/auth/resend-otp`).
- Unverified registrations delete themselves (MongoDB TTL index on `pending-user.model.js`).
- This flow needs the mailer: without SMTP, registration returns an error.

- Passwords are hashed with bcrypt. Rule: at least 8 characters with a letter and a number.
- Forgot password: a link valid for 15 minutes is emailed. Only the hash of the token is stored. The response is always the same, so nobody can find out which emails are registered.
- `protect` middleware guards `/api/students` and `/api/dashboard`.
- Every student belongs to a user, so users only see and change their own students.
- Login and forgot-password are rate limited.
- On the frontend, `ProtectedRoute` redirects to `/login`, an expired token logs the user out, and logout clears all cached data.

**Image rules (profile photo and student photo):** square (1:1, 2% tolerance), at least 200×200 px, JPG / PNG / WebP, max 2MB.
Checked twice: in the browser (`frontend/src/utils/imageSchema.js`, Yup, shows the real size in the error) and on the
server (`upload.middleware.js`, reads the real dimensions from the file with `image-size`, so a renamed or fake file cannot pass).
Change the numbers in both files together.
After choosing a photo the user can discard it with the small cross on the image (`ImageField.jsx`); the file input is cleared too, so the same file can be chosen again.

**Images:** never stored on disk. `multer` keeps the file in memory (max 2MB, images only) and
it is streamed to Cloudinary. The database keeps only `{ url, publicId }`. Replacing or deleting
a student (or failing a save) also deletes the old image from Cloudinary.

**Toasts:** `react-toastify` shows success and error messages for every action (login, register,
forgot / reset password, add / update / delete student, logout, expired session).

**Dashboard:** sidebar layout (slide-in menu on mobile), stats, recently added students and
students by course.

### API

| Method | URL | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | no | step 1: email a 6-digit code (name, email, password) |
| POST | `/api/auth/verify-email` | no | step 2: verify the code and create the user (form-data: email, otp, image) |
| POST | `/api/auth/resend-otp` | no | send a new code (email) |
| POST | `/api/auth/login` | no | returns `token` and `user` |
| POST | `/api/auth/forgot-password` | no | email a reset link |
| POST | `/api/auth/reset-password/:token` | no | set a new password |
| GET | `/api/dashboard` | yes | dashboard summary |
| GET | `/api/students` | yes | list students |
| POST | `/api/students` | yes | add a student |
| PUT | `/api/students/:id` | yes | update a student |
| DELETE | `/api/students/:id` | yes | delete a student |

Errors always look like `{ "message": "..." }` (400 invalid data, 401 not logged in, 404 not found, 409 duplicate, 503 service unavailable).

---

## 6. RTK Query in this project

One shared API slice (`app/api.js`). Each feature adds endpoints with `api.injectEndpoints`:

| Page / feature | Hook | Type |
|---|---|---|
| Student list, Dashboard | `useGetStudentsQuery`, `useGetDashboardQuery` | query (read data) |
| Add / Update / Delete student | `useAddStudentMutation`, `useUpdateStudentMutation`, `useDeleteStudentMutation` | mutation (change data) |
| Auth pages | `useLoginMutation`, `useRegisterMutation`, `useForgotPasswordMutation`, `useResetPasswordMutation` | mutation |

`getStudents` and `getDashboard` use `providesTags: ["Student"]`; add / update / delete use
`invalidatesTags: ["Student"]`, so both refetch by themselves. No `useEffect` needed.

---

## 7. Run the project

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001

Restart the servers after changing a `.env` file.

---

## 8. Suggested teaching order

1. Folder structure (section 1) and the request journey (section 2).
2. Backend: `config/` -> `student.model.js` -> `student.controller.js` -> `student.routes.js` -> `routes/index.js` -> `app.js` -> `server.js`.
3. Auth: `user.model.js` -> `auth.controller.js` -> `auth.middleware.js`.
4. Frontend: `app/api.js` and `student.api.js` -> store -> pages one by one (Get, Add, Update, Delete).
5. Forms (react-hook-form + Yup), toasts, then the dashboard layout.

---

## 9. Integrating a new API (5 steps)

Example: `GET https://fakestoreapi.com/products`

1. **Understand the API:** URL, method, request body, response shape, and whether it needs a token.
2. **Add the base URL** to `.env` if it is a different server.
3. **Create `features/products/product.api.js`:**
   ```js
   import { api } from "../../app/api";

   export const productApi = api.injectEndpoints({
     endpoints: (builder) => ({
       getProducts: builder.query({ query: () => "/products" }),
       addProduct: builder.mutation({
         query: (body) => ({ url: "/products", method: "POST", body }),
       }),
     }),
   });

   export const { useGetProductsQuery, useAddProductMutation } = productApi;
   ```
   GET = `builder.query`, everything else = `builder.mutation`. Hook name = `use` + endpoint name + `Query` or `Mutation`.
   (No store change is needed, because `injectEndpoints` reuses the shared slice.)
4. **Use the hook in a page** (`features/products/pages/Products.jsx`):
   ```jsx
   const { data = [], isLoading, error } = useGetProductsQuery();
   ```
   For a mutation: `await addProduct(data).unwrap()` inside try/catch, then `toast.success(...)` or `toast.error(getErrorMessage(error))`.
5. **Add the route** in `App.jsx` and a link in `layouts/Sidebar.jsx`.

If something fails, open the browser Network tab and check the URL, method and body. A CORS error means the backend `CLIENT_URL` is wrong.
