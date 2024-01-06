import type {User} from "next-auth"
export async function authenticate(email: string, password: string): Promise<{
    user: User
    token: string
}>{
    // get user from database
    // compare password
    // return
    /*return User {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
    }*/
    console.log(email, password)
    return Promise.resolve({
        user: {
            id: "",
            name: "John Doe",
            email: email,
            image: "",
            userRole: "user"
        },
        token: ""
    })
}