export type LogLevel = "info" | "success" | "warn" | "error" | "debug";

const palette: Record<LogLevel, string> = {
  info: "\u001b[38;5;210m",
  success: "\u001b[38;5;203m",
  warn: "\u001b[38;5;216m",
  error: "\u001b[38;5;196m",
  debug: "\u001b[38;5;174m",
};

const reset = "\u001b[0m";
const dim = "\u001b[2m";

function stamp(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", " UTC");
}

export function log(level: LogLevel, scope: string, message: string, extra?: unknown): void {
  const color = palette[level];
  const label = `${color}[${level.toUpperCase()}]${reset}`;
  const scopeLabel = `${dim}${scope}${reset}`;

  if (extra === undefined) {
    console.log(`${label} ${scopeLabel} ${message} ${dim}${stamp()}${reset}`);
    return;
  }

  console.log(`${label} ${scopeLabel} ${message} ${dim}${stamp()}${reset}`, extra);
}

export function printBanner(): void {
  const red = "\u001b[38;5;196m";
  const rose = "\u001b[38;5;203m";
  const soft = "\u001b[38;5;217m";

  console.log(`${red}¦¦¦+   ¦¦+¦¦¦¦¦¦¦+¦¦+  ¦¦+ ¦¦¦¦¦+ ${reset}`);
  console.log(`${rose}¦¦¦¦+  ¦¦¦¦¦+----++¦¦+¦¦++¦¦+--¦¦+${reset}`);
  console.log(`${soft}¦¦+¦¦+ ¦¦¦¦¦¦¦¦+   +¦¦¦++ ¦¦¦¦¦¦¦¦${reset}`);
  console.log(`${rose}¦¦¦+¦¦+¦¦¦¦¦+--+   ¦¦+¦¦+ ¦¦+--¦¦¦${reset}`);
  console.log(`${red}¦¦¦ +¦¦¦¦¦¦¦¦¦¦¦¦+¦¦++ ¦¦+¦¦¦  ¦¦¦${reset}`);
  console.log(`${soft}+-+  +---++------++-+  +-++-+  +-+${reset}`);
  console.log(`${dim}Nexa Music console online${reset}`);
}
