import { Operation } from "../../../client/interfaces/Operation";
import { OperationParameters } from "../../../client/interfaces/OperationParameters";
import { OpenApi } from "../interfaces/OpenApi";
import { OpenApiOperation } from "../interfaces/OpenApiOperation";
import { getComment } from "./getComment";
import { getOperationErrors } from "./getOperationErrors";
import { getOperationName } from "./getOperationName";
import { getOperationParameters } from "./getOperationParameters";
import { getOperationPath } from "./getOperationPath";
import { getOperationRequestBody } from "./getOperationRequestBody";
import { getOperationResponseHeader } from "./getOperationResponseHeader";
import { getOperationResponses } from "./getOperationResponses";
import { getOperationResults } from "./getOperationResults";
import { getServiceClassName } from "./getServiceClassName";
import { sortByRequired } from "./sortByRequired";

const lowercaseFirstLetter = (value: string): string => {
  return value.charAt(0).toLowerCase() + value.slice(1);
};

export function getOperation(
  openApi: OpenApi,
  url: string,
  method: string,
  op: OpenApiOperation,
  pathParams: OperationParameters
): Operation {
  const serviceName = (op.tags && op.tags[0]) || "Service";
  const serviceClassName = getServiceClassName(serviceName);
  const operationNameFallback = `${method}${getOperationName(
    url.substr(url.lastIndexOf("/") + 1, url.length)
  )}`;
  const operationName = lowercaseFirstLetter(
    getOperationName(op.operationId || operationNameFallback)
  );
  const operationPath = getOperationPath(url);

  // Create a new operation object for this method.
  const operation: Operation = {
    service: serviceClassName,
    name: operationName,
    summary: getComment(op.summary),
    description: getComment(op.description),
    deprecated: op.deprecated === true,
    method: method,
    path: operationPath,
    parameters: [...pathParams.parameters],
    parametersPath: [...pathParams.parametersPath],
    parametersQuery: [...pathParams.parametersQuery],
    parametersForm: [...pathParams.parametersForm],
    parametersHeader: [...pathParams.parametersHeader],
    parametersCookie: [...pathParams.parametersCookie],
    parametersBody: pathParams.parametersBody,
    imports: [],
    errors: [],
    results: [],
    responseHeader: null,
  };

  // Parse the operation parameters (path, query, body, etc).
  if (op.parameters) {
    const parameters = getOperationParameters(openApi, op.parameters);
    operation.imports.push(...parameters.imports);
    operation.parameters.push(...parameters.parameters);
    operation.parametersPath.push(...parameters.parametersPath);
    operation.parametersQuery.push(...parameters.parametersQuery);
    operation.parametersForm.push(...parameters.parametersForm);
    operation.parametersHeader.push(...parameters.parametersHeader);
    operation.parametersCookie.push(...parameters.parametersCookie);
    operation.parametersBody = parameters.parametersBody;
  }

  if (op.requestBody) {
    const requestBody = getOperationRequestBody(openApi, op.requestBody);
    operation.imports.push(...requestBody.imports);
    operation.parameters.push(requestBody);
    operation.parameters = operation.parameters.sort(sortByRequired);
    operation.parametersBody = requestBody;
  }

  // Parse the operation responses.
  if (op.responses) {
    const operationResponses = getOperationResponses(openApi, op.responses);
    const operationResults = getOperationResults(operationResponses);
    operation.errors = getOperationErrors(operationResponses);
    operation.responseHeader = getOperationResponseHeader(operationResults);

    operationResults.forEach((operationResult) => {
      operation.results.push(operationResult);
      operation.imports.push(...operationResult.imports);
    });
  }

  return operation;
}
