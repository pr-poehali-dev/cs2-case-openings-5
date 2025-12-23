const API_URL = 'https://functions.poehali.dev/66fa53a4-76a3-4a1a-a15f-79abc8a1f89b';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

function getUserSession(): string {
  let session = localStorage.getItem('userSession');
  if (!session) {
    session = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userSession', session);
  }
  return session;
}

export async function getAllData() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
}

export async function saveCases(cases: any[]) {
  const response = await fetch(`${API_URL}?action=saveCases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cases }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save cases');
  }
  return response.json();
}

export async function saveSettings(settings: any) {
  const response = await fetch(`${API_URL}?action=saveSettings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settings }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save settings');
  }
  return response.json();
}

export async function recordOpening(caseId: string, itemId: string) {
  const response = await fetch(`${API_URL}?action=recordOpening`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      caseId,
      itemId,
      userSession: getUserSession(),
    }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to record opening');
  }
  return response.json();
}

export async function getOpenings(limit: number = 50) {
  const userSession = getUserSession();
  const response = await fetch(`${API_URL}?action=getOpenings&userSession=${userSession}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch openings');
  }
  return response.json();
}

export async function getAllOpenings(limit: number = 50) {
  const response = await fetch(`${API_URL}?action=getOpenings&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch openings');
  }
  return response.json();
}

export async function getCaseItems(caseId: string) {
  const response = await fetch(`${API_URL}?action=getCaseItems&caseId=${caseId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch case items');
  }
  return response.json();
}