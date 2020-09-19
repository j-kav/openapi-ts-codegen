import { Dictionary } from "../../../utils/types";
import { OpenApiReference } from "./OpenApiReference";
import { OpenApiServer } from "./OpenApiServer";

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#linkObject
 */
export interface OpenApiLink extends OpenApiReference {
  operationRef?: string;
  operationId?: string;
  parameters?: Dictionary<any>;
  requestBody?: any;
  description?: string;
  server?: OpenApiServer;
}
