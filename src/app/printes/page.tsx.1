// adminqinq/src/app/printes/page.tsx
"use client";

import { useMemo, useState } from "react";
import { BlePrinter } from "@/lib/printer/ble";

export default function DevTestPage() {
  const printer = useMemo(() => new BlePrinter(), []);

  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) =>
    setLogs((x) => [...x, msg]);

  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">

      <h1 className="text-2xl font-bold">
        BLE Printer Dev Test
      </h1>

      <div className="flex gap-2">

        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={async () => {
            try {
              await printer.connect(addLog);
            } catch (e) {
              addLog(String(e));
            }
          }}
        >
          Connect
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            try {
              await printer.writeText(
   "HELLO\n",
   {},
   addLog,
 );
            } catch (e) {
              addLog(String(e));
            }
          }}
        >
          Send HELLO
        </button>

      </div>

      <div className="border rounded p-4 bg-gray-100">

        {logs.map((x, i) => (
          <div key={i}>{x}</div>
        ))}

      </div>

    </main>
  );
}