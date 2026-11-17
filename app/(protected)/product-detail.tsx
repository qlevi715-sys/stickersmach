import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Drawer from "expo-router/drawer";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_PRODUCT = {
  category: "Periféricos Gaming",
  store: "ShopEase",
  name: "Teclado Mecánico RGB Pro Inalámbrico",
  imageUrl: "https://m.media-amazon.com/images/I/61inzrg4F+L.jpg",
  regularPrice: 110.0,
  offerPrice: 85.5,
  stock: 18,
  isOfficial: true,
  shippingLabel: "Envío Motorizado Hoy",
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const product = MOCK_PRODUCT;

  const discountPercent = Math.round(
    ((product.regularPrice - product.offerPrice) / product.regularPrice) * 100
  );

  // Siempre regresa a la lista de productos (igual que las demás pantallas).
  // router.back() dependía del historial del drawer y terminaba en el perfil.
  const handleBack = () => {
    router.replace("/(protected)/dashboard");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Drawer.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerSide} hitSlop={10}>
          <Ionicons name="arrow-back-outline" size={26} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerCategory}>{product.category}</Text>
          <Text style={styles.headerStore}>{product.store}</Text>
        </View>

        {/* Espaciador del mismo ancho que el botón para centrar el título */}
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TARJETA DE IMAGEN */}
        <View style={styles.imageCard}>
          <View style={styles.imageWrapper}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />

            {/* Contenedor flotante (position: absolute) */}
            <View style={styles.overlay} pointerEvents="box-none">
              <View style={styles.badgesColumn}>
                <View style={styles.discountBadge}>
                  <Ionicons name="flash" size={14} color="#FFF" />
                  <Text style={styles.discountText}>-{discountPercent}% OFF</Text>
                </View>

                {product.isOfficial && (
                  <View style={styles.officialBadge}>
                    <Ionicons name="shield-checkmark-outline" size={15} color="#374151" />
                    <Text style={styles.officialText}>Oficial</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.shareButton} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* INFORMACIÓN */}
        <View style={styles.infoSection}>
          <View style={[styles.pill, styles.stockPill]}>
            <View style={styles.stockDot} />
            <Text style={styles.stockText}>En Stock ({product.stock} disponibles)</Text>
          </View>

          <View style={[styles.pill, styles.shippingPill]}>
            <MaterialCommunityIcons name="motorbike" size={16} color="#4B5C8A" />
            <Text style={styles.shippingText}>{product.shippingLabel}</Text>
          </View>

          <Text style={styles.title}>{product.name}</Text>

          {/* PRECIOS */}
          <View style={styles.priceCard}>
            <Text style={styles.offerPrice}>${product.offerPrice.toFixed(2)}</Text>
            <Text style={styles.regularPrice}>${product.regularPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const GREEN = "#006C47";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSide: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerCategory: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
    letterSpacing: 0.4,
  },
  headerStore: {
    fontSize: 22,
    fontWeight: "bold",
    color: GREEN,
  },

  scrollContent: {
    paddingBottom: 32,
  },

  /* TARJETA DE IMAGEN */
  imageCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrapper: {
    height: 300,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  /* ELEMENTOS FLOTANTES */
  overlay: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgesColumn: {
    gap: 8,
    alignItems: "flex-start",
  },
  discountBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4CB782",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  discountText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.4,
  },
  officialBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  officialText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "bold",
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* INFO */
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: "flex-start",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  stockPill: {
    backgroundColor: "#C8F0D8",
  },
  stockDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  stockText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#14532D",
  },
  shippingPill: {
    backgroundColor: "#D6E4FF",
  },
  shippingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5C8A",
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
    marginBottom: 20,
  },

  /* PRECIOS */
  priceCard: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "baseline",
    gap: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  offerPrice: {
    fontSize: 30,
    fontWeight: "bold",
    color: GREEN,
  },
  regularPrice: {
    fontSize: 15,
    color: "#6B7280",
    textDecorationLine: "line-through",
  },
});
