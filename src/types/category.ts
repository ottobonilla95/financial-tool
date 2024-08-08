export type Category = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};
