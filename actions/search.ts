'use server'

import { revalidatePath } from 'next/cache';

export async function search(keyword: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyword }),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }

  revalidatePath('/');
  return data.results;
}

