/** A permissive type for a class constructor */
export type Constructor<T = {}> = new (...args: any[]) => T;

/** A permissive type for abstract class constructors  */
export type AbstractConstructor<T = {}> = abstract new (...args: any[]) => T;
