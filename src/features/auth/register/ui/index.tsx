"use client";
import { useState } from "react";
import { Input } from "@/src/shared/input";
import { registerUser } from "../model";

interface IForm {
  username: string;
  email: string;
  password: string;
}

export const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [formData, setFormData] = useState<IForm>({
    username: "",
    email: "",
    password: "",
  });
  const [loaded, setLoaded] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerUser(formData);
      if (!res.error) {
        onSuccess();
      }

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="gap-3 flex flex-col" onSubmit={handleSubmit}>
      <Input
        label="username"
        name="username"
        type="text"
        placeholder="example"
        value={formData.username}
        onChange={handleChange}
      />
      <Input
        label="email"
        name="email"
        type="email"
        placeholder="email@example"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        label="password"
        name="password"
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={handleChange}
      />
      <button className="bg-blue-900 w-full py-2 rounded-xl text-white hover:bg-blue-800 transition-all cursor-pointer">
        Register
      </button>
    </form>
  );
};
