import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { FieldError } from "@/components/field-error";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

export default function CreateProductScreen() {

  const router = useRouter();
  const {
    form,
    isLoadingProduct,
    errorMessage,
    submitProduct,
    categories,
    isLoadingCategories,
    isCategoriesShowModal,
    setIsCategoriesShowModal,
    selectCategory,
    selectedCategoryName
  } = useCreateProduct();

  const { values, errors, onChange, onBlur } = form
  const selectedCategoryId = values.categoryId ? Number(values.categoryId) : null

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.replace("/(protected)/dashboard")}
          >
            <Ionicons name="arrow-back-outline" size={26} />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
            <Text style={styles.headerSubtitle}>Nuevo Producto</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollContent}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name="clipboard"
                size={20}
                color="#006C47"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.cardTitle}>Informacion General</Text>
            </View>

            {errorMessage && (
              <View style={styles.serverError}>
                <Text style={styles.serverErrorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Input para el Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre del producto</Text>
              <TextInput
                placeholder="Ej. Zapato Nike"
                style={[styles.textInput, errors.name && styles.inputError]}
                value={values.name}
                onChangeText={onChange("name")}
                onBlur={onBlur("name")}
              />
              <FieldError message={errors.name} />
            </View>

            {/* Selector de Categoría */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria</Text>
              <TouchableOpacity
                style={[styles.selectorInput, errors.categoryId && styles.inputError]}
                onPress={() => setIsCategoriesShowModal(true)}
              >
                <Text>
                  {selectedCategoryName || "Seleccionar categoria"}
                </Text>
                <Feather
                  name="chevron-down"
                  size={20}
                />
              </TouchableOpacity>
              <FieldError message={errors.categoryId} />
            </View>

            {/* Campo SKU / Código de Barra */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SKU / Codigo de Barra</Text>
              <View style={[styles.inputWithIcon, errors.sku && styles.inputError]}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={20}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  placeholder="PR-7878787878787"
                  style={styles.textInputScan}
                  value={values.sku}
                  onChangeText={onChange("sku")}
                  onBlur={onBlur("sku")}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>
              <FieldError message={errors.sku} />
            </View>

            {/* Campo Descripción Detallada */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descripcion Detallada</Text>
              <TextInput
                placeholder="Describe los atributos principales, materiales, confeccion"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={2000}
                style={[styles.textAreaInput, errors.description && styles.inputError]}
                value={values.description}
                onChangeText={onChange("description")}
                onBlur={onBlur("description")}
              />
              <FieldError message={errors.description} />
              <View style={styles.chartCounterDescription}>
                <Text>{values.description.length}/2000</Text>
              </View>
            </View>

          </View>

          {/** PRECIOS E INVENTARIO */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather
                name="dollar-sign"
                size={20}
                color="#006C47"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.cardTitle}>Precios e Inventario</Text>
            </View>
            <View style={styles.rowCols}>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Precio Regular</Text>
                <View style={[styles.inputPriceWrapper, errors.regularPrice && styles.inputError]}>
                  <Text style={{ marginRight: 6 }}>$</Text>
                  <TextInput
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    value={values.regularPrice}
                    onChangeText={onChange("regularPrice")}
                    onBlur={onBlur("regularPrice")}
                  />
                </View>
                <FieldError message={errors.regularPrice} />
              </View>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Precio Oferta</Text>
                <View style={[styles.inputPriceWrapper, errors.offerPrice && styles.inputError]}>
                  <Text style={{ marginRight: 6 }}>$</Text>
                  <TextInput
                    placeholder="0.0"
                    keyboardType="decimal-pad"
                    style={styles.priceInput}
                    value={values.offerPrice}
                    onChangeText={onChange("offerPrice")}
                    onBlur={onBlur("offerPrice")}
                  />
                </View>
                <FieldError message={errors.offerPrice} />
              </View>
            </View>
            <View style={styles.rowCols}>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Stock Inicial</Text>
                <View style={[styles.inputPriceWrapper, errors.initialStock && styles.inputError]}>
                  <Feather name="package" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                  <TextInput
                    placeholder="50"
                    keyboardType="number-pad"
                    style={styles.priceInput}
                    value={values.initialStock}
                    onChangeText={onChange("initialStock")}
                    onBlur={onBlur("initialStock")}
                  />
                </View>
                <FieldError message={errors.initialStock} />
              </View>
              <View style={styles.col}>
                <Text style={styles.inputLabel}>Stock Minimo</Text>
                <View style={[styles.inputPriceWrapper, errors.minStockAlert && styles.inputError]}>
                  <Feather name="alert-triangle" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                  <TextInput
                    placeholder="5"
                    keyboardType="number-pad"
                    style={styles.priceInput}
                    value={values.minStockAlert}
                    onChangeText={onChange("minStockAlert")}
                    onBlur={onBlur("minStockAlert")}
                  />
                </View>
                <FieldError message={errors.minStockAlert} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnSave}
              onPress={submitProduct}
              disabled={isLoadingProduct}
            >
              {isLoadingProduct ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Ionicons style={styles.checkIcon} name="checkmark-outline" size={22} color="#FFF" />
                  <Text style={styles.btnSaveText}>Guardar Producto</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
    visible={isCategoriesShowModal}
    transparent
    animationType="slide"
    onRequestClose={() => setIsCategoriesShowModal(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text>Seleccionar Categoria</Text>
                <TouchableOpacity
                    onPress={() => setIsCategoriesShowModal(false)}
                >
                    <Feather name="x" size={22} color="#374151"/>
                </TouchableOpacity>
            </View>

            {isLoadingCategories ? (
                <ActivityIndicator size="large" color="#006C47"/>
            ) : (
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => {
                        const isSelected = item.id === selectedCategoryId
                        return (
                            <TouchableOpacity
                                style={[styles.categoryOption, isSelected && styles.categoryOptionSelected]}
                                onPress={() => selectCategory(item)}
                            >
                                <Text style={[styles.categoryOptionText, isSelected && styles.categoryOptionTextSelected]}>
                                    {item.name}
                                </Text>
                                {isSelected && <Feather name="check" size={18} color="#006C47"/>}
                            </TouchableOpacity>
                        )
                    }}
                />
            )}
        </View>
    </View>
</Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#F9FAFB",
  },
  titleWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#006C47",
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputError: {
    borderColor: "#DC2626",
  },
  serverError: {
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
    marginBottom: 14,
    padding: 12,
  },
  serverErrorText: {
    fontSize: 14,
    textAlign: "center",
    color: "#DC2626",
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    fontSize: 14,
    borderRadius: 10,
  },
  selectorInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWithIcon: {
    height: 48,
    borderWidth: 1,
    flexDirection: "row",
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  textInputScan: {
    flex: 1,
    padding: 0,
  },
  textAreaInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  chartCounterDescription: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  rowCols: {
    flexDirection: "row",
    gap: 8
  },
  col: {
    flex: 1,
    marginBottom: 5
  },
  inputPriceWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
  },
  priceInput: {
    flex: 1,
    padding: 0
  },
  btnSave: {
    backgroundColor: "#006C47",
    height: 48,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 15
  },
  checkIcon: {
    marginRight: 8,
  },
  btnSaveText: {
    color: "#FFF",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#rgba(0,0,0,0.4)",
    justifyContent: "flex-end"
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    maxHeight: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  modalHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:16,
    paddingBottom:10,
    borderBottomWidth:1,
    borderBlockEndColor:"#E5E7EB"
  },
      categoryOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 8
    },
    categoryOptionSelected: {
        backgroundColor: "#ECFDF5"
    },
    categoryOptionText: {
        fontSize: 16,
        color: "#374151"
    },
    categoryOptionTextSelected: {
        color: "#006C47",
        fontWeight:"600"
    },
});