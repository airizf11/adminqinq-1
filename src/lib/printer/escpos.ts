// adminqinq/src/lib/printer/escpos.ts
export class EscPos {
  private static encoder = new TextEncoder();

  static raw(...bytes: number[]): Uint8Array {
    return Uint8Array.from(bytes);
  }

  static text(text: string): Uint8Array {
    return this.encoder.encode(text);
  }

  static lf(lines = 1): Uint8Array {
    return Uint8Array.from(new Array(lines).fill(0x0a));
  }

  static init(): Uint8Array {
    // ESC @
    return this.raw(0x1b, 0x40);
  }

  static beep(): Uint8Array {
    // ESC B n t
    return this.raw(0x1b, 0x42, 3, 2);
  }

  static cut(): Uint8Array {
    // GS V A 0
    return this.raw(0x1d, 0x56, 0x41, 0x00);
  }

  static alignLeft(): Uint8Array {
    return this.raw(0x1b, 0x61, 0);
  }

  static alignCenter(): Uint8Array {
    return this.raw(0x1b, 0x61, 1);
  }

  static alignRight(): Uint8Array {
    return this.raw(0x1b, 0x61, 2);
  }

  static bold(on = true): Uint8Array {
    return this.raw(0x1b, 0x45, on ? 1 : 0);
  }

  static doubleSize(on = true): Uint8Array {
    return this.raw(0x1d, 0x21, on ? 0x11 : 0x00);
  }

  static concat(...parts: Uint8Array[]): Uint8Array {
    const total = parts.reduce((sum, part) => sum + part.length, 0);

    const result = new Uint8Array(total);

    let offset = 0;

    for (const part of parts) {
      result.set(part, offset);
      offset += part.length;
    }

    return result;
  }

  static hello(): Uint8Array {
    return this.concat(this.init(), this.text("HELLO"), this.lf(2));
  }

  static testReceipt(): Uint8Array {
    return this.concat(
      this.init(),

      this.alignCenter(),
      this.bold(true),
      this.doubleSize(true),

      this.text("PRINT LAB"),

      this.doubleSize(false),
      this.bold(false),

      this.lf(),

      this.text("------------------------------"),
      this.lf(),

      this.alignLeft(),

      this.text("Web Bluetooth"),
      this.lf(),

      this.text("ESC/POS Test"),
      this.lf(),

      this.text("1234567890"),
      this.lf(),

      this.text("abcdefghijklmnopqrstuvwxyz"),
      this.lf(),

      this.text("------------------------------"),
      this.lf(4),
    );
  }
}
