"use client";

import { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { getCookie, deleteCookie } from 'cookies-next';


export default function Home() {
  const Router = useRouter();
  const [file, setFile] = useState(null);
  const [xml, setXml] = useState("");
  const [history, setHistory] = useState([]);
  const [xmlContent, setXmlContent] = useState(`<root><example>Converted XML</example></root>`);
  const [fileName, setFileName] = useState("converted_file.xml");
  const [pdfFile, setPdfFile] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [email, setEmail] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const paymentStatus = getCookie('paymentDone');
    if (paymentStatus === 'true') {
      setPaymentDone(true);
      deleteCookie('paymentDone'); // Clear it after using once
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/credential", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEmail(data.email);
        } else {
          setEmail(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!email) return;
    const fetchAttempts = async () => {
      try {
        const res = await fetch(`/api/auth/updateAttempt?email=${email}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setAttempt(data.attempts);
          setButtonDisabled(data.attempts >= 2);
        } else {
          console.error("Failed to fetch attempts:", data.error);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      }
    };
    fetchAttempts();
  }, [email]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdfFile", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setXml(data.xmlContent);
    setXmlContent(`<root>${data.xmlContent}</root>`);

    const response = await fetch("/api/auth/updateAttempt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (response.ok) {
      setAttempt((prev) => prev + 1);
      setButtonDisabled((prev) => prev + 1 >= 2);
    } else {
      console.error("Failed to update attempts:", result.error);
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setPdfFile(e.target.result);
    };
    fileReader.readAsDataURL(file);
    if (paymentDone) {
      setPaymentDone(false);
      setButtonDisabled(true);
    }
    
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row justify-between gap-6 w-full min-h-screen bg-gray-900 text-white p-6">
        {/* Left Section */}
        <div className="w-full md:w-3/4 p-6 bg-gray-800 h-[600px] overflow-auto scrollbar-hidden rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold mb-4 text-center md:text-left">PDF to XML Converter</h1>

          {/* Upload & Convert Area */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
            {attempt >= 2 ? (
              <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded transition">
                <Link href="/payment">
                  ₹10?&nbsp;That's all it takes to turn your PDF into XML magic. ✨ Click to continue!
                </Link>
              </button>
            ) : (
              <p className="text-center text-sm text-indigo-600 font-semibold bg-indigo-100 py-2 px-4 rounded-lg shadow-md">
                🚀 You have <span className="text-indigo-800">{2 - attempt}</span> free{" "}
                {2 - attempt === 1 ? "attempt" : "attempts"} left. Make it count!
              </p>
            )}

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                console.log("hiii")
                if (!email) {
                  toast.error("🔒 Please login to upload and convert files.", {
                    style: {
                      background: "#1f2937",
                      color: "#fff",
                    },
                  });
                  return;
                }
                setFile(e.target.files[0]);
              }}
              className="bg-gray-700 text-white p-3 rounded-lg w-full md:w-auto"
            />

            <button
              onClick={handleUpload}
              disabled={(buttonDisabled && !paymentDone) || !email}
              className={`font-bold px-6 py-3 rounded transition w-24 md:w-auto ${buttonDisabled && !paymentDone
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              Convert
            </button>

          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 mt-6 rounded transition w-full"
          >
            Download XML
          </button>

          {/* PDF + XML Preview */}
          <div className="mt-6 bg-gray-700 border border-amber-600 max-w-[1035px] p-4 flex flex-col md:flex-row rounded-lg overflow-y-auto max-h-[370px]">
            {pdfFile && (
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                  <div style={{ height: "400px", border: "1px solid #ccc" }}>
                    <Viewer fileUrl={pdfFile} />
                  </div>
                </Worker>
              </div>
            )}

            <div className="w-full md:w-1/2 p-4">
              <h3 className="text-lg font-semibold">XML Content</h3>
              {xml ? (
                <pre className="text-sm text-green-400 mt-2 bg-gray-800 p-4 rounded">{xml}</pre>
              ) : (
                <p className="text-gray-500 mt-2">No XML content available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - History */}
        <div className="w-full md:w-1/4 bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto max-h-[500px]">
          <h2 className="text-lg font-bold border-b border-gray-600 pb-2 text-center md:text-left">
            Conversion History
          </h2>
          <ul className="mt-4 space-y-2">
            {history.length > 0 ? (
              history.map((h) => (
                <li key={h._id} className="p-2 bg-gray-700 rounded-lg text-sm text-center md:text-left">
                  {h.pdfName}
                </li>
              ))
            ) : (
              <p className="text-gray-500 mt-2 text-center">No history available.</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
