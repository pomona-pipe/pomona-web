/* eslint-disable @typescript-eslint/ban-types */
export type DeepPartial<T> = T extends Array<infer U> ? DeepPartialArray<U> : T extends object ? DeepPartialObject<T> : T;
export type DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type DeepPartialArray<T> = Array<DeepPartial<T>>;
