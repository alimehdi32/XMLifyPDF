'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [xml, setXml] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => res.json())
      .then(setHistory);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('pdfFile', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setXml(data.xmlContent);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 mt-2">Convert</button>
      {xml && <pre className="bg-gray-100 p-4 mt-4">{xml}</pre>}
      <h2 className="mt-6 font-bold">Conversion History</h2>
      <ul>
        {history.map((h) => (
          <li key={h._id} className="border p-2 mt-2">{h.pdfName}</li>
        ))}
      </ul>
    </div>
  );
}
