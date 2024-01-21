export interface GenericResponseBody<Data> {
  status: number;
  data?: Data;
}

export interface GenericResponsePaginatedBody<Item>
  extends GenericResponseBody<{ items: Item[]; cursorNext?: string }> {
  status: 200;
  data: {
    items: Item[];
    cursorNext?: string;
  };
}
