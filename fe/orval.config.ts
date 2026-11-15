import { defineConfig } from "orval";

export default defineConfig({
  peasyApi: {
    input: {
      target: "../openapi.json",
    },
    output: {
      mode: "split",
      target: "src/api/generated/peasyApi.ts",
      schemas: "src/api/generated/model",
      client: "react-query",
      httpClient: "axios", // <-- Thêm dòng này cho Orval v8
      mock: true,
      clean: true,
      override: {
        mutator: {
          path: "./src/api/mutator/custom-instance.ts",
          name: "customInstance",
        },
      },
    },
  },
});
