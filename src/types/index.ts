export interface User {
    name: string
    surname: string
    email?: string
    password?: string
    refreshToken?: string
    role?: string
  }
  
  export interface Accomodation {
    name: string
    maxGuests: number
    city: string
    description: string
    host: string
  }