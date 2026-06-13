import { QRCodeSVG } from "qrcode.react";

// Replace with your actual local IP (run `ipconfig` in terminal to find it)
const LOCAL_IP   = "192.168.254.104";
const TABLE_NUM  = "5";
const MENU_URL   = `http://${LOCAL_IP}:5173/?table=${TABLE_NUM}`;

export default function QRPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          📱 Scan to Order
        </h1>
        <p className="text-gray-500 text-sm mb-6">Table {TABLE_NUM}</p>

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
    </div>
  );
}