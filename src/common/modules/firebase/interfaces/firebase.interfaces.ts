import { ModuleMetadata } from '@nestjs/common';

export interface FirebaseModuleOptions {
  projectId: string;
  privateKey: string;
  clientEmail: string;
}

export interface FirebaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
  inject?: any[];
}
