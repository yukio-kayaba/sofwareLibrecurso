import z from "zod";
import { queryEschemas } from "../domain/query-params/queryParams-validator.ts";
import { filterTypeValues, orderValues } from "../consts.ts";

export type OrderValuesType = keyof typeof orderValues;
export type FilterTypeValuesType = keyof typeof filterTypeValues;

export type QueriesDtoType = z.infer<typeof queryEschemas>;
