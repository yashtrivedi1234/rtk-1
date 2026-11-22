export const nameRegex = /^[A-Za-z ]+$/; // letters and spaces only
export const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/; // abc@xyz.com
export const courseRegex = /^[A-Za-z0-9 .+#-]+$/; // letters, numbers, spaces and . + # -
export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/; // at least 8 characters, a letter and a number
