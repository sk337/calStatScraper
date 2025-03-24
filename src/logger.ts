interface streamer {
  error: (data: string) => void;
  warn: (data: string) => void;
  info: (data: string) => void;
  debug: (data: string) => void;
  log: (data: string) => void;
}

type formatable = string | number | boolean | object | undefined | null;

export class Logger {
  logger: streamer;
  prefix = "CALAMIDLE";

  constructor(logger?: streamer) {
    if (logger) {
      this.logger = logger;
    } else {
      this.logger = console;
    }
  }

  private formatData(data: formatable[]): string {
    return data
      .map((d) => {
        if (typeof d === "object") {
          return JSON.stringify(d, null, 2);
        }
        return d;
      })
      .join(" ");
  }

  error(...data: formatable[]): void {
    this.logger.error(
      `\x1b[2;35m$ \x1b[m\x1b[2;1;37m[\x1b[m\x1b[1;31m${this.prefix}\x1b[m\x1b[2;1;37m] \x1b[1m[\x1b[m\x1b[1;91mERROR\x1b[m\x1b[1;2m] \x1b[m${this.formatData(data)}`,
    );
  }

  info(...data: formatable[]): void {
    this.logger.info(
      `\x1b[2;35m$ \x1b[m\x1b[2;1;37m[\x1b[m\x1b[1;31m${this.prefix}\x1b[m\x1b[2;1;37m] \x1b[1m[\x1b[m\x1b[1;92mINFO\x1b[m\x1b[1;2m] \x1b[m${this.formatData(data)}`,
    );
  }

  warn(...data: formatable[]): void {
    this.logger.warn(
      `\x1b[2;35m$ \x1b[m\x1b[2;1;37m[\x1b[m\x1b[1;31m${this.prefix}\x1b[m\x1b[2;1;37m] \x1b[1m[\x1b[m\x1b[1;93mWARN\x1b[m\x1b[1;2m] \x1b[m${this.formatData(data)}`,
    );
  }

  debug(...data: formatable[]): void {
    this.logger.debug(
      `\x1b[2;35m$ \x1b[m\x1b[2;1;37m[\x1b[m\x1b[1;31m${this.prefix}\x1b[m\x1b[2;1;37m] \x1b[1m[\x1b[m\x1b[1;96mDEBUG\x1b[m\x1b[1;2m] \x1b[m${this.formatData(data)}`,
    );
  }

  log(...data: formatable[]): void {
    this.logger.log(
      `\x1b[2;35m$ \x1b[m\x1b[2;1;37m[\x1b[m\x1b[1;31m${this.prefix}\x1b[m\x1b[2;1;37m] \x1b[1m[\x1b[m\x1b[1;94mLOG\x1b[m\x1b[1;2m] \x1b[m${this.formatData(data)}`,
    );
  }
}
