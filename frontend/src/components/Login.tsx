const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:5000/api/install";
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login with HubSpot
        </h1>
        <button
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white font-semibold py-2 rounded-lg hover:bg-orange-600 transition duration-200"
        >
          Click to Login with HubSpot
        </button>
      </div>
    </div>
  );
};

export default Login;
