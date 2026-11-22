# Student CRUD: MERN + RTK Query (MVC)

Ye project students ko sikhane ke liye hai. Ek student ka **name, email, course** save hota hai.
CRUD = **C**reate, **R**ead, **U**pdate, **D**elete.

---

## 1. Poora folder structure

```
RTK Query/
│
├── backend/                         <- SERVER (Node + Express + Mongoose)
│   ├── server.js                    app yahi se start hoti hai
│   ├── .env                         secret cheezein (port, DB url, frontend url)
│   ├── config/
│   │   └── db.js                    MongoDB se connect karta hai
│   ├── models/
│   │   └── Student.js               MODEL: student ka structure (schema)
│   ├── controllers/
│   │   └── studentController.js     CONTROLLER: create/read/update/delete ka logic
│   └── routes/
│       └── studentRoutes.js         ROUTES: URL kis controller function ko chalayega
│
└── frontend/                        <- WEBSITE (React + Tailwind + RTK Query)
    ├── index.html                   ek hi HTML page, React isi me chalta hai
    ├── .env                         backend ka URL (VITE_API_URL)
    └── src/
        ├── main.jsx                 React start + Redux store lagata hai
        ├── App.jsx                  navbar + pages ke routes
        ├── index.css                Tailwind import
        ├── app/
        │   └── store.js             Redux store (RTK Query yahi use karta hai)
        ├── services/
        │   └── studentApi.js        RTK Query: backend ki saari API calls
        ├── pages/                   VIEW: har page = ek API
        │   ├── GetStudents.jsx      GET    -> list dikhao
        │   ├── AddStudent.jsx       POST   -> naya student
        │   ├── UpdateStudent.jsx    PUT    -> student edit
        │   └── DeleteStudent.jsx    DELETE -> student hatao
        └── components/
            ├── StudentForm.jsx      Add aur Update ka form (react-hook-form + yup)
            ├── StudentCard.jsx      ek student ki card (teeno pages me reuse)
            └── Message.jsx          loading / error / khali list ka message
```

**Yaad rakhne ka tarika:** backend me folder ka naam = uska kaam
(`models` = data, `controllers` = logic, `routes` = rasta).
Frontend me `services` = API, `pages` = screen, `components` = chhote reusable tukde.

---

## 2. MVC kya hai (students ko aise samjhao)

Restaurant ka example:

| MVC | Restaurant | Is project me |
|---|---|---|
| **Model** | Kitchen ka recipe/stock | `models/Student.js` (data kaisa dikhega) |
| **View** | Customer ko dikhne wala menu | React `pages` + `components` |
| **Controller** | Waiter jo order lekar kitchen se kaam karwata hai | `controllers/studentController.js` |
| **Routes** | Batata hai kaunsa order kis counter par jayega | `routes/studentRoutes.js` |

---

## 3. Ek request ka poora safar (Add Student ka example)

```
User form bharke "Add" dabata hai
        │
        ▼
StudentForm.jsx      -> yup validation pass hui, addStudent(data) call hua
        │
        ▼
studentApi.js        -> POST http://localhost:5001/api/students  (RTK Query)
        │
        ▼
server.js            -> "/api/students" dekha, routes ko de diya
        │
        ▼
studentRoutes.js     -> POST "/" -> createStudent
        │
        ▼
studentController.js -> Student.create(...)
        │
        ▼
Student.js (Model)   -> MongoDB me save
        │
        ▼
Response wapas aaya -> RTK Query list refresh karta hai -> UI update
```

Board par bas ye ek line likh do:
**Page -> RTK Query hook -> Route -> Controller -> Model -> MongoDB**

---

## 4. Backend file by file

| File | Kya karti hai | Samjhane ki line |
|---|---|---|
| `server.js` | Express app banata hai, CORS aur JSON on karta hai, routes jodta hai, server start | "Ye building ka main gate hai" |
| `config/db.js` | `mongoose.connect(MONGO_URI)` | "Database ka phone number lagana" |
| `models/Student.js` | Schema: name, email, course | "Form ka format, DB wahi sweekar karega" |
| `controllers/studentController.js` | 4 functions: `getStudents`, `createStudent`, `updateStudent`, `deleteStudent` | "Asli kaam yaha hota hai" |
| `routes/studentRoutes.js` | `get / post / put /:id / delete /:id` | "URL aur function ki jodi" |
| `.env` | `PORT`, `MONGO_URI`, `CLIENT_URL` | "Secret aur settings, code me nahi likhte" |

### API table

| Method | URL | Kaam |
|---|---|---|
| GET | `/api/students` | sab students |
| POST | `/api/students` | naya student |
| PUT | `/api/students/:id` | update |
| DELETE | `/api/students/:id` | delete |

> `CLIENT_URL` = jis frontend ko backend se baat karne ki ijazat hai (CORS).

---

## 5. Frontend file by file

| File | Kya karti hai |
|---|---|
| `main.jsx` | React start karta hai, `<Provider store>` se poori app ko Redux deta hai |
| `app/store.js` | Store banata hai, RTK Query ka reducer + middleware jodta hai |
| `services/studentApi.js` | **Sabse important.** 4 endpoints likhe hain, hooks apne aap ban jate hain |
| `App.jsx` | Navbar + `Routes` (URL ke hisaab se page dikhana) |
| `pages/*.jsx` | Har page ek hook use karta hai |
| `components/StudentForm.jsx` | Add/Update dono ka form, validation ke saath |

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
- **yup**: rules likhta hai (name 2 letters, email sahi, course zaroori).
- **yupResolver**: dono ko jodta hai.

---

## 6. Sikhane ka sahi order (suggestion)

1. Folder structure dikhao (upar ka tree).
2. Backend: `Student.js` -> `studentController.js` -> `studentRoutes.js` -> `server.js`.
3. Browser me `GET /api/students` kholke dikhao.
4. Frontend: `studentApi.js` (saari API ek jagah).
5. Pages ek-ek karke: Get -> Add -> Update -> Delete.
6. Last me form validation (yup).

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

### Step 2: `services/productApi.js` banao (studentApi.js ki copy karo)
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
`App.jsx` me `<Route path="/products" element={<Products />} />` aur `links` array me ek entry.

### Yaad rakhne ki checklist
`.env` -> `services/xxxApi.js` -> `store.js` -> page me hook -> route.
Error aaye to: Network tab dekho, URL/method/body sahi hai? CORS error ho to backend ka `CLIENT_URL` check karo.
