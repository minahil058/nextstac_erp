import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { mockDataService } from '../services/mockDataService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper function to fetch user profile from database
const fetchUserProfile = async (userId, email) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.warn('User profile not found in database, using default:', error.message);
            // Return default profile if not in database yet
            return {
                id: userId,
                email: email,
                name: email.split('@')[0],
                role: 'super_admin',
                status: 'Active',
                permissions: ['all']
            };
        }

        return {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
            status: data.status,
            department: data.department,
            share_percentage: data.share_percentage,
            permissions: ['all'],
            avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
        };
    } catch (err) {
        console.error('Error fetching user profile:', err);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing Supabase session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const userProfile = await fetchUserProfile(session.user.id, session.user.email);
                setUser(userProfile);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                const userProfile = await fetchUserProfile(session.user.id, session.user.email);
                setUser(userProfile);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        try {
            // 0. Mock Data Fallback (For Development/Testing routing)
            // This allows us to test the Staff Routing without creating real Supabase users
            const mockUsers = mockDataService.getUsers();
            const mockUser = mockUsers.find(u => u.email === email && u.password === password);
            if (mockUser) {
                console.log("Logged in with Mock User:", mockUser);
                setUser({
                    ...mockUser,
                    permissions: ['all'],
                    department: mockUser.department // Explicitly ensure department is passed
                });
                return { success: true };
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                const userProfile = await fetchUserProfile(data.user.id, data.user.email);

                if (!userProfile) {
                    await supabase.auth.signOut();
                    return { success: false, error: 'Failed to load user profile' };
                }

                // Check user status
                if (userProfile.status === 'Invited') {
                    await supabase.auth.signOut();
                    return { success: false, error: 'Account not activated. Please complete registration.' };
                }

                if (userProfile.status === 'Inactive') {
                    await supabase.auth.signOut();
                    return { success: false, error: 'Account is inactive. Contact administrator.' };
                }

                setUser(userProfile);
                return { success: true };
            }

            return { success: false, error: 'Login failed' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Connection error' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            // First, sign up with Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name,
                    }
                }
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.user) {
                // Check if user was pre-provisioned by Admin
                const { data: existingProfile } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .single();

                // Create or update user profile in database
                const { error: profileError } = await supabase
                    .from('users')
                    .upsert({
                        id: data.user.id,
                        email: email,
                        name: name,
                        // Use existing role if provisioned, otherwise use provided role or default to 'staff'
                        role: existingProfile?.role || role || 'staff',
                        // Use existing status if provisioned, otherwise default to Active (auto-approve)
                        status: existingProfile?.status || 'Active',
                        is_approved: existingProfile?.is_approved !== undefined ? existingProfile.is_approved : true,
                        created_at: existingProfile?.created_at || new Date().toISOString(),
                    }, {
                        onConflict: 'email'
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                    // Continue anyway - auth was successful
                }

                const userProfile = await fetchUserProfile(data.user.id, email);
                setUser(userProfile);
                return { success: true };
            }

            return { success: false, error: 'Registration failed' };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout even if there's an error
            setUser(null);
            window.location.href = '/login';
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
