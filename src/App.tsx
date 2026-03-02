import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Link as LinkIcon, Copy, Check } from 'lucide-react';

export default function App() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setQrCodeUrl('');
    }
  }, [text]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qrcode.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
      if (!qrCodeUrl) return;
      try {
          const response = await fetch(qrCodeUrl);
          const blob = await response.blob();
          await navigator.clipboard.write([
              new ClipboardItem({
                  [blob.type]: blob
              })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      } catch (err) {
          console.error('Failed to copy: ', err);
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">QR Code Generator</h1>
          <p className="text-indigo-100 mt-2 text-sm">Enter a URL or text to generate a QR code instantly.</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="url-input"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
                placeholder="https://example.com"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-4 transition-all duration-300">
            {qrCodeUrl ? (
              <div className="relative group">
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="w-64 h-64 object-contain rounded-lg shadow-sm bg-white p-2"
                />
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                  <LinkIcon className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm">Enter text to see the QR code</p>
              </div>
            )}
          </div>

          {qrCodeUrl && (
            <div className="grid grid-cols-2 gap-3">
               <button
                onClick={handleCopy}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 mr-2 text-green-500" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied' : 'Copy Image'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
