import { AppModalComponent } from './modal.component';
import { AppModalManagerComponent } from './manager/modal-manager.component';

// export interface IAppModalComponentConstructor<GData extends object> {
//   new(
//     manager: AppModalManagerComponent,
//     data: GData,
//   ): AppModalComponent<GData>;
// }

// export interface IAppModalComponentConstructor<GModalComponent extends AppModalComponent, GData> {
//   new(
//     manager: AppModalManagerComponent,
//     data: GData,
//   ): GModalComponent;
// }

export interface IAppModalComponentConstructor<GModalComponent extends AppModalComponent, GData> {
  new(
    manager: AppModalManagerComponent,
    data: GData,
  ): GModalComponent;
}

// export type IGenericAppModalComponentConstructor = IAppModalComponentConstructor<AppModalComponent, unknown>;
//
// export type IInferAppModalComponentConstructorGModalComponent<GModalComponentConstructor extends IGenericAppModalComponentConstructor> =
//   GModalComponentConstructor extends IAppModalComponentConstructor<infer GModalComponent, any>
//     ? GModalComponent
//     : never;
//
// export type IInferAppModalComponentConstructorGData<GModalComponentConstructor extends IGenericAppModalComponentConstructor> =
//   GModalComponentConstructor extends IAppModalComponentConstructor<AppModalComponent, infer GData>
//     ? GData
//     : never;
