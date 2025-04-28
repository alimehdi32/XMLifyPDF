import Navbar from "./Components/Navbar";
import "./globals.css";

export const metadata = {
  title: "XMLifyPdf",
  description: "Convert Pdf into XML",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
       className="scrollbar-hidden overflow-hidden" 
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
