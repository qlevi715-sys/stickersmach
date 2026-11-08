import axios from "axios"
import { api } from "../../api/http"

export interface CategoryResponse{
  id:number
  name:string
  description?:string
  createdAt:string
  updatedAt:string
}

export const CategoryService = {

  getCategories: async (token: string): Promise<CategoryResponse[]> => {
    try {
        const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`
        const response = await api.get<CategoryResponse[]>(
            "/categories",
            {
                headers: {
                    Authorization: authTokenHeader
                }
            }
        )

        console.log("RESPUESTA CATEGORIAS", response.data)
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data?.message || "Error to get categories")
        }
        throw new Error("Server error")
    }
},

  createCategory: async (
    name: string,
    description: string,
    token: string
  ): Promise<CategoryResponse> => {
    try {
      const authTokenHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const response = await api.post(
        "/categories/create",
        {
          name,
          description
        },
        {
          headers: {
            Authorization: authTokenHeader,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("RESPUESTA", response.data)

      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data?.message || "Error to save category");
      }
      
      throw new Error("Server error");
    }
  }
};