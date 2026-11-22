# Student CRUD: MERN + RTK Query (MVC)

Ye project students ko sikhane ke liye hai. Ek student ka **name, email, course** save hota hai.
CRUD = **C**reate, **R**ead, **U**pdate, **D**elete.

---

## 1. Poora folder structure

```
RTK Query/
│
├── backend/                              <- SERVER (Node + Express + Mongoose)
│   ├── .env                              secret cheezein (port, DB url, frontend url)
│   ├── .env.example                      .env ka khali sample (git me jata hai)
│   └── src/
│       ├── server.js                     START: DB connect + server listen
│       ├── app.js                        Express app + middlewares (cors, json, errors)
│       ├── config/
│       │   └── db.js                     MongoDB se connect karta hai
│       ├── models/
│       │   └── student.model.js          MODEL: student ka structure + regex rules
│       ├── controllers/
│       │   └── student.controller.js     CONTROLLER: create/read/update/delete logic
│       ├── routes/
│       │   ├── index.js                  saare routes ek jagah (/api/...)
│       │   └── student.routes.js         URL kis controller function ko chalayega
│       └── middlewares/
│           └── error.middleware.js       404 + saare errors ek jagah handle
│
└── frontend/                             <- WEBSITE (React + Tailwind + RTK Query)
    ├── index.html
    ├── .env / .env.example               backend ka URL (VITE_API_URL)
    └── src/
        ├── main.jsx                      React start + Redux Provider + Router
        ├── App.jsx                       sirf routes: URL -> page
        ├── index.css                     Tailwind import
        ├── app/
        │   └── store.js                  Redux store (RTK Query yahi use karta hai)
        ├── layouts/
        │   └── MainLayout.jsx            heading + navbar (har page par common)
        ├── pages/                        VIEW: har page = ek API
        │   ├── GetStudents.jsx           GET    -> list dikhao
        │   ├── AddStudent.jsx            POST   -> naya student
        │   ├── UpdateStudent.jsx         PUT    -> student edit
        │   └── DeleteStudent.jsx         DELETE -> student hatao
        ├── features/
        │   └── students/                 student se jude SAARE files ek folder me
        │       ├── student.api.js         RTK Query: backend ki saari API calls
        │       ├── student.schema.js      yup + regex validation rules
        │       ├── StudentForm.jsx       Add/Update ka form (react-hook-form)
        │       └── StudentCard.jsx       ek student ki card
        └── components/
            └── Message.jsx               common: loading / error / khali message
```

**Professional rules jo follow hue hain:**
- **Backend:** saara code `src/` me. `app.js` (app banana) aur `server.js` (chalana) alag.
  File ka naam `student.model.js`, `student.controller.js` jaisa (kaam + type).
  Errors ek hi jagah (`error.middleware.js`), controller me try/catch nahi.
- **Frontend:** student ka sab kuch `features/students/` me. Naya module (jaise products)
  aaye to `features/products/` banao. `components/` me sirf wo cheez jo kisi bhi feature me chale.
- **Backend validation aur frontend validation dono**: frontend user ko jaldi batata hai,
  backend asli suraksha deta hai.

**Yaad rakhne ka tarika:** backend me folder ka naam = uska kaam
(`models` = data, `controllers` = logic, `routes` = rasta, `middlewares` = beech ka pehredar).
Frontend me `pages` = screen, `features` = ek module ka poora kaam, `layouts` = common dhancha.

---

## 2. MVC kya hai (students ko aise samjhao)

Restaurant ka example:

| MVC | Restaurant | Is project me |
|---|---|---|
| **Model** | Kitchen ka recipe/stock | `student.model.js` (data kaisa dikhega) |
| **View** | Customer ko dikhne wala menu | React `pages` + `features` |
| **Controller** | Waiter jo order lekar kitchen se kaam karwata hai | `student.controller.js` |
| **Routes** | Batata hai kaunsa order kis counter par jayega | `student.routes.js` |
| **Middleware** | Gate ka guard, har order check karta hai | `error.middleware.js`, cors |

---

## 3. Ek request ka poora safar (Add Student ka example)

```
User form bharke "Add" dabata hai
        │
        ▼
StudentForm.jsx       -> studentSchema (yup) pass hui, addStudent(data) call hua
        │
        ▼
student.api.js         -> POST http://localhost:5001/api/students  (RTK Query)
        │
        ▼
app.js                -> cors + json middleware, "/api" ko routes/index.js ko diya
        │
        ▼
routes/index.js       -> "/students" ko student.routes.js ko diya
        │
        ▼
student.routes.js     -> POST "/" -> createStudent
        │
        ▼
student.controller.js -> Student.create(...)
        │
        ▼
student.model.js      -> regex check, phir MongoDB me save
        │
        ▼
Response wapas aaya -> RTK Query list refresh karta hai -> UI update
(kahin error aaya to error.middleware.js { message } bhejta hai -> form me dikhta hai)
```

Board par bas ye ek line likh do:
**Page -> RTK Query hook -> Route -> Controller -> Model -> MongoDB**

---

## 4. Backend file by file

| File | Kya karti hai | Samjhane ki line |
|---|---|---|
| `src/server.js` | `.env` load, DB connect, server start | "Gaadi ki chaabi" |
| `src/app.js` | Express app, cors, json, routes, error middleware | "Building ka main gate" |
| `src/config/db.js` | `mongoose.connect(MONGO_URI)` | "Database ka phone number lagana" |
| `src/models/student.model.js` | Schema: name, email, course + regex | "Form ka format, DB wahi sweekar karega" |
| `src/controllers/student.controller.js` | `getStudents`, `createStudent`, `updateStudent`, `deleteStudent` | "Asli kaam yaha hota hai" |
| `src/routes/student.routes.js` | `get / post / put /:id / delete /:id` | "URL aur function ki jodi" |
| `src/routes/index.js` | sab routes ko `/api` ke neeche jodta hai | "Index page: kaunsa module kahan" |
| `src/middlewares/error.middleware.js` | 404, validation, duplicate email, galat id | "Har galti ka ek hi jawab format" |
| `.env` | `PORT`, `MONGO_URI`, `CLIENT_URL` | "Secret aur settings, code me nahi likhte" |

### API table

| Method | URL | Kaam |
|---|---|---|
| GET | `/api/students` | sab students |
| POST | `/api/students` | naya student |
| PUT | `/api/students/:id` | update |
| DELETE | `/api/students/:id` | delete |

Error response hamesha aisa: `{ "message": "..." }` (400 galat data, 404 nahi mila, 409 email repeat).

> `CLIENT_URL` = jis frontend ko backend se baat karne ki ijazat hai (CORS).

---

## 5. Frontend file by file

| File | Kya karti hai |
|---|---|
| `main.jsx` | React start, `<Provider store>` (Redux) aur `<BrowserRouter>` lagata hai |
| `app/store.js` | Store banata hai, RTK Query ka reducer + middleware jodta hai |
| `features/students/student.api.js` | **Sabse important.** 4 endpoints likhe hain, hooks apne aap ban jate hain |
| `features/students/student.schema.js` | yup + regex rules |
| `features/students/StudentForm.jsx` | Add/Update dono ka form (react-hook-form) |
| `features/students/StudentCard.jsx` | ek student ki card |
| `layouts/MainLayout.jsx` | heading + navbar, `<Outlet />` me page aata hai |
| `App.jsx` | `Routes`: URL ke hisaab se page |
| `pages/*.jsx` | Har page ek hook use karta hai |
| `components/Message.jsx` | loading / error / khali message |

### RTK Query ke 4 hooks (4 pages se jude)

| Page | Hook | Type |
|---|---|---|
| GetStudents | `useGetStudentsQuery()` | query (data lana) |
| AddStudent | `useAddStudentMutation()` | mutation (data badalna) |
| UpdateStudent | `useUpdateStudentMutation()` | mutation |
| DeleteStudent | `useDeleteStudentMutation()` | mutation |

**Query vs Mutation:** data **padhna** = query, data **badalna** (add/edit/delete) = mutation.

**Tags ka magic:** `getStudents` ke paas `providesTags: ["Student"]` hai, aur baaki teeno ke paas
`invalidatesTags: ["Student"]`. Matlab add/edit/delete hone par list **apne aap dobara fetch** hoti hai.
Isliye `useEffect` ya manual refresh nahi likhna padta.

### Form validation

- **react-hook-form**: form ki values aur submit sambhalta hai (`register`, `handleSubmit`).
- **yup + regex** (`student.schema.js`): rules likhta hai (name sirf letters, email sahi format, course).
- **yupResolver**: dono ko jodta hai.

---

## 6. Sikhane ka sahi order (suggestion)

1. Folder structure dikhao (upar ka tree).
2. Backend: `student.model.js` -> `student.controller.js` -> `student.routes.js` -> `app.js` -> `server.js`.
3. Browser me `GET /api/students` kholke dikhao.
4. Frontend: `student.api.js` (saari API ek jagah).
5. Pages ek-ek karke: Get -> Add -> Update -> Delete.
6. Last me form validation (`student.schema.js`) aur error middleware.

---

## 7. Run kaise kare

MongoDB (local ya Atlas) ka URL `backend/.env` me `MONGO_URI` me daalo.

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5001 (macOS par 5000 AirPlay use karta hai, isliye 5001)

`.env` badalne ke baad server dobara start karna padta hai.

---

## 8. Koi bhi nayi API kaise integrate kare (5 steps)

Example: koi tumhe ye API de: `GET https://fakestoreapi.com/products`

### Step 0: API ko pehle samjho
Browser ya Postman me kholke 4 cheezein dekho:
1. **URL** (base URL + endpoint): `https://fakestoreapi.com` + `/products`
2. **Method**: GET / POST / PUT / DELETE
3. **Body** (POST/PUT me kya bhejna hai) ya **params**
4. **Response** kaisa aata hai (array hai ya object, fields ke naam)

Agar API ko **token** chahiye, wo bhi poochho (Step 2 me header me lagega).

### Step 1: Base URL `.env` me daalo
```
VITE_API_URL=https://fakestoreapi.com
```

### Step 2: `features/products/productApi.js` banao (student.api.js ki copy karo)
```js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // token wali API ho to:
    // prepareHeaders: (headers) => { headers.set("Authorization", `Bearer ${token}`); return headers; },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",            // GET
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (body) => ({ url: "/products", method: "POST", body }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation } = productApi;
```
**Rule:** GET = `builder.query`, baaki sab (POST/PUT/DELETE) = `builder.mutation`.
Hook ka naam: `use` + endpoint ka naam + `Query` ya `Mutation`.

### Step 3: `app/store.js` me register karo (2 jagah)
```js
reducer: { ..., [productApi.reducerPath]: productApi.reducer },
middleware: (getDefault) => getDefault().concat(..., productApi.middleware),
```

### Step 4: Page me hook use karo
```jsx
const Products = () => {
  const { data = [], isLoading, error } = useGetProductsQuery();
  if (isLoading) return <Message>Loading...</Message>;
  if (error) return <Message error>Error aaya</Message>;
  return data.map((p) => <p key={p.id}>{p.title}</p>);
};
export default Products;
```
Mutation ke liye: `const [addProduct, { isLoading }] = useAddProductMutation();` phir `addProduct(data)` call karo.

### Step 5: Route + navbar link
`App.jsx` me `<Route path="/products" element={<Products />} />` aur `layouts/MainLayout.jsx` ke `links` array me ek entry.

### Yaad rakhne ki checklist
`.env` -> `features/xxx/xxxApi.js` -> `store.js` -> page me hook -> route.
Error aaye to: Network tab dekho, URL/method/body sahi hai? CORS error ho to backend ka `CLIENT_URL` check karo.
