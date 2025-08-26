import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/2 h-auto">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
            alt="Login visual"
            className="object-cover w-full h-full rounded-l-2xl"
          />
          <div className="absolute bottom-2 left-4 text-xs text-white opacity-80">
            Photo by Alexandr Popadin
          </div>
        </div>
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">UI Unicorn</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Nice to see you again</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Login</label>
              <input
                type="text"
                placeholder="Email or phone number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-500 hover:underline">Forgot password?</a>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Sign in
            </button>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
              type="button"
              className="w-full py-2 px-4 bg-gray-900 text-white rounded-md font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
            >
              <span className="bg-white rounded-full p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-5 h-5" />
              </span>
              Or sign in with Google
            </button>
          </form>
          <div className="mt-6 text-sm text-gray-600 text-center">
            Don&apos;t have an account? <a href="#" className="text-blue-500 hover:underline">Sign up now</a>
          </div>
          <div className="mt-8 flex justify-between text-xs text-gray-400">
            <span>@uiunicorn</span>
            <span>© Perfect Login 2021</span>
          </div>
        </div>
      </div>
    </div>
  );
}
