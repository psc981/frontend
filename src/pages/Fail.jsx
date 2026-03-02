// /fail page
const Fail = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-3xl font-bold text-red-600">❌ Payment Failed</h1>
    <p className="text-gray-600 mt-2">
      Something went wrong. Please try again.
    </p>
  </div>
);

export default Fail;
