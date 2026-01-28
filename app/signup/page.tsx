"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/ui/Button";
import LinkBelow from "@/components/ui/link-below";

const signupSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^(01|09)\d{9}$/, "Please enter a valid phone number"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least one uppercase, one lowercase, one digit, and one symbol"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/auth/signup",
        {
          name: data.fullname,
          email: data.email,
          phone: data.phone,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status < 500,
        }
      );

      console.log("Signup response:", response);

      // On successful signup, redirect to /verify so server can read cookie
      if (response.status >= 200 && response.status < 300) {
        console.log("Signup response:", response);
        router.replace("/verify");
        router.refresh();
        return;
      }

      if (response.status === 400 && response.data.message && Array.isArray(response.data.message)) {
        response.data.message.forEach((msg: string) => {
          if (msg.toLowerCase().includes("email")) {
            setError("email", { message: msg });
          } else if (msg.toLowerCase().includes("phone")) {
            setError("phone", { message: msg });
          } else if (msg.toLowerCase().includes("password")) {
            setError("password", { message: msg });
          }
        });
      } else if (response.status === 409) {
        setError("email", { message: response.data.message || "User already exists" });
      } else {
        alert(response.data.message || "An error occurred. Please try again.");
      }

    } catch (error: any) {
          alert(error.status || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "450px", margin: "100px auto 0", padding: "25px" }}>
      <h1
        style={{
          fontSize: "2.2rem",
          textAlign: "center",
          marginBottom: "10px",
          fontWeight: "bold",
          color: "#1f2937",
        }}
      >
        Sign Up
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: "30px" }}>
        {/* Full Name */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fullname">Full Name *</label>
          <input
            type="text"
            id="fullname"
            {...register("fullname")}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.fullname ? "red" : "#ccc"}`,
              borderRadius: "4px",
            }}
            placeholder="Enter your full name"
          />
          {errors.fullname && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.fullname.message}
            </span>
          )}
        </div>

        {/* Email */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            {...register("email")}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.email ? "red" : "#ccc"}`,
              borderRadius: "4px",
            }}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Phone */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            {...register("phone")}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.phone ? "red" : "#ccc"}`,
              borderRadius: "4px",
            }}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.phone.message}
            </span>
          )}
        </div>

        {/* Password */}
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.password ? "red" : "#ccc"}`,
              borderRadius: "4px",
            }}
            placeholder="Enter your password"
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="confirmPassword">Confirm Password *</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            style={{
              width: "100%",
              padding: "8px",
              border: `1px solid ${errors.confirmPassword ? "red" : "#ccc"}`,
              borderRadius: "4px",
            }}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "10px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>  

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <LinkBelow descText="Already have an account? " linkText="Log In" href="/login" variant="first" />
        <LinkBelow descText="Want to teach on SkillSync? " linkText="Become an Instructor" href="/instructor/signup" variant="second" />
      </div>
    </div>
  );
}
