// coteadmin/src/types/web-bluetooth.d.ts
export {};

declare global {
  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    readonly uuid: string;
    readonly properties: {
      write: boolean;
      writeWithoutResponse: boolean;
      read: boolean;
      notify: boolean;
      indicate: boolean;
      broadcast: boolean;
      authenticatedSignedWrites: boolean;
      reliableWrite: boolean;
      writableAuxiliaries: boolean;
    };
    writeValueWithResponse(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
  }

  interface BluetoothRemoteGATTService {
    readonly uuid: string;
    getCharacteristics(
      characteristic?: string | number,
    ): Promise<BluetoothRemoteGATTCharacteristic[]>;
    getCharacteristic(
      characteristic: string | number,
    ): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTServer {
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(
      service: string | number,
    ): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothDevice extends EventTarget {
    readonly name?: string;
    readonly gatt?: BluetoothRemoteGATTServer;
  }

  interface RequestDeviceOptions {
    acceptAllDevices?: boolean;
    filters?: Array<{
      services?: (string | number)[];
      name?: string;
      namePrefix?: string;
    }>;
    optionalServices?: (string | number)[];
  }

  interface Bluetooth {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
  }

  interface Navigator {
    readonly bluetooth: Bluetooth;
  }
}
