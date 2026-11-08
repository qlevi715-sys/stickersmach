import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { useAuth } from "../../context/AuthContext";
import { ProductItem } from "../models/product.model";
import { ProductService } from "../services/product.services";

export function useCreateProduct() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [products, setProducts] = useState<ProductItem[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false)
    const [sku, setSku] = useState("")
    const [description, setDescription] = useState("")
    const [regularPrice, setRegularPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [initialStock, setInitialStock] = useState("")
    const [minStockAlert, setMinStockAlert] = useState("")
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [selectedCategoryName, setSelectedCategoryName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchProducts = useCallback(async () => {
        if (!token) return
        setIsLoadingProduct(true)
        try {

             if(selectedCategoryId === null ){
                const data = await ProductService.getProductsByCategoryId(1, token)
                setProducts(data)
            }else{
                const data = await ProductService.getProductsByCategoryId(Number(selectedCategoryId), token)
            setProducts(data)
            }
        } catch (error) {
            console.log("error al traer los productos");
        } finally {
            setIsLoadingProduct(false)
        }

    }, [token, selectedCategoryId])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const fetchCategories = async () => {
        if (!token) return
        setIsLoadingCategories(true)
        try {
            const data = await CategoryService.getCategories(token)
            setCategories(data)
        } catch (error: any) {
            console.log("Error al cargar las categorias");
            setProducts([])
        } finally {
            setIsLoadingCategories(false)
        }
    }

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("Por favor completa los campos obligatorios")
            return
        }

        if (!token) {
            setErrorMessage("Sesion no valida")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)

        console.log("PRODUCT ID", categoryId)

        try {
            await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parseFloat(regularPrice),
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: parseInt(initialStock, 10),
                    minStockAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0
                },
                token
            )
            console.log("PRODUCTO CREADO", Response)

            Alert.alert("Exito", "Producto creado correctamente")

        } catch (error: any) {
            console.error("Error al crear producto:", error);
            setErrorMessage(error.message || "Hubo un problema al crear el producto");
        } finally {
            setIsLoadingProduct(false)
        }
    }

    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const query = searchQuery.toLowerCase().trim()
            if (!query) return true
            return (
                p.name.toLowerCase().includes(query) ||
                (p.description && p.description.toLowerCase().includes(query))
            )
        })
    }, [products, searchQuery])

    return {
        name,
        setName,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        isLoadingProduct,
        errorMessage,
        setErrorMessage,
        submitProduct,
        selectedCategoryName,
        setSelectedCategoryName,
        products: filteredProducts,
        searchQuery,
        setSearchQuery,
        refreshProducts: fetchProducts,
        selectedCategoryId,
        setSelectedCategoryId,
    }
} 