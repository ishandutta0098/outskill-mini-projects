import type { LogLine, ProjectDef } from "./schema";

export type RunResult = {
  output: string;
  log: LogLine[];
};

export type RunCallbacks = {
  onLog?: (line: LogLine) => void;
  onOutputChunk?: (chunk: string) => void;
  onDone?: (result: RunResult) => void;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runProject(
  def: ProjectDef,
  input: Record<string, string>,
  cb: RunCallbacks = {},
): Promise<RunResult> {
  if (
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_USE_REAL_BACKEND === "true" &&
    def.endpoint
  ) {
    const res = await fetch(def.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json()) as RunResult;
    cb.onDone?.(data);
    return data;
  }

  for (const line of def.fixture.log) {
    await sleep(220);
    cb.onLog?.(line);
  }

  await sleep(180);

  const lines = def.fixture.output.split("\n");
  let acc = "";
  for (const line of lines) {
    await sleep(35);
    acc += (acc ? "\n" : "") + line;
    cb.onOutputChunk?.(line + "\n");
  }

  const result: RunResult = { output: def.fixture.output, log: def.fixture.log };
  cb.onDone?.(result);
  return result;
}
