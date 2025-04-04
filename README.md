# 📄  XMLifyPdf

A full-stack web application that allows users to upload PDF files, convert them into XML format, preview both the original PDF and the converted XML, manage conversion history, and securely authenticate users.

---

## 🚀 Features

- 🧾 **PDF Upload**: Users can upload `.pdf` files.
- 🔄 **PDF to XML Conversion**: Converts the uploaded PDF content to structured XML.
- 👁 **Preview PDF & XML**: Side-by-side preview of the uploaded PDF and its XML output.
- 💾 **Download XML**: Option to download the converted XML as a `.xml` file.
- 📜 **Conversion History**: Lists all previously uploaded PDF filenames per user.
- 👤 **Authentication**: JWT-based secure login, signup, and logout system.
- 🛡 **Protected Routes**: Only authenticated users can access the profile and history.
- 🧩 **Responsive UI**: Clean and responsive layout styled using Tailwind CSS.

---

## 🏗 Tech Stack

| Frontend       | Backend       | Database | Others                         |
|----------------|----------------|----------|--------------------------------|
| Next.js (App Router) | Node.js + Express | MongoDB  | Tailwind CSS, Axios, JWT, React-PDF-Viewer |

---

## 📁 Project Structure

pdf-to-xml-converter/
       │ ├── app/ │
                  ├── login/ # Login page │ 
                  ├── signup/ # Signup page │ 
                  ├── profile/ # User profile page │ 
         ├── middleware.ts # Auth middleware for protecting routes │ 
         └── page.tsx # Home page (converter) │ 
         ├── components/ # Reusable components (Navbar, etc.)
         ├── lib/ # DB connection & utility functions 
                  ├── models/ # MongoDB models (User, History) 
                  ├── pages/api/ # API routes │ 
                           ├── user/ # login, signup, logout, me │ 
                           ├── upload.js # PDF upload & conversion │ └── history.js # Fetch user conversion history 
         ├── public/ # Static assets ├── styles/ # Global styles (if needed) 
         ├── .env.local # Environment variables 
         └── README.md # You're here!


---

## ⚙️ Environment Variables

Create a `.env.local` file at the root of your project and add the following:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pdfxmlapp?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
 ```
⚠️ Replace <username> and <password> with your actual MongoDB credentials.
Keep JWT_SECRET strong and private.


📦 Installation & Setup
1. Clone the repository
   git clone https://github.com/your-username/pdf-to-xml-converter.git
cd pdf-to-xml-converter

2. Install dependencies
   npm install

3. Setup environment
   cp .env.example .env.local
# Fill in your environment variables as explained above

4. Run the app
   npm run dev

App runs locally at http://localhost:3000

🔐 Authentication Flow
Signup → User creates an account (/signup)

Login → JWT token is stored in cookies (/login)

Logout → Clears token from cookies

Middleware → Protects /profile route. If unauthenticated, redirects to /login.

🧠 Conversion Flow
User selects a PDF.

The file is uploaded to /api/upload.

Backend processes PDF → extracts text → wraps it in basic XML structure.

Response contains the XML.

XML is displayed and can be downloaded.

History is saved in MongoDB tied to the user ID.


🗃 MongoDB Collections
Users

_id

email

password (hashed)

Conversions

_id

userId

pdfName

timestamp



🧪 Future Improvements
Add drag-and-drop support for file uploads

More advanced PDF-to-XML parsing (preserve formatting)

Pagination for conversion history

Dark/light theme toggle

Role-based access (admin users)


🤝 Contribution
Contributions are welcome! Feel free to submit issues or open pull requests.

📄 License
This project is open-sourced under the MIT License.

👨‍💻 Author
Made with ❤️ by Ali Mehdi


---

Let me know if you'd like me to customize this for deployment (like Vercel), testing setup, or add images/screenshots to it!


