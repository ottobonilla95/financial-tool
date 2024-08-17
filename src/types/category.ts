export type Category = {
  id: string;
  name: string;
  color: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};
