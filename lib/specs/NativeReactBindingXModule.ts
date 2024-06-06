
import { TurboModuleRegistry, TurboModule } from 'react-native';

export interface Spec extends TurboModule {
    bind: (options: Object) => string;
    unbind: (options: Object) => void;
    unbindAll: () => void;
    prepare: (options: Object) => void;
    getComputedStyle: (options: Object) => Promise<string>;
  }
  
  export default TurboModuleRegistry.getEnforcing<Spec>('ReactBindingXModule');