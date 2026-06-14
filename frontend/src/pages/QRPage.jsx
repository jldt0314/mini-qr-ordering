import { QRCodeSVG } from "qrcode.react";
import { useSearchParams } from "react-router-dom";


export default function QRPage() {
  const [searchParams] = useSearchParams();
  const table          = searchParams.get("table") || "1";
  const MENU_URL = `${import.meta.env.VITE_APP_URL}/?table=${table}`;

  function handlePrint() {
    window.print();
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          📱 Scan to Order
        </h1>
        <p className="text-gray-500 text-sm mb-6">Table {table}</p>

        <div className="flex justify-center mb-6">
          <QRCodeSVG
            value={MENU_URL}
            size={220}
            bgColor="#ffffff"
            fgColor="#1f2937"
            level="H"
          />
        </div>

        <p className="text-xs text-gray-400 break-all">{MENU_URL}</p>
        
      </div>
      {/* Print Button — hidden when printing */}
      <button
        onClick={handlePrint}
        className="print:hidden max-w-sm w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 mt-4 rounded-xl transition-colors"
      >
        🖨️ Print QR Code
      </button>
    </div>
  );
}