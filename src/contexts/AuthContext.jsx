import { createContext, useContext, useEffect, useState } from "react";
import { getUserProfile, onAuthChange, signOut } from "../lib/auth";



const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user , setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const cleanUp = onAuthChange(async(user)=>{
            setUser(user);

            if(user){

                try {

                    const userProfile = await getUserProfile(user.id); 
                    setProfile(userProfile);


                    
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    
                }
            }else{
                setProfile(null);
            }
            setIsLoading(false);
        })
        
        return cleanUp;
       
    }, []);


      const logout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }
    
    return(
        <AuthContext.Provider value={{ user, profile, isLoading, isLoggedIn: !!user , logout}}>
            {children}
        </AuthContext.Provider>
    )

}

// custom hook to use the AuthContext

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}