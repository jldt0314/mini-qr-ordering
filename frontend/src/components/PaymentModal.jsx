export default function PaymentModal({ status, onClose, onRetry }) {
  // status: 'processing' | 'success' | 'failed'
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">

        {status === "processing" && (
          <>
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h2 className="text-xl font-bold text-gray-800">Processing Payment...</h2>
            <p className="text-gray-500 mt-2 text-sm">Please wait a moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-green-600">Order Placed!</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Your order has been sent to the kitchen.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Done
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-600">Payment Failed</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Something went wrong. Please try again.
            </p>
            <button
              onClick={onRetry}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
}