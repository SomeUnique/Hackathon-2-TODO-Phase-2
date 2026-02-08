"use client"; // Important – this file is client-side only

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({ 
  baseURL: "http://localhost:8000", 
  fetchOptions: { credentials: "include", }, });

// Sirf useSession aur signOut ko destructure karein kyunke ye direct functions hain.
// signIn aur signUp ko destructure MAT karein taake confusion na ho.
export const { useSession, signOut } = authClient;