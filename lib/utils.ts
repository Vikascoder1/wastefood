import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Env
// NEXT_PUBLIC_SUPABASE_URL = https://bqyulioidcfblqtwvlgm.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxeXVsaW9pZGNmYmxxdHd2bGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODE2MjQsImV4cCI6MjA3MDY1NzYyNH0.uoBKjl5ubSvSAaxnylR0i-FwRdKZ1W-IE0bW96zJtBE