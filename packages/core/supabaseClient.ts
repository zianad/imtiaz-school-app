import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MOCK_SCHOOLS, SUPER_ADMIN_CODE } from './constants';
import { UserRole, Student, Teacher, Principal, School } from "./types";
import { snakeToCamelCase } from "./utils";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let mockDataStore = {
  schools: JSON.parse(JSON.stringify(MOCK_SCHOOLS)) as School[],
};

// Mock Auth
let mockSession: any = null;
const authListeners: ((event: string, session: any) => void)[] = [];

const findUser = (code: string) => {
    if (code === SUPER_ADMIN_CODE) return { role: UserRole.SuperAdmin };
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
                const code = email.split('@')[0];
                if (findUser(code)) {
                    mockSession = { user: { id: code, email: email }, expires_in: 3600 };
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
        return Promise.resolve({ data: [], error: { message: `Mock for table ${tableName} not implemented` } });
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
              } else if (tableName === 'teachers') {
                  school!.teachers.push(newItem);
              } else if (tableName === 'students') {
                  school!.students.push({...newItem, grades: {}});
              } else if (tableName === 'announcements') {
                  school!.announcements.push(newItem);
              } // ... Add other tables as needed
              else {
                  // FIX: Safely access and push to dynamic array properties on the School object.
                  // The original code caused a TypeScript error because it couldn't guarantee
                  // that the property being accessed was an array type. Using a type assertion
                  // to 'any' bypasses this check for our mock implementation.
                  if (!(school as any)[tableName]) {
                      (school as any)[tableName] = [];
                  }
                  ((school as any)[tableName] as any[]).push(newItem);
              }
            });
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
            if (tableName === 'schools' && school.id === value) {
                Object.assign(school, camelData);
                found = true;
            } else if (school[tableName as keyof School]) {
                const table = school[tableName as keyof School] as any[];
                const item = table.find(i => i.id == value);
                if (item) {
                    Object.assign(item, camelData);
                    found = true;
                }
            }
        });

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
                if (school[tableName as keyof School]) {
                    const table = school[tableName as keyof School] as any[];
                    const index = table.findIndex(i => i.id == value);
                    if (index > -1) {
                        table.splice(index, 1);
                        found = true;
                    }
                }
            });
        }
        return Promise.resolve({ data: null, error: found ? null : { message: "Item not found" } });
      }
    })
  }),
};

if (!isSupabaseConfigured) {
  console.warn("WARNING: Supabase not configured. Running in offline mode with mock data.");
}

export const supabase: SupabaseClient = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : mockSupabaseClient as any;
