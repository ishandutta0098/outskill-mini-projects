export type Tier = "beginner" | "intermediate" | "advanced";

export type Status = "stable" | "experimental" | "deployed";

export type FieldDef = {
  key: string;
  label: string;
  kind: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  rows?: number;
};

export type OutputType = "markdown" | "json" | "text" | "emails" | "list" | "table";

export type LogTag = "BOOT" | "INFO" | "OK" | "STREAM" | "WARN" | "ERROR" | "SUCCESS" | "PROCESS" | "RECURSION" | "SYNTHESIS" | "SCAN";

export type LogLine = {
  tag?: LogTag;
  text: string;
  ts?: string;
};

export type ProjectDef = {
  slug: string;
  tier: Tier;
  number: string;
  title: string;
  codename: string;
  blurb: string;
  status: Status;
  tags: string[];
  pipeline: string[];
  inputSchema: FieldDef[];
  outputType: OutputType;
  fixture: {
    input: Record<string, string>;
    output: string;
    log: LogLine[];
  };
  endpoint?: string;
};
