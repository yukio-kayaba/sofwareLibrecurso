export const ResponseStatus = {
  success: "success",
  fail: "fail",
  error: "error",
} as const;

export const orderValues = {
  asc: "asc",
  desc: "desc",
} as const;

export const filterTypeValues = {
  eq: "eq",
  gt: "gt",
  lt: "lt",
  after: "after",
  before: "before",
} as const;

export const maxPageSize = 100;

export const defaultQueries = {
  search: "",
  sort_by: "",
  order: orderValues.desc,
  page: 1,
  page_size: 30,
  filter: "",
  filter_value: undefined,
  filter_type: filterTypeValues.eq,
};

export const PermisosPrincipal = {
  leer:"Puedes acceder a leer los repositorios",
  escribir:"Puedes ingresar a escribir los repositorios",
  ejecutar:"Acceso a ejecucion a los archivos"
} as const;

export type PermisoValor = keyof typeof PermisosPrincipal;

//export type PermisoValor =
  //(typeof PermisosPrincipal)[permisokey]["key"];




