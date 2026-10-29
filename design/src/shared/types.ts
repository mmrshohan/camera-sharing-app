// Shapes shared by components and the prototype model.

/** A person in a session, as both phones show them. */
export interface Party {
  name: string;
  /** Their username, with the @. */
  handle: string;
  /** Their phone's exact model, such as "Galaxy A15". */
  device: string;
}

/** The six verification words both phones must show (spec R2). */
export type Words = readonly [string, string, string, string, string, string];
