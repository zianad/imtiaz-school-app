import { createClient } from "@supabase/supabase-js";
import { MOCK_SCHOOLS, SUPER_ADMIN_CODE, SUPER_ADMIN_EMAIL } from './constants';
import { UserRole, Student, Teacher, Principal, School } from "./types";
import { snakeToCamelCase } from "./utils";

// FIX: Cast import.meta to any to bypass TypeScript error in environments without vite/client types.
// In a Vite app, environment variables are exposed on import.meta.env
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// --- Local Storage Persistence for Mock Data ---
const LOCAL_STORAGE_KEY = 'supabaseMockData';

const dateReviver = (key: string, value: any) => {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value);
  }
  return value;
};

let mockDataStore: { schools: School[] };

try {
  const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedData) {
    mockDataStore = JSON.parse(savedData, dateReviver);
  } else {
    // Deep copy MOCK_SCHOOLS to prevent mutation of the constant
    mockDataStore = { schools: JSON.parse(JSON.stringify(MOCK_SCHOOLS)) };
  }
} catch (e) {
  console.error("Failed to load mock data from localStorage", e);
  mockDataStore = { schools: JSON.parse(JSON.stringify(MOCK_SCHOOLS)) };
}

const persistMockData = () => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockDataStore));
  } catch (e) {
    console.error("Failed to save mock data to localStorage", e);
  }
};
// --- End of Local Storage Logic ---

// Mock Auth
let mockSession: any = null;
const authListeners: ((event: string, session: any) => void)[] = [];

const findUser = (code: string) => {
    // Super admin is handled separately in the signInWithPassword mock
    for (const school of mockDataStore.schools) {
        const student = school.students.find(s => s.guardianCode === code);
        if (student) return { role: UserRole.Guardian, school, user: student };

        const teacher = school.teachers.find(t => t.loginCode === code);
        if (teacher) return { role: UserRole.Teacher, school, user: teacher };

        for (const stage in school.principals) {
            const principal = school.principals[stage as keyof typeof school.principals]?.find(p => p.loginCode === code);
            if (principal) return { role: UserRole.Principal, school, user: principal };
        }
    }
    return null;
}

const mockSupabaseClient = {
  auth: {
    signInWithPassword: ({ email, password }: {email: string, password: string}) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Special case for Super Admin
                if (email === SUPER_ADMIN_EMAIL) {
                    // In the simplified logic, the code IS the password.
                    if (password === SUPER_ADMIN_CODE) {
                        mockSession = { user: { id: SUPER_ADMIN_CODE, email: email }, expires_in: 3600 };
                        authListeners.forEach(cb => cb('SIGNED_IN', mockSession));
                        resolve({ data: { session: mockSession }, error: null });
                    } else {
                        reject({ message: "Invalid login credentials" });
                    }
                    return;
                }

                // Logic for other users
                const emailPrefix = email.split('@')[0];
                const userMatch = findUser(emailPrefix);
                // For regular users, password is their login/guardian code
                if (userMatch && password === emailPrefix) {
                    mockSession = { user: { id: emailPrefix, email: email }, expires_in: 3600 };
                    authListeners.forEach(cb => cb('SIGNED_IN', mockSession));
                    resolve({ data: { session: mockSession }, error: null });
                } else {
                    reject({ message: "Invalid login credentials" });
                }
            }, 500);
        });
    },
    signOut: () => {
        return new Promise((resolve) => {
            mockSession = null;
            authListeners.forEach(cb => cb('SIGNED_OUT', null));
            resolve({ error: null });
        });
    },
    getSession: () => {
      return Promise.resolve({ data: { session: mockSession } });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      authListeners.push(callback);
      return { data: { subscription: { unsubscribe: () => {
        const index = authListeners.indexOf(callback);
        if (index > -1) authListeners.splice(index, 1);
      } } } };
    },
    signUp: ({ email, password }: {email: string, password: string}) => {
       // In mock mode, we assume the user already exists if we try to sign them up,
       // as there's no separate auth table. This mimics the real behavior where
       // adding a student with an existing guardian email won't create a new auth user.
       return Promise.resolve({ data: {}, error: null });
    }
  },
  from: (tableName: string) => ({
    select: (query = '*') => {
        if (tableName === 'schools') {
            const data = JSON.parse(JSON.stringify(mockDataStore.schools));
            return Promise.resolve({ data: snakeToCamelCase(data), error: null });
        }
        // Fallback for other tables in mock mode
        const allItems = mockDataStore.schools.flatMap(s => (s as any)[tableName] || []);
        return Promise.resolve({ data: snakeToCamelCase(JSON.parse(JSON.stringify(allItems))), error: null });
    },
    insert: (data: any | any[]) => {
        const items = Array.isArray(data) ? data : [data];
        let error = null;
        try {
            items.forEach(item => {
              const school = mockDataStore.schools.find(s => s.id === item.school_id);
              if (!school && tableName !== 'schools') throw new Error("School not found");
              
              const camelItem = snakeToCamelCase(item);
              const newItem = { ...camelItem, id: Date.now() + Math.random(), date: new Date() };

              if (tableName === 'schools') {
                  mockDataStore.schools.push({ ...newItem, principals: {}, students: [], teachers: [], summaries: [], exercises: [], notes: [], absences: [], examPrograms: [], notifications: [], announcements: [], complaints: [], educationalTips: [], monthlyFeePayments: [], interviewRequests: [], supplementaryLessons: [], timetables: [], quizzes: [], projects: [], libraryItems: [], albumPhotos: [], personalizedExercises: [], unifiedAssessments: [], talkingCards: [], memorizationItems: [], expenses: [], feedback: [] });
              } else if (tableName === 'principals') {
                  if (!school!.principals[newItem.stage]) school!.principals[newItem.stage] = [];
                  school!.principals[newItem.stage]?.push(newItem);
              } else {
                  const tableKey = tableName.replace(/_(\w)/g, (match, p1) => p1.toUpperCase()) as keyof School;
                  if (!(school as any)[tableKey]) {
                      (school as any)[tableKey] = [];
                  }
                  ((school as any)[tableKey] as any[]).push(newItem);
              }
            });
            persistMockData();
        } catch (e: any) {
            error = { message: e.message };
        }
        return Promise.resolve({ data: null, error });
    },
    update: (data: any) => ({
      match: (condition: { [key: string]: any }) => {
        const key = Object.keys(condition)[0];
        const value = condition[key];
        
        const camelData = snakeToCamelCase(data);
        let found = false;
        
        mockDataStore.schools.forEach(school => {
            const tableKey = tableName.replace(/_(\w)/g, (match, p1) => p1.toUpperCase()) as keyof School;
            if (tableName === 'schools' && school.id === value) {
                Object.assign(school, camelData);
                found = true;
            } else if ((school as any)[tableKey]) {
                const table = (school as any)[tableKey] as any[];
                const item = table.find(i => i.id == value);
                if (item) {
                    Object.assign(item, camelData);
                    found = true;
                }
            }
        });
        if (found) persistMockData();
        return Promise.resolve({ data: null, error: found ? null : { message: "Item not found" } });
      },
    }),
    delete: () => ({
      match: (condition: { [key: string]: any }) => {
        const key = Object.keys(condition)[0];
        const value = condition[key];
        let found = false;

        if (tableName === 'schools') {
            const index = mockDataStore.schools.findIndex(s => s.id === value);
            if (index > -1) {
                mockDataStore.schools.splice(index, 1);
                found = true;
            }
        } else {
             mockDataStore.schools.forEach(school => {
                const tableKey = tableName.replace(/_(\w)/g, (match, p1) => p1.toUpperCase()) as keyof School;
                if ((school as any)[tableKey]) {
                    const table = (school as any)[tableKey] as any[];
                    const index = table.findIndex(i => i.id == value);
                    if (index > -1) {
                        table.splice(index, 1);
                        found = true;
                    }
                }
            });
        }
        if (found) persistMockData();
        return Promise.resolve({ data: null, error: found ? null : { message: "Item not found" } });
      }
    })
  }),
};

if (!isSupabaseConfigured) {
  console.warn("WARNING: Supabase not configured. Running in offline mode with mock data.");
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : mockSupabaseClient as any;