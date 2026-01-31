'use client';

import Button from "@/components/ui/Button";
import LinkBelow from "@/components/ui/link-below";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setGeneralError("");
    try {
      const response = await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.message) {
        alert(response.data.message);
      } else {
        window.location.href = "/profile";
        return;
      }
      reset();
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && Array.isArray(data.message)) {
          data.message.forEach((msg: string) => {
            if (msg.toLowerCase().includes("email")) {
              setError("email", { message: msg });
            } else if (msg.toLowerCase().includes("password")) {
              setError("password", { message: msg });
            }
          });
        } else if (status === 401) {
          setGeneralError("Invalid credentials");
        } else {
          alert(data.message || "An error occurred");
        }
      } else {
        alert("Network error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "100px auto 0", padding: "25px" }}>
      <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Login</h1>

      {message === "signup" && (
        <div style={{ background: "#e0ffe0", padding: "10px", marginBottom: "15px" }}>
          Please Login again
        </div>
      )}

      {/* rest of your JSX unchanged */}
    </div>
  );
}
