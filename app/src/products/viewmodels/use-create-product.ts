import { useValidatedForm } from "@/hooks/use-validated-form";
import { alertInvalidForm } from "@/utils/alerts";
import {
    filters,
    validateDescription,
    validateInteger,
    validateOfferPrice,
    validatePrice,
    validateProductName,
    validateRequiredSelection,
    validateSku,
} from "@/utils/validators";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { useAuth } from "../../context/AuthContext";
import { ProductItem } from "../models/product.model";
import { ProductService } from "../services/product.services";

export function useCreateProduct() {
    const { token } = useAuth();

    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
    const [products, setProducts] = useState<ProductItem[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false)
    const [isLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [selectedCategoryName, setSelectedCategoryName] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    const form = useValidatedForm(
        {
            name: "",
            categoryId: "",
            sku: "",
            description: "",
            regularPrice: "",
            offerPrice: "",
            initialStock: "",
            minStockAlert: "",
        },
        {
            name: { filter: filters.productName, validate: (value) => validateProductName(value) },
            categoryId: {
                validate: (value) => validateRequiredSelection(value, "Selecciona una categoría.")
            },
            sku: { filter: filters.sku, validate: (value) => validateSku(value) },
            description: {
                validate: (value) => validateDescription(value, "La descripción", { required: false })
            },
            regularPrice: {
                filter: filters.decimal,
                validate: (value) => validatePrice(value, "El precio regular"),
                // El precio de oferta depende del regular
                revalidate: ["offerPrice"],
            },
            offerPrice: {
                filter: filters.decimal,
                validate: (value, values) => validateOfferPrice(value, values.regularPrice),
            },
            initialStock: {
                filter: filters.integer,
                validate: (value) => validateInteger(value, "El stock inicial"),
            },
            minStockAlert: {
                filter: filters.integer,
                validate: (value) => validateInteger(value, "El stock mínimo", { required: false }),
            },
        }
    )

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

    /** Selecciona la categoría del formulario y cierra el modal. */
    const selectCategory = (category: CategoryResponse) => {
        form.onChange("categoryId")(String(category.id))
        setSelectedCategoryName(category.name)
        setIsCategoriesShowModal(false)
    }

    const submitProduct = async () => {
        setErrorMessage(null)

        if (!form.validateAll()) {
            alertInvalidForm()
            return
        }

        if (!token) {
            setErrorMessage("Sesion no valida")
            return
        }

        const { name, categoryId, sku, description, regularPrice, offerPrice, initialStock, minStockAlert } = form.values

        setIsLoadingProduct(true)

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

            Alert.alert("Exito", "Producto creado correctamente")
            form.reset()
            setSelectedCategoryName("")

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
        form,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        selectCategory,
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
