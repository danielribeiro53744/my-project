export interface Cookie {
    name: string;
    isAdmin: boolean;
  }

   export async function Cookie(name: string, isAdmin: boolean): Promise<Cookie> {
      return {
        name,
        isAdmin: isAdmin,
      };
      
      
    }