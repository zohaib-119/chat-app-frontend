'use client'

import { useState } from "react";
import { toaster } from "@/components/ui/toaster";
import axios from 'axios'
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function AuthPage() {

  const router = useRouter();

  const { setUser, setIsAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) {
      toaster.create({
        title: 'All fields are required.',
        type: 'error',
      })
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toaster.create({
        title: "Invalid email format.",
        type: 'error',
      });
      return;
    }

    if (password.length < 6) {
      toaster.create({
        title: "Password is too short",
        type: 'error',
      });
      return;
    }

    if (!isLogin && username.length < 5) {
      toaster.create({
        title: "Username is too short",
        type: 'error',
      });
      return;
    }

    if (isLogin) {
      console.log("Logging in with", { email, password });

      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email, password
        }, { withCredentials: true });

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          router.replace('/main');
        } else {
          toaster.create({
            title: response.data.message,
            type: 'error',
          });
        }
      } catch (error) {
        toaster.create({
          title: error.response?.data?.message || "Something went wrong",
          type: 'error',
        });
      }

    } else {
      console.log("Signing up with", { username, email, password });

      try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', {
          email, password, username
        }, { withCredentials: true });

        if (response.data.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          router.replace('/main');
        } else {
          toaster.create({
            title: response.data.message,
            type: 'error',
          });
        }
      } catch (error) {
        toaster.create({
          title: error.response?.data?.message || "Something went wrong",
          type: 'error',
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold text-center mb-4">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={handleAuth}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-500 hover:underline ml-1"
            onClick={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPassword('');
              setUsername('');
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
