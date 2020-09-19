import * as OpenAPI from ".";

describe("index", () => {
  it("parses v3 without issues", async () => {
    await OpenAPI.generate({
      input: "./test/mock/v3/spec.json",
      output: "./test/result/v3/",
      useOptions: true,
      useUnionTypes: true,
      write: false,
    });
  });

  it("downloads and parses v3 without issues", async () => {
    await OpenAPI.generate({
      input:
        "https://raw.githubusercontent.com/ferdikoomen/openapi-typescript-codegen/master/test/mock/v3/spec.json",
      output: "./test/result/v3-downloaded/",
      write: false,
    });
  });
});
