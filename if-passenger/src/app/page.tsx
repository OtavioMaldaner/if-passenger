"use client";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="bg-background">
      <h1 onClick={() => signIn()}>Ola</h1>
    </main>
  );
}
