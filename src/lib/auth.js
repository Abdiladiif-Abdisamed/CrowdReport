import supabase from './supabase'

// SignUp function

// Signup function
export const signUp = async (email, password, username) => {
  const { user, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    return;
  }

  // Insert the user role into the 'user_roles' table after sign up (optional)
  const { data, error: roleError } = await supabase.from("user_roles").insert([
    { user_id: user.id, role_id: 1 }, // Assuming role_id: 1 is for Writers
  ]);

  if (roleError) {
    console.error("Error assigning role:", roleError.message);
  }

  console.log("User signed up and role assigned:", data);
};


// SignIn function
// Login function
export const sigIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing in:", error.message);
    return;
  }

  console.log("User logged in:", data);

  // Check user role if necessary (optional)
  const { data: userRole, error: roleError } = await supabase
    .from("user_roles")
    .select("role_id")
    .eq("user_id", data.user.id)
    .single();

  if (roleError) {
    console.error("Error fetching user role:", roleError.message);
    return;
  }

  console.log("User role:", userRole);

  // Here you can check for specific roles like Admin or Writer
  if (userRole.role_id === 1) {
    console.log("User is a Writer.");
  } else if (userRole.role_id === 2) {
    console.log("User is an Admin.");
  } else {
    console.log("User role is not recognized.");
  }
};


// Get user profile function
export const getUserProfile = async (userId) => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData?.session) {
    console.error("No active session found");
    return null;
  }

  const { data, error } = await supabase.from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.error("User not found, creating a new profile");
      
      // Create profile if it doesn't exist
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user.email || '';
      const defaultUsername = email ? email.split('@')[0] : `user_${Date.now()}`;

      const { data: newProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          username: defaultUsername,
          avatar_url: null
        })
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw new Error(profileError.message || "Failed to create profile");
      } else {
        console.log("Profile created:", newProfile);
      }

      return newProfile;
    }
    
    console.error("Error fetching user profile:", error);
    throw new Error(error.message || "Failed to fetch user profile");
  }

  return data;
};

// Handle auth state change
export function onAuthChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });

  return () => data.subscription.unsubscribe();
}

// SignOut function
export async function signOut() {
  await supabase.auth.signOut();
}
