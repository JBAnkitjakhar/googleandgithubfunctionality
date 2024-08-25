declare module 'clsx' {
    export type ClassValue =
      | string
      | number
      | null
      | undefined
      | Record<string, boolean>
      | ClassValue[];
  
    function clsx(...args: ClassValue[]): string;
    export default clsx;
  }
  