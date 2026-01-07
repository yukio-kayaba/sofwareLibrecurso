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
  seeproducts: "Los usuarios que pueden acceder a ver los productos",
  editproducts: "usuarios que pueden editar los productos",
  deleteproducts: "eliminacion de los productos",
  seeorders: "acceder a ver los pedidos",
  editorders: "editar los pedidos",
  deleteorders: "eliminar los pedidos",
  seeuser: "Ver los usuarios",
  edituser: "Editar a los usuarios",
  deleteuser: "Elimina a los usuarios",
} as const;

export type PermisoValor = keyof typeof PermisosPrincipal;

//export type PermisoValor =
  //(typeof PermisosPrincipal)[permisokey]["key"];

export const permisosCliente: PermisoValor[] = ["seeproducts"];

export const permisosColaborador:PermisoValor[] =[
  "seeorders",
  "editorders",
  "seeuser",
  "seeproducts"
]



