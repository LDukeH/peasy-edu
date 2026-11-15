import { setupWorker } from "msw/browser";
import { getPeasyEduAPIMock } from "@/api/generated/peasyApi.msw";

export const worker = setupWorker(...getPeasyEduAPIMock());
