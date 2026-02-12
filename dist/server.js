var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "17.2.4",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var TIPS = [
      "\u{1F510} encrypt with Dotenvx: https://dotenvx.com",
      "\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit",
      "\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild",
      "\u{1F4E1} add observability to secrets: https://dotenvx.com/ops",
      "\u{1F465} sync secrets across teammates & machines: https://dotenvx.com/ops",
      "\u{1F5C2}\uFE0F backup and recover secrets: https://dotenvx.com/ops",
      "\u2705 audit secrets and track compliance: https://dotenvx.com/ops",
      "\u{1F504} add secrets lifecycle management: https://dotenvx.com/ops",
      "\u{1F511} add access controls to secrets: https://dotenvx.com/ops",
      "\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
      "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
      "\u2699\uFE0F  enable debug logging with { debug: true }",
      "\u2699\uFE0F  override existing env vars with { override: true }",
      "\u2699\uFE0F  suppress all logs with { quiet: true }",
      "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
      "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports, module) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports, module) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// src/app.ts
import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role UserRole? @default(CUSTOMER)\n\n  status    UserStatus? @default(ACTIVE)\n  medicines Medicine[]\n  orders    Orders[] // customer orders\n\n  orderItems OrderItem[]\n  reviews    Review[]\n\n  phone   String?\n  address String?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// model for medicines\n\nmodel Medicine {\n  id          String   @id @default(uuid())\n  name        String\n  description String?\n  price       Decimal  @db.Decimal(10, 2)\n  stock       Int\n  imageUrl    String?\n  categoryId  String\n  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)\n\n  sellerId String\n  seller   User   @relation(fields: [sellerId], references: [id], onDelete: Restrict)\n\n  status       MedicineStatus @default(AVAILABLE)\n  manufacturer String?\n  type         String?\n  createdAt    DateTime       @default(now())\n  updatedAt    DateTime       @updatedAt\n  orderItems   OrderItem[]\n  reviews      Review[]\n\n  @@index([sellerId])\n  @@index([categoryId])\n  @@index([name])\n}\n\n// model for categories\n\nmodel Category {\n  id          String     @id @default(uuid())\n  name        String     @unique\n  description String?\n  imageUrl    String?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n  medicines   Medicine[]\n}\n\n// model for orders\n\nmodel Orders {\n  id              String      @id @default(uuid())\n  userId          String\n  user            User        @relation(fields: [userId], references: [id], onDelete: Restrict)\n  totalAmount     Decimal     @db.Decimal(10, 2)\n  status          OrderStatus @default(PLACED)\n  phone           String?\n  shippingAddress String\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n  orderItems      OrderItem[]\n\n  @@index([userId])\n  @@index([status])\n  @@index([createdAt])\n}\n\n// model for order items\n\nmodel OrderItem {\n  id         String   @id @default(uuid())\n  orderId    String\n  order      Orders   @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  // \n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n  // \n  sellerId   String\n  seller     User     @relation(fields: [sellerId], references: [id], onDelete: Restrict)\n\n  quantity  Int\n  price     Decimal  @db.Decimal(10, 2)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([sellerId])\n  @@index([orderId])\n}\n\n//model for reviews\n\nmodel Review {\n  id         String   @id @default(uuid())\n  userId     String\n  user       User     @relation(fields: [userId], references: [id], onDelete: Restrict)\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade)\n\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n}\n\nenum UserRole {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nenum OrderStatus {\n  PLACED\n  PROCESSING\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum MedicineStatus {\n  AVAILABLE\n  DISCONTINUED\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"MedicineToUser"},{"name":"orders","kind":"object","type":"Orders","relationName":"OrdersToUser"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"MedicineToUser"},{"name":"status","kind":"enum","type":"MedicineStatus"},{"name":"manufacturer","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"}],"dbName":null},"Orders":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"OrdersToUser"},{"name":"totalAmount","kind":"scalar","type":"Decimal"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"shippingAddress","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToOrders"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Orders","relationName":"OrderItemToOrders"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"seller","kind":"object","type":"User","relationName":"OrderItemToUser"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var OrderStatus = {
  PLACED: "PLACED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: false
  },
  trustedOrigins: [
    process.env.FRONTEND_URL,
    "https://medistoreclient.vercel.app"
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        // defaultValue: "CUSTOMER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      address: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/modules/category/category.router.ts
import Express from "express";

// src/modules/category/category.service.ts
var createCategory = async ({
  name,
  description,
  imageUrl
}) => {
  const result = await prisma.category.create({
    data: {
      name,
      description: description ?? null,
      imageUrl: imageUrl ?? null
    }
  });
  return result;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};
var getCategoryById = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  return category;
};
var updateCategory = async (categoryId, data) => {
  return await prisma.category.update({
    where: {
      id: categoryId
    },
    data
  });
};
var deleteCategory = async (categoryId) => {
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const result = await categoryService.createCategory(req.body);
    res.status(201).json({
      message: "Category created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getAllCategories2 = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json({
      message: "Categories fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getCategoryById2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.getCategoryById(categoryId);
    if (!result) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.updateCategory(
      categoryId,
      req.body
    );
    res.status(200).json({
      message: "Category updated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    const result = await categoryService.deleteCategory(categoryId);
    res.status(200).json({
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getCategoryById: getCategoryById2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/middlewares/authGuard.ts
var authGuard = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      console.log("Session Data Today:", session);
      if (!session) {
        return res.status(401).json({ message: "You are not authorized, please log in." });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource."
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
var authGuard_default = authGuard;

// src/modules/category/category.router.ts
var categoryRouter = Express.Router();
categoryRouter.post(
  "/",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.createCategory
);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:categoryId", categoryController.getCategoryById);
categoryRouter.put(
  "/:categoryId",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.updateCategory
);
categoryRouter.delete(
  "/:categoryId",
  authGuard_default("ADMIN" /* ADMIN */),
  categoryController.deleteCategory
);
var category_router_default = categoryRouter;

// src/modules/medicine/medicine.router.ts
import Express2 from "express";

// src/modules/medicine/medicine.service.ts
var createMedicine = async (payload, userId) => {
  const result = await prisma.medicine.create({
    data: {
      ...payload,
      sellerId: userId
    },
    include: {
      category: true
    }
  });
  return result;
};
var getAllMedicines = async ({
  search,
  category,
  minPrice,
  maxPrice,
  page,
  limit,
  skip,
  sortBy,
  sortOrder
}) => {
  const andConditions = [];
  if (category) {
    andConditions.push({
      categoryId: category
    });
  }
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          manufacturer: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (minPrice !== void 0 || maxPrice !== void 0) {
    andConditions.push({
      price: {
        ...minPrice !== void 0 && { gte: minPrice },
        ...maxPrice !== void 0 && { lte: maxPrice }
      }
    });
  }
  const Allmedicines = await prisma.medicine.findMany({
    where: {
      AND: andConditions
    },
    include: {
      category: true
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    }
  });
  const total = await prisma.medicine.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: Allmedicines,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMedicineById = async (medicineId) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id: medicineId },
    include: {
      category: true
    }
  });
  return medicine;
};
var deleteMedicine = async (medicineId, userId) => {
  const medicine = await prisma.medicine.findUnique({
    where: {
      id: medicineId
    }
  });
  if (!medicine) {
    throw new Error("Medicine not found");
  }
  console.log("seller id:", medicine.sellerId);
  if (medicine.sellerId !== userId) {
    throw new Error("Unauthorized to delete this medicine");
  }
  await prisma.medicine.delete({
    where: { id: medicineId }
  });
};
var updateMedicine = async (payload, userId, medicineId) => {
  await prisma.medicine.findFirstOrThrow({
    where: {
      id: medicineId,
      sellerId: userId
    }
  });
  const result = await prisma.medicine.update({
    where: {
      id: medicineId
    },
    data: {
      ...payload
    },
    include: {
      category: true
    }
  });
  return result;
};
var getAllMedicinesBySellerId = async (sellerId) => {
  const medicines = await prisma.medicine.findMany({
    where: {
      sellerId
    },
    include: {
      category: true
    }
  });
  return medicines;
};
var medicineService = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  deleteMedicine,
  updateMedicine,
  getAllMedicinesBySellerId
};

// src/helpers/paginationSortingHelper.ts
var paginationSortingHelper = (options) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
  };
};
var paginationSortingHelper_default = paginationSortingHelper;

// src/modules/medicine/medicine.controller.ts
var createMedicine2 = async (req, res) => {
  try {
    const user = req.user;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type
    };
    const result = await medicineService.createMedicine(
      payload,
      user?.id
    );
    res.status(201).json({
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
var getAllMedicines2 = async (req, res) => {
  try {
    const { search, minPrice, maxPrice } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const minPriceNumber = minPrice ? parseFloat(minPrice) : void 0;
    const maxPriceNumber = maxPrice ? parseFloat(maxPrice) : void 0;
    const category = req.query.category;
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper_default(
      req.query
    );
    const result = await medicineService.getAllMedicines({
      search: searchString,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber,
      category,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json({
      message: "Medicines fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const medicine = await medicineService.getMedicineById(id);
    res.status(200).json({
      message: "Medicine fetched successfully",
      data: medicine
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const user = req.user;
    await medicineService.deleteMedicine(id, user?.id);
    res.status(200).json({
      message: "Medicine deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const user = req.user;
    const payload = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock, 10),
      imageUrl: req.body.imageUrl,
      categoryId: req.body.categoryId,
      manufacturer: req.body.manufacturer,
      type: req.body.type
    };
    const result = await medicineService.updateMedicine(
      payload,
      user?.id,
      id
    );
    res.status(200).json({
      message: "Medicine updated successfully",
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var getAllMedicinesBySellerId2 = async (req, res) => {
  try {
    const user = req.user;
    const medicines = await medicineService.getAllMedicinesBySellerId(
      user?.id
    );
    res.status(200).json({
      message: "Medicines fetched successfully - seller wise",
      data: medicines
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Something went wrong",
      data: null
    });
  }
};
var medicineController = {
  createMedicine: createMedicine2,
  getAllMedicines: getAllMedicines2,
  getMedicineById: getMedicineById2,
  deleteMedicine: deleteMedicine2,
  updateMedicine: updateMedicine2,
  getAllMedicinesBySellerId: getAllMedicinesBySellerId2
};

// src/modules/medicine/medicine.router.ts
var medicineRouter = Express2.Router();
medicineRouter.post(
  "/",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.createMedicine
);
medicineRouter.get("/", medicineController.getAllMedicines);
medicineRouter.get(
  "/seller",
  authGuard_default("SELLER" /* SELLER */),
  medicineController.getAllMedicinesBySellerId
);
medicineRouter.get("/:id", medicineController.getMedicineById);
medicineRouter.delete(
  "/:id",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.deleteMedicine
);
medicineRouter.put(
  "/:id",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  medicineController.updateMedicine
);
var medicine_router_default = medicineRouter;

// src/modules/order/order.router.ts
import Express3 from "express";

// src/modules/order/order.service.ts
var createOrder = async (payload, userId) => {
  return await prisma.$transaction(async (tx) => {
    const medicineIds = payload.orderItems.map((item) => item.medicineId);
    const medicines = await tx.medicine.findMany({
      where: {
        id: { in: medicineIds },
        status: "AVAILABLE"
      },
      select: {
        id: true,
        sellerId: true,
        price: true,
        stock: true,
        name: true
      }
    });
    if (medicines.length !== medicineIds.length) {
      const foundIds = medicines.map((m) => m.id);
      const notFound = medicineIds.filter((id) => !foundIds.includes(id));
      throw new Error(
        `Medicines not found or unavailable: ${notFound.join(", ")}`
      );
    }
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      if (!medicine) {
        throw new Error(`Medicine ${item.medicineId} not found`);
      }
      if (medicine.stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}, Requested: ${item.quantity}`
        );
      }
    }
    let totalAmount = 0;
    const orderItemData = payload.orderItems.map((item) => {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      const itemTotal = Number(medicine.price) * item.quantity;
      totalAmount += itemTotal;
      return {
        orderId: "",
        medicineId: item.medicineId,
        sellerId: medicine.sellerId,
        quantity: item.quantity,
        price: medicine.price
      };
    });
    const order = await tx.orders.create({
      data: {
        userId,
        totalAmount,
        phone: payload.phone,
        shippingAddress: payload.shippingAddress,
        status: "PLACED"
      }
    });
    orderItemData.forEach((item) => {
      item.orderId = order.id;
    });
    await tx.orderItem.createMany({
      data: orderItemData
    });
    for (const item of payload.orderItems) {
      const medicine = medicines.find((m) => m.id === item.medicineId);
      const newStock = medicine.stock - item.quantity;
      await tx.medicine.update({
        where: { id: item.medicineId },
        data: {
          stock: newStock,
          status: newStock === 0 ? "DISCONTINUED" : "AVAILABLE"
        }
      });
    }
    return await tx.orders.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            medicine: {
              select: {
                id: true,
                name: true,
                imageUrl: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
  });
};
var getUserOrders = async (userId) => {
  return await prisma.orders.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (orderId, userId) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    include: {
      orderItems: {
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== userId) {
    throw new Error("Unauthorized access to order");
  }
  return order;
};
var getOrderBySellerId = async (sellerId) => {
  const orderItemCount = await prisma.orderItem.count({
    where: { sellerId }
  });
  return await prisma.orders.findMany({
    where: {
      orderItems: {
        some: {
          sellerId
        }
      }
    },
    include: {
      orderItems: {
        where: {
          sellerId
        },
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var updateOrderStatus = async (orderId, status) => {
  const validStatuses = Object.values(OrderStatus);
  if (!validStatuses.includes(status)) {
    throw new Error(
      `Invalid order status. Must be one of: ${validStatuses.join(", ")}`
    );
  }
  const order = await prisma.orders.findUnique({
    where: { id: orderId }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  return await prisma.orders.update({
    where: { id: orderId },
    data: { status },
    include: {
      orderItems: {
        include: {
          medicine: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    }
  });
};
var getAllOrders = async () => {
  return await prisma.orders.findMany({
    include: {
      orderItems: {
        include: {
          medicine: true,
          seller: {
            select: {
              id: true,
              name: true,
              phone: true
            }
          }
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var trackOrderStatus = async (orderId, userId) => {
  const order = await prisma.orders.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      updatedAt: true,
      userId: true
    }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== userId) {
    throw new Error("Unauthorized access to order");
  }
  return order;
};
var orderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderBySellerId,
  updateOrderStatus,
  getAllOrders,
  trackOrderStatus
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const user = req.user;
    if (!req.body.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required"
      });
    }
    if (!req.body.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }
    if (!req.body.orderItems || !Array.isArray(req.body.orderItems)) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array"
      });
    }
    if (req.body.orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item"
      });
    }
    for (const item of req.body.orderItems) {
      if (!item.medicineId) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have medicineId"
        });
      }
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each order item must have a valid quantity"
        });
      }
    }
    const payload = {
      phone: req.body.phone,
      shippingAddress: req.body.shippingAddress,
      orderItems: req.body.orderItems.map((item) => ({
        medicineId: item.medicineId,
        quantity: item.quantity
      }))
    };
    const result = await orderService.createOrder(payload, user?.id);
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result
    });
  } catch (error) {
    console.error("Order creation error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : 400;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
var getUserOrders2 = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getUserOrders(user?.id);
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const order = await orderService.getOrderById(
      id,
      user?.id
    );
    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order
    });
  } catch (error) {
    console.error("Get order error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : error.message.includes("Unauthorized") ? 403 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order"
    });
  }
};
var getOrderBySellerId2 = async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getOrderBySellerId(user?.id);
    res.status(200).json({
      success: true,
      message: "Seller orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get seller orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve seller orders"
    });
  }
};
var updateOrderStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const result = await orderService.updateOrderStatus(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Update order status error:", error);
    if (error instanceof Error) {
      const statusCode = error.message.includes("not found") ? 404 : error.message.includes("Invalid") ? 400 : 500;
      return res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update order status"
    });
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({
      success: true,
      message: "All orders retrieved successfully",
      data: orders
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve all orders"
    });
  }
};
var trackOrderStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const order = await orderService.trackOrderStatus(id, user?.id);
    res.status(200).json({
      success: true,
      message: "Order status retrieved successfully",
      data: order
    });
  } catch (error) {
    console.error("Track order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order status"
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getUserOrders: getUserOrders2,
  getOrderById: getOrderById2,
  getOrderBySellerId: getOrderBySellerId2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2,
  trackOrderStatus: trackOrderStatus2
};

// src/modules/order/order.router.ts
var orderRouter = Express3.Router();
orderRouter.post(
  "/",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  orderController.createOrder
);
orderRouter.get(
  "/",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  orderController.getUserOrders
);
orderRouter.get(
  "/all",
  authGuard_default("ADMIN" /* ADMIN */),
  orderController.getAllOrders
);
orderRouter.get(
  "/seller",
  authGuard_default("SELLER" /* SELLER */),
  orderController.getOrderBySellerId
);
orderRouter.get(
  "/:id/status",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  orderController.trackOrderStatus
);
orderRouter.get(
  "/:id",
  authGuard_default("CUSTOMER" /* CUSTOMER */, "ADMIN" /* ADMIN */, "SELLER" /* SELLER */),
  orderController.getOrderById
);
orderRouter.patch(
  "/:id/status",
  authGuard_default("SELLER" /* SELLER */, "ADMIN" /* ADMIN */),
  orderController.updateOrderStatus
);
var order_router_default = orderRouter;

// src/modules/user/user.router.ts
import Express4 from "express";

// src/modules/user/user.service.ts
var getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true
    }
  });
};
var userStatusUpdate = async (id, status) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      status
    }
  });
};
var userService = {
  getAllUsers,
  userStatusUpdate
};

// src/modules/user/user.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users"
    });
  }
};
var userStatusUpdate2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = await userService.userStatusUpdate(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status"
    });
  }
};
var userController = {
  getAllUsers: getAllUsers2,
  userStatusUpdate: userStatusUpdate2
};

// src/modules/user/user.router.ts
var userRouter = Express4.Router();
userRouter.get("/", authGuard_default("ADMIN" /* ADMIN */), userController.getAllUsers);
userRouter.patch(
  "/:id/status",
  authGuard_default("ADMIN" /* ADMIN */),
  userController.userStatusUpdate
);
var user_router_default = userRouter;

// src/modules/review/review.router.ts
import Express5 from "express";

// src/modules/review/review.service.ts
var createCustomerReview = async (userId, payload) => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }
  const isCustomer = await prisma.user.findUnique({
    where: {
      id: userId,
      role: "CUSTOMER" /* CUSTOMER */
    }
  });
  if (!isCustomer) {
    throw new Error("Only login customers can create reviews");
  }
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      medicineId: payload.medicineId,
      order: { userId }
    }
  });
  if (!orderItem) {
    throw new Error("You can only review medicines you have purchased");
  }
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this medicine");
  }
  const review = await prisma.review.create({
    data: {
      userId,
      medicineId: payload.medicineId,
      rating: payload.rating,
      comment: payload.comment || null
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      medicine: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return review;
};
var getAllReviewsbyproductId = async (medicineId) => {
  const reviews = await prisma.review.findMany({
    where: {
      medicineId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var reviewService = {
  createCustomerReview,
  getAllReviewsbyproductId
};

// src/modules/review/review.controller.ts
var createCustomerReview2 = async (req, res) => {
  try {
    const user = req.user;
    console.log(user?.id);
    const payload = {
      medicineId: req.body.medicineId,
      rating: req.body.rating,
      comment: req.body.comment
    };
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    if (!payload.medicineId || !payload.rating) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID and rating are required"
      });
    }
    const result = await reviewService.createCustomerReview(user?.id, payload);
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create review"
    });
  }
};
var getAllReviewsbyproductId2 = async (req, res) => {
  try {
    const medicineId = req.params.medicineId;
    const result = await reviewService.getAllReviewsbyproductId(
      medicineId
    );
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: result
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to fetch reviews"
    });
  }
};
var reviewController = {
  createCustomerReview: createCustomerReview2,
  getAllReviewsbyproductId: getAllReviewsbyproductId2
};

// src/modules/review/review.router.ts
var reviewRouter = Express5.Router();
reviewRouter.post(
  "/",
  authGuard_default("CUSTOMER" /* CUSTOMER */),
  reviewController.createCustomerReview
);
reviewRouter.get("/:medicineId", reviewController.getAllReviewsbyproductId);
var review_router_default = reviewRouter;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
  res.status(200).send("Server is running...");
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/category", category_router_default);
app.use("/api/medicine", medicine_router_default);
app.use("/api/order", order_router_default);
app.use("/api/user", user_router_default);
app.use("/api/review", review_router_default);
var app_default = app;

// src/server.ts
var PORT = process.env.PORT;
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully.");
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
