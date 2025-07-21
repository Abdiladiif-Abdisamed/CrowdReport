import supabase from "./supabase"


export const signUp = async (email, password, username="")=>{


let { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
})

console.log("data", data)

if(data?.user ){
    const {data : sessionData }= await supabase.auth.getSession()

    if(!sessionData?.session){
        console.error("No session found after sign up")
        return data
    }

    const displayName = username || email.split('@')[0]
    const { data: profileData, error: profileError } = await supabase
    .from('users')
    .insert({
        id: data.user.id,
        email: email,
        username: displayName,
        avatar_url: null
    })
    .select()
    .single()

    if(profileError){
        throw new Error(profileError.message || "Failed to create profile")
    }else{
        console.log("profileData", profileData)
    }
}
    return data
}


// SignIn

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })

    if (error) throw error;

    if(data?.user){

        try{
            const profile = await getUserProfile(data.user.id)
            console.log("User profile:", profile)
        }catch(profileError){
            console.error("Error fetching user profile:", profileError)
            throw new Error(profileError.message || "Failed to sign in")

        }
    }
}



// get user profile
export const getUserProfile = async (userId) => {

    const {data : sessionData} = await supabase.auth.getSession()

    const {data  , error} = await supabase.from('users')
    .select('*')
    .eq('id', userId)
    .single()

    if(error && error.code === 'PGRST116'){
        console.error("User not found" )

        // 
        // create a new profile if it doesn't exist
    const { data: userData } = await supabase.auth.getUser();

    const email = userData?.user.email
        console.log("email", userData)
    const defaultUsername = email ? email.split('@')[0] : `user_${Date.now()}`


    // create profile
        const { data: newProfile, error: profileError } = await supabase
    .from('users')
    .insert({
        id: userId,
        email: email,
        username: defaultUsername,
        avatar_url: null
    })
    .select()
    .single()

    if(profileError){
        console.error("Error creating profile:", profileError)
        throw new Error(profileError.message || "Failed to create profile")
    }else{
        console.log("Profile created:", newProfile)
    }

    return newProfile;
        
    }

    if(error){
        console.error("Error fetching user profile:", error)
        throw new Error(error.message || "Failed to fetch user profile")
    }

    return data
}

// waa function kuu sheegayah user-ku login yahay iyo in kale
export function onAuthChange(callback){
    const {data} = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null , event)
    })
    return () => data.subscription.unsubscribe();
}

// sign out function
export async function signOut() {
    await supabase.auth.signOut()
  }