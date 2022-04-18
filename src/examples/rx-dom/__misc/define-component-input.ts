// import { createComponentInput, IComponentInput, objectDefineProperty } from '@lirx/dom';

// export type IDefineComponentInputGNameConstraint< // generics
//   GTarget,
//   GName,
//   //
//   > =
//   [GName] extends [keyof GTarget]
//     ? (
//       GTarget[GName] extends IComponentInput<any>
//         ? string
//         : never
//       )
//     : never
//   ;
//
// export type IDefineComponentInputGValueConstraint< // generics
//   GTarget,
//   GName extends string,
//   GValue,
//   //
//   > =
//   GName extends keyof GTarget
//     ? (
//       GTarget[GName] extends IComponentInput<GValue>
//         ? any
//         : never
//       )
//     : never
//   ;
//
//
// export function defineComponentInput< // generics
//   GTarget,
//   GName extends IDefineComponentInputGNameConstraint<GTarget, GName>,
//   GValue extends IDefineComponentInputGValueConstraint<GTarget, GName, GValue>,
//   //
//   >(
//   target: GTarget,
//   propertyName: GName,
//   options?: ICreateMulticastReplayLastSourceOptions<GValue>,
// ): void {

// export function defineComponentInput< // generics
//   GValue,
//   GName extends string,
//   GTarget extends Record<GName, IComponentInput<GValue>>,
//   //
//   >(
//   target: GTarget,
//   propertyName: GName,
//   options?: ICreateMulticastReplayLastSourceOptions<GValue>,
// ): void {
//   const input: IComponentInput<GValue> = createComponentInput<GValue>(options);
//
//   objectDefineProperty(
//     target,
//     propertyName,
//     {
//       configurable: true,
//       enumerable: true,
//       get: (): IComponentInput<GValue> => {
//         return input;
//       },
//       set: (
//         value: GValue,
//       ): void => {
//         input.value = value;
//       },
//     },
//   );
// }
