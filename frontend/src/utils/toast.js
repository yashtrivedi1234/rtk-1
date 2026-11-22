// Turns an RTK Query error into a message that is safe to show in a toast
export const getErrorMessage = (error) => error?.data?.message || "Could not connect to the server";
