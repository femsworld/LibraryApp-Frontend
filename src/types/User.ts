export interface User{
    name: string,
    email: string,
    age: number,
    role: "Admin" | "Client" | "Librarian",
    avatar: string
    password: string
    
}