'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  CircleHelp,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  UserRound,
  X,
  RefreshCw,
  Barcode,
  Globe,
  Sun,
  Moon,
  Languages,
  Pencil,
  Trash2,
  MoreVertical,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-context'
import { dashboardApi, productApi, stockApi, authApi } from '@/lib/api'

const WORLD_COUNTRIES = [
  'Tunisie', 'France', 'Allemagne', 'Italie', 'Espagne', 'Chine', 'États-Unis', 'Turquie', 'Algérie', 'Maroc',
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Andorre', 'Angola', 'Arabie Saoudite', 'Argentine', 'Arménie', 'Australie', 'Autriche', 'Azerbaïdjan',
  'Bahamas', 'Bahreïn', 'Bangladesh', 'Belgique', 'Bénin', 'Bhoutan', 'Biélorussie', 'Birmanie (Myanmar)', 'Bolivie', 'Bosnie-Herzégovine', 'Botswana', 'Brésil', 'Brunei', 'Bulgarie', 'Burkina Faso', 'Burundi',
  'Cambodge', 'Cameroun', 'Canada', 'Cap-Vert', 'Chili', 'Chypre', 'Colombie', 'Comores', 'Congo', 'Corée du Nord', 'Corée du Sud', 'Costa Rica', "Côte d'Ivoire", 'Croatie', 'Cuba',
  'Danemark', 'Djibouti', 'Dominique',
  'Égypte', 'Émirats Arabes Unis', 'Équateur', 'Érythrée', 'Estonie', 'Éthiopie',
  'Fidji', 'Finlande',
  'Gabon', 'Gambie', 'Géorgie', 'Ghana', 'Grèce', 'Grenade', 'Guatemala', 'Guinée', 'Guinée équatoriale', 'Guyana',
  'Haïti', 'Honduras', 'Hongrie',
  'Inde', 'Indonésie', 'Irak', 'Iran', 'Irlande', 'Islande', 'Israël',
  'Jamaïque', 'Japon', 'Jordanie',
  'Kazakhstan', 'Kenya', 'Kirghizistan', 'Koweït',
  'Laos', 'Lesotho', 'Lettonie', 'Liban', 'Libéria', 'Libye', 'Liechtenstein', 'Lituanie', 'Luxembourg',
  'Macédoine du Nord', 'Madagascar', 'Malaisie', 'Malawi', 'Maldives', 'Mali', 'Malte', 'Maurice', 'Mauritanie', 'Mexique', 'Moldavie', 'Monaco', 'Mongolie', 'Monténégro', 'Mozambique',
  'Namibie', 'Népal', 'Nicaragua', 'Niger', 'Négéria', 'Norvège', 'Nouvelle-Zélande',
  'Oman', 'Ouganda', 'Ouzbékistan',
  'Pakistan', 'Panama', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 'Pologne', 'Porto Rico', 'Portugal',
  'Qatar',
  'République Centrafricaine', 'République Dominicaine', 'République Tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
  'Sénégal', 'Serbie', 'Seychelles', 'Sierra Leone', 'Singapour', 'Slovaquie', 'Slovénie', 'Somalie', 'Soudan', 'Sri Lanka', 'Suède', 'Suisse', 'Syrie',
  'Tadjikistan', 'Taïwan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Togo', 'Turkménistan',
  'Ukraine', 'Uruguay',
  'Vatican', 'Vénézuéla', 'Viêt Nam',
  'Yémen',
  'Zambie', 'Zimbabwé'
]

function CountrySelect({
  value,
  onChange,
  style,
  placeholder = 'Rechercher un pays...'
}: {
  value: string
  onChange: (val: string) => void
  style?: React.CSSProperties
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return WORLD_COUNTRIES
    return WORLD_COUNTRIES.filter((c) =>
      c.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div
      style={{ position: 'relative', width: '100%', ...style }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }}
    >
      <div
        className="custom-select-trigger"
        style={{
          width: '100%',
          height: style?.height || '42px',
          padding: '0 12px',
          borderRadius: style?.borderRadius || '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: isOpen ? '0 0 0 2px rgba(98, 86, 235, 0.2)' : 'none',
          borderColor: isOpen ? '#6256eb' : undefined,
        }}
      >
        <Search style={{ width: '16px', height: '16px', color: '#64748b', flexShrink: 0 }} />
        <input
          type="text"
          value={isOpen ? searchQuery : value}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setSearchQuery('')
          }}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            fontSize: style?.fontSize || '13px',
            fontWeight: !isOpen && value ? 600 : 400,
          }}
        />
        {isOpen ? (
          <X
            style={{ width: '16px', height: '16px', color: '#94a3b8', cursor: 'pointer', flexShrink: 0 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
              setSearchQuery('')
            }}
          />
        ) : (
          <ChevronDown
            style={{ width: '16px', height: '16px', color: '#64748b', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {isOpen && (
        <div
          className="custom-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 999,
            borderRadius: '10px',
            padding: '6px',
          }}
        >
          <div
            style={{
              maxHeight: '160px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Aucun pays trouvé
              </div>
            ) : (
              filtered.map((c) => (
                <div
                  key={c}
                  className={`custom-select-option ${value === c ? 'selected' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onChange(c)
                    setIsOpen(false)
                    setSearchQuery('')
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: value === c ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{c}</span>
                  {value === c && <span style={{ color: '#6256eb', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductSelect({
  products,
  value,
  onChange,
  style,
  placeholder = 'Rechercher un produit...'
}: {
  products: any[]
  value: string
  onChange: (productId: string, product: any) => void
  style?: React.CSSProperties
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedProduct = useMemo(
    () => products.find((p) => (p._id || p.id) === value),
    [products, value]
  )

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  const displayLabel = selectedProduct
    ? `${selectedProduct.name} (${selectedProduct.reference}) — Stock: ${selectedProduct.quantity}`
    : ''

  return (
    <div
      style={{ position: 'relative', width: '100%', ...style }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOpen(false)
          setSearchQuery('')
        }
      }}
    >
      <div
        className="custom-select-trigger"
        style={{
          width: '100%',
          height: style?.height || '42px',
          padding: '0 12px',
          borderRadius: style?.borderRadius || '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: isOpen ? '0 0 0 2px rgba(98, 86, 235, 0.2)' : 'none',
          borderColor: isOpen ? '#6256eb' : undefined,
        }}
      >
        <Search style={{ width: '16px', height: '16px', color: '#64748b', flexShrink: 0 }} />
        <input
          type="text"
          value={isOpen ? searchQuery : displayLabel}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if (!isOpen) setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            setSearchQuery('')
          }}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            fontSize: style?.fontSize || '13px',
            fontWeight: !isOpen && selectedProduct ? 600 : 400,
          }}
        />
        {isOpen ? (
          <X
            style={{ width: '16px', height: '16px', color: '#94a3b8', cursor: 'pointer', flexShrink: 0 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
              setSearchQuery('')
            }}
          />
        ) : (
          <ChevronDown
            style={{ width: '16px', height: '16px', color: '#64748b', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setIsOpen(true)}
          />
        )}
      </div>

      {isOpen && (
        <div
          className="custom-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 999,
            borderRadius: '10px',
            padding: '6px',
          }}
        >
          <div
            style={{
              maxHeight: '160px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {filtered.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Aucun produit trouvé
              </div>
            ) : (
              filtered.map((p) => {
                const pId = p._id || p.id
                const isSelected = value === pId
                return (
                  <div
                    key={pId}
                    className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onChange(pId, p)
                      setIsOpen(false)
                      setSearchQuery('')
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '13px', color: 'inherit' }}>
                        {p.name}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {p.reference} · {p.price} TND
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: p.quantity === 0 ? '#fee2e2' : p.quantity <= (p.minimumStock || 0) ? '#ffedd5' : '#f0fdf4',
                        color: p.quantity === 0 ? '#9f1239' : p.quantity <= (p.minimumStock || 0) ? '#c2410c' : '#0f766e',
                      }}
                    >
                      Stock: {p.quantity}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ stock, threshold, lang = 'FR' }: { stock: number; threshold: number; lang?: Language }) {
  const t = (key: string) => DICTIONARY[lang]?.[key] || DICTIONARY['FR']?.[key] || key
  const status = stock === 0 ? t('outOfStock') : stock <= threshold ? t('lowStock') : t('inStock')
  return (
    <span
      className={`status-badge ${
        stock === 0 ? 'status-danger' : stock <= threshold ? 'status-warning' : 'status-success'
      }`}
    >
      <span className="status-dot" />
      {status}
    </span>
  )
}

export type Language = 'FR' | 'EN' | 'AR'

const DICTIONARY: Record<Language, Record<string, string>> = {
  FR: {
    products: 'Produits',
    stockEntry: 'Entrée de stock',
    stockExit: 'Sortie de stock',
    history: 'Historique',
    settings: 'Paramètres',
    more: 'Plus',
    overviewSubtitle: 'Gestion du catalogue et suivi des mouvements de stock.',
    allProductsCount: 'Tous les produits',
    searchPlaceholder: 'Rechercher par nom, référence...',
    stockAvailable: 'Stock disponible',
    addStockBtn: '+ Entrée Stock',
    removeStockBtn: '- Sortie Stock',
    inStock: 'En Stock',
    lowStock: 'Stock Faible',
    outOfStock: 'Rupture',
    newProduct: 'Nouveau Produit',
    edit: 'Modifier',
    delete: 'Supprimer',
    cancel: 'Annuler',
    saveProduct: 'Enregistrer Produit',
    update: 'Mettre à Jour',
    userProfile: 'Profil Utilisateur',
    changePassword: 'Changer le Mot de Passe',
    oldPassword: 'Ancien Mot de Passe',
    newPassword: 'Nouveau Mot de Passe',
    confirmPassword: 'Confirmer le Nouveau Mot de Passe',
    logout: 'Déconnexion',
    currencySetting: "Devise d'Affichage Principale",
    noProductsFound: 'Aucun produit trouvé dans le catalogue.',
    accountRole: 'Rôle du Compte',
    securityStatus: 'Statut de Sécurité',
    adminRole: 'Administrateur (Accès Total)',
    verifiedAccount: 'Compte Vérifié',
    unitPrice: 'Prix Unitaire',
    totalValue: 'Valeur Stock',
    ref: 'Réf',
    units: 'unités',
    unit: 'unité',
    actions: 'Actions Rapides',
    settingsSub: 'Gestion du profil utilisateur et sécurité du compte.',
    changePasswordSuccess: 'Mot de passe modifié avec succès!',
    overview: "VUE D'ENSEMBLE",
    defaultOrigin: 'Origine par Défaut',
    currentStock: 'STOCK ACTUEL',
    minThreshold: 'SEUIL MINI',
    status: 'STATUT',
    productAndRef: 'PRODUIT & RÉFÉRENCE',
    category: 'CATÉGORIE',
    filterLowStock: 'Filtre Stock Faible',
    showAll: 'Afficher Tous',
    searchTablePlaceholder: 'Rechercher par nom, référence, origine ou code-barres...',
    addStock: '+ Ajouter Stock',
    removeStock: '- Retirer Stock',
    stockEntryTitle: 'Entrée de Stock',
    stockEntrySub: "Ajoutez des unités au stock avec la traçabilité de l'origine.",
    stockEntryForm: "Formulaire d'Entrée de Stock",
    selectProduct: 'Sélectionner le Produit',
    incomingQty: 'Quantité Entrante (+ Unités)',
    originCountry: 'Pays d’Origine du Lot',
    unitCost: 'Prix Unitaire d’Achat',
    noteOptional: 'Note / Réf Facture Fournisseur (Optionnel)',
    submitEntry: 'Enregistrer Entrée de Stock',
    stockExitTitle: 'Sortie de Stock',
    stockExitSub: 'Retirez des unités du stock avec contrôle anti-dépassement.',
    stockExitForm: 'Formulaire de Sortie de Stock',
    outgoingQty: 'Quantité à Retirer (- Unités)',
    sellingPrice: 'Prix Unitaire de Vente',
    noteCustomerOptional: 'Note / Réf Commande Client (Optionnel)',
    submitExit: 'Enregistrer Sortie de Stock',
    historyTitle: 'Historique Général des Mouvements',
    historySub: 'Traçabilité complète des entrées, sorties, origines de lots et opérateurs.',
    timestamp: 'HORODATAGE',
    movRef: 'RÉF MOV',
    type: 'TYPE',
    quantity: 'QUANTITÉ',
    origin: 'PAYS D’ORIGINE',
    unitPriceCol: 'PRIX UNIT.',
    operator: 'OPÉRATEUR',
    noteCol: 'NOTE',
    entryTag: 'ENTRÉE',
    exitTag: 'SORTIE',
    auditTrail: 'AUDIT TRAIL COMPLET',
    manager: 'Gestionnaire',
    createProductTitle: 'Créer un Nouveau Produit',
    editProductTitle: 'Modifier le Produit',
    productSub: 'Catalogue Produit · Remplissez les informations ci-dessous',
    editProductSub: 'Modifiez les détails du catalogue ci-dessous',
    barcodeOptional: 'Code-barres (Optionnel)',
    minStockThreshold: 'Seuil Stock Faible',
    uniqueRef: 'Référence Unique du Produit',
    productNameLabel: 'Nom du Produit',
    installApp: "Installer App",
  },
  EN: {
    products: 'Products',
    stockEntry: 'Stock Entry',
    stockExit: 'Stock Exit',
    history: 'History',
    settings: 'Settings',
    more: 'More',
    overviewSubtitle: 'Catalog management and stock movement tracking.',
    allProductsCount: 'All products',
    searchPlaceholder: 'Search by name, reference...',
    stockAvailable: 'Available stock',
    addStockBtn: '+ Add Stock',
    removeStockBtn: '- Remove Stock',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    newProduct: 'New Product',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    saveProduct: 'Save Product',
    update: 'Update',
    userProfile: 'User Profile',
    changePassword: 'Change Password',
    oldPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    logout: 'Log Out',
    currencySetting: 'Primary Display Currency',
    noProductsFound: 'No products found in catalog.',
    accountRole: 'Account Role',
    securityStatus: 'Security Status',
    adminRole: 'Administrator (Full Access)',
    verifiedAccount: 'Verified Account',
    unitPrice: 'Unit Price',
    totalValue: 'Stock Value',
    ref: 'Ref',
    units: 'units',
    unit: 'unit',
    actions: 'Quick Actions',
    settingsSub: 'User profile management and account security.',
    changePasswordSuccess: 'Password changed successfully!',
    overview: 'OVERVIEW',
    defaultOrigin: 'Default Origin',
    currentStock: 'CURRENT STOCK',
    minThreshold: 'MIN THRESHOLD',
    status: 'STATUS',
    productAndRef: 'PRODUCT & REFERENCE',
    category: 'CATEGORY',
    filterLowStock: 'Low Stock Filter',
    showAll: 'Show All',
    searchTablePlaceholder: 'Search by name, reference, origin or barcode...',
    addStock: '+ Add Stock',
    removeStock: '- Remove Stock',
    stockEntryTitle: 'Stock Entry',
    stockEntrySub: 'Add units to stock with origin traceability.',
    stockEntryForm: 'Stock Entry Form',
    selectProduct: 'Select Product',
    incomingQty: 'Incoming Quantity (+ Units)',
    originCountry: 'Batch Country of Origin',
    unitCost: 'Purchase Unit Price',
    noteOptional: 'Note / Supplier Invoice Ref (Optional)',
    submitEntry: 'Save Stock Entry',
    stockExitTitle: 'Stock Exit',
    stockExitSub: 'Remove units from stock with automatic overflow check.',
    stockExitForm: 'Stock Exit Form',
    outgoingQty: 'Quantity to Remove (- Units)',
    sellingPrice: 'Selling Unit Price',
    noteCustomerOptional: 'Note / Customer Order Ref (Optional)',
    submitExit: 'Save Stock Exit',
    historyTitle: 'General Movement History',
    historySub: 'Full traceability of entries, exits, batch origins, and operators.',
    timestamp: 'TIMESTAMP',
    movRef: 'MOV REF',
    type: 'TYPE',
    quantity: 'QUANTITY',
    origin: 'ORIGIN',
    unitPriceCol: 'UNIT PRICE',
    operator: 'OPERATOR',
    noteCol: 'NOTE',
    entryTag: 'ENTRY',
    exitTag: 'EXIT',
    auditTrail: 'COMPLETE AUDIT TRAIL',
    manager: 'Manager',
    createProductTitle: 'Create New Product',
    editProductTitle: 'Edit Product',
    productSub: 'Product Catalog · Fill in the details below',
    editProductSub: 'Modify catalog details below',
    barcodeOptional: 'Barcode (Optional)',
    minStockThreshold: 'Low Stock Threshold',
    uniqueRef: 'Unique Product Reference',
    productNameLabel: 'Product Name',
    installApp: 'Install App',
  },
  AR: {
    products: 'المنتجات',
    stockEntry: 'إدخال مخزون',
    stockExit: 'إخراج مخزون',
    history: 'سجل العمليات',
    settings: 'الإعدادات',
    more: 'المزيد',
    overviewSubtitle: 'إدارة الكتالوج ومتابعة حركة المخزون.',
    allProductsCount: 'جميع المنتجات',
    searchPlaceholder: 'بحث بالاسم أو المرجع...',
    stockAvailable: 'المخزون المتاح',
    addStockBtn: '+ إضافة مخزون',
    removeStockBtn: '- سحب مخزون',
    inStock: 'متوفر',
    lowStock: 'مخزون منخفض',
    outOfStock: 'نفذ المخزون',
    newProduct: 'منتج جديد',
    edit: 'تعديل',
    delete: 'حذف',
    cancel: 'إلغاء',
    saveProduct: 'حفظ المنتج',
    update: 'تحديث',
    userProfile: 'الملف الشخصي',
    changePassword: 'تغيير كلمة المرور',
    oldPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    logout: 'تسجيل الخروج',
    currencySetting: 'عملة العرض الرئيسية',
    noProductsFound: 'لم يتم العثور على أي منتج في الكتالوج.',
    accountRole: 'دور الحساب',
    securityStatus: 'حالة الأمان',
    adminRole: 'مسؤول (وصول كامل)',
    verifiedAccount: 'حساب موثق',
    unitPrice: 'سعر الوحدة',
    totalValue: 'قيمة المخزون',
    ref: 'المرجع',
    units: 'وحدات',
    unit: 'وحدة',
    actions: 'إجراءات سريعة',
    settingsSub: 'إدارة الملف الشخصي وأمان الحساب.',
    changePasswordSuccess: 'تم تغيير كلمة المرور بنجاح!',
    overview: 'نظرة عامة',
    defaultOrigin: 'بلد المنشأ الافتراضي',
    currentStock: 'المخزون الحالي',
    minThreshold: 'الحد الأدنى',
    status: 'الحالة',
    productAndRef: 'المنتج والمرجع',
    category: 'الفئة',
    filterLowStock: 'تصفية المخزون المنخفض',
    showAll: 'عرض الكل',
    searchTablePlaceholder: 'بحث بالاسم، المرجع، بلد المنشأ أو البارلود...',
    addStock: '+ إضافة مخزون',
    removeStock: '- سحب مخزون',
    stockEntryTitle: 'إدخال مخزون',
    stockEntrySub: 'إضافة وحدات للمخزون مع تتبع بلد المنشأ.',
    stockEntryForm: 'نموذج إدخال المخزون',
    selectProduct: 'اختر المنتج',
    incomingQty: 'الكمية المضافة (+ وحدات)',
    originCountry: 'بلد منشأ الدفعة',
    unitCost: 'سعر الشراء الفردي',
    noteOptional: 'ملاحظة / مرجع الفاتورة (اختياري)',
    submitEntry: 'حفظ إدخال المخزون',
    stockExitTitle: 'إخراج مخزون',
    stockExitSub: 'سحب وحدات من المخزون مع فحص تلقائي لتجاوز الكمية.',
    stockExitForm: 'نموذج إخراج المخزون',
    outgoingQty: 'الكمية المسحوبة (- وحدات)',
    sellingPrice: 'سعر البيع الفردي',
    noteCustomerOptional: 'ملاحظة / مرجع الطلب (اختياري)',
    submitExit: 'حفظ إخراج المخزون',
    historyTitle: 'سجل العمليات العام',
    historySub: 'تتبع كامل لعمليات الإدخال والإخراج وبلد المنشأ والمستخدمين.',
    timestamp: 'التاريخ والوقت',
    movRef: 'مرجع الحركة',
    type: 'النوع',
    quantity: 'الكمية',
    origin: 'بلد المنشأ',
    unitPriceCol: 'سعر الوحدة',
    operator: 'المستخدم',
    noteCol: 'ملاحظة',
    entryTag: 'إدخال',
    exitTag: 'إخراج',
    auditTrail: 'سجل التدقيق الكامل',
    manager: 'مشرف',
    createProductTitle: 'إضافة منتج جديد',
    editProductTitle: 'تعديل المنتج',
    productSub: 'كتالوج المنتجات · أدخل التفاصيل أدناه',
    editProductSub: 'تعديل بيانات المنتج أدناه',
    barcodeOptional: 'الرمز الشريط / الباركود (اختياري)',
    minStockThreshold: 'حد المخزون المنخفض',
    uniqueRef: 'مرجع المنتج الفريد',
    productNameLabel: 'اسم المنتج',
    installApp: 'تثبيت التطبيق',
  },
}

export function InventoryDashboard() {
  const { user, token, login, register, logout, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('Produits')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [lang, setLang] = useState<Language>('FR')
  const [currency, setCurrency] = useState<'TND' | 'EUR' | 'USD'>('TND')
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [dismissedInstallBanner, setDismissedInstallBanner] = useState(false)


  const t = (key: string) => DICTIONARY[lang]?.[key] || DICTIONARY['FR']?.[key] || key

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    } else {
      alert(
        lang === 'AR'
          ? 'التطبيق جاهز للتثبيت! يمكنك تثبيته مباشرة من القائمة العليا للمتصفح (Install App / Add to Home Screen).'
          : lang === 'EN'
          ? 'App is ready for installation! You can install it via browser menu (Install App / Add to Home Screen).'
          : "L'application est prête à être installée! Vous pouvez l'installer depuis le menu de votre navigateur (Installer l'application / Ajouter à l'écran d'accueil)."
      )
    }
  }

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language
    if (savedLang && ['FR', 'EN', 'AR'].includes(savedLang)) {
      setLang(savedLang)
    }

    const savedCurrency = localStorage.getItem('app_currency') as 'TND' | 'EUR' | 'USD'
    if (savedCurrency && ['TND', 'EUR', 'USD'].includes(savedCurrency)) {
      setCurrency(savedCurrency)
    }
  }, [])

  const handleLangChange = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('app_lang', newLang)
  }

  const handleCurrencyChange = (newCurr: 'TND' | 'EUR' | 'USD') => {
    setCurrency(newCurr)
    localStorage.setItem('app_currency', newCurr)
  }

  const formatPrice = (amount: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 TND'
    if (currency === 'EUR') {
      return `${(amount * 0.30).toFixed(2)} €`
    }
    if (currency === 'USD') {
      return `$${(amount * 0.33).toFixed(2)}`
    }
    return `${amount} TND`
  }

  // API State
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [successMsg])

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMsg])
  const [stats, setStats] = useState<any>(null)
  const [productsList, setProductsList] = useState<any[]>([])
  const [movementsList, setMovementsList] = useState<any[]>([])

  // Auth Form State (Login & Register)
  const [isSignUp, setIsSignUp] = useState(false)
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState('')

  // Modals
  const [showProductModal, setShowProductModal] = useState(false)
  const [showEntryModal, setShowEntryModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)

  // Product Form State (Blank by default)
  const [prodForm, setProdForm] = useState({
    reference: '',
    name: '',
    price: '',
    defaultOrigin: 'Tunisie',
    category: '',
    minimumStock: '',
    barcode: '',
  })

  // Entry Form State (Blank by default)
  const [entryForm, setEntryForm] = useState({
    productId: '',
    quantity: '',
    origin: 'Tunisie',
    unitPrice: '',
    note: '',
  })

  // Exit Form State (Blank by default)
  const [exitForm, setExitForm] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
    note: '',
  })

  // Change Password State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Veuillez remplir tous les champs.' })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' })
      return
    }

    try {
      setPasswordLoading(true)
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordMsg({ type: 'success', text: 'Mot de passe modifié avec succès!' })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Une erreur est survenue.' })
    } finally {
      setPasswordLoading(false)
    }
  }

  // Barcode Lookup Form
  const [scannedBarcode, setScannedBarcode] = useState('')
  const [scannedResult, setScannedResult] = useState<any>(null)

  // Edit & Delete Product State
  const [showEditModal, setShowEditModal] = useState(false)
  const [activeMenuProductId, setActiveMenuProductId] = useState<string | null>(null)
  const [editProdForm, setEditProdForm] = useState({
    id: '',
    reference: '',
    name: '',
    price: 0,
    defaultOrigin: '',
    category: '',
    minimumStock: 0,
    barcode: '',
  })

  const openEditModal = (p: any) => {
    const pId = p._id || p.id
    setEditProdForm({
      id: pId,
      reference: p.reference || '',
      name: p.name || '',
      price: p.price || 0,
      defaultOrigin: p.defaultOrigin || 'France',
      category: p.category || 'Général',
      minimumStock: p.minimumStock || 0,
      barcode: p.barcode || '',
    })
    setShowEditModal(true)
    setActiveMenuProductId(null)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await productApi.updateProduct(editProdForm.id, {
        reference: editProdForm.reference,
        name: editProdForm.name,
        price: Number(editProdForm.price),
        defaultOrigin: editProdForm.defaultOrigin,
        category: editProdForm.category,
        minimumStock: Number(editProdForm.minimumStock),
        barcode: editProdForm.barcode,
      })
      setSuccessMsg('Produit mis à jour avec succès!')
      setShowEditModal(false)
      loadData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la mise à jour du produit')
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) return
    setErrorMsg('')
    try {
      await productApi.deleteProduct(id)
      setSuccessMsg('Produit supprimé avec succès!')
      loadData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la suppression du produit')
    } finally {
      setActiveMenuProductId(null)
    }
  }

  // Load Data from Backend
  const loadData = async () => {
    if (!token) return
    setLoading(true)
    setErrorMsg('')
    try {
      const [statsRes, prodsRes, movsRes] = await Promise.all([
        dashboardApi.getStats(),
        productApi.getProducts({ limit: 50 }),
        stockApi.getAllMovements({ limit: 20 }),
      ])

      if (statsRes.data) setStats(statsRes.data)
      if (movsRes.data) setMovementsList(movsRes.data)

      if (prodsRes.data) {
        const prods = prodsRes.data
        setProductsList(prods)
        if (prods.length > 0) {
          const first = prods[0]
          const firstId = first._id || first.id
          setEntryForm((prev) => ({
            ...prev,
            productId: prev.productId || firstId,
            origin: first.defaultOrigin || 'France',
            unitPrice: first.price || 100,
          }))
          setExitForm((prev) => ({
            ...prev,
            productId: prev.productId || firstId,
            unitPrice: first.price || 100,
          }))
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors du chargement des données backend')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.defaultOrigin?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesLowStock = lowStockOnly ? p.quantity <= (p.minimumStock || 0) : true
      return matchesSearch && matchesLowStock
    })
  }, [productsList, searchQuery, lowStockOnly])

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    try {
      await login({ email: authEmail, password: authPassword })
    } catch (err: any) {
      setAuthError(err.message || 'Échec de connexion au serveur backend')
    }
  }

  // Handle Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    try {
      await register({ name: authName, email: authEmail, password: authPassword, role: 'admin' })
    } catch (err: any) {
      setAuthError(err.message || 'Échec de la création du compte')
    }
  }

  // Handle Product Creation
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await productApi.createProduct({
        reference: prodForm.reference,
        name: prodForm.name,
        price: Number(prodForm.price),
        defaultOrigin: prodForm.defaultOrigin,
        category: prodForm.category,
        minimumStock: Number(prodForm.minimumStock),
        barcode: prodForm.barcode,
      })
      setSuccessMsg('Produit créé avec succès!')
      setShowProductModal(false)
      setProdForm({
        reference: '',
        name: '',
        price: '',
        defaultOrigin: 'Tunisie',
        category: '',
        minimumStock: '',
        barcode: '',
      })
      loadData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création du produit')
    }
  }

  // Handle Stock Entry Submission
  const handleRecordEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    try {
      await stockApi.recordEntry({
        productId: entryForm.productId,
        quantity: Number(entryForm.quantity),
        origin: entryForm.origin,
        unitPrice: Number(entryForm.unitPrice),
        note: entryForm.note,
      })
      setSuccessMsg('Entrée de stock enregistrée avec succès!')
      setShowEntryModal(false)
      setEntryForm({
        productId: '',
        quantity: '',
        origin: 'Tunisie',
        unitPrice: '',
        note: '',
      })
      loadData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l’entrée de stock')
    }
  }

  // Handle Stock Exit Submission
  const handleRecordExit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    const targetProd = productsList.find((p) => (p._id || p.id) === exitForm.productId)
    if (targetProd && Number(exitForm.quantity) > targetProd.quantity) {
      setErrorMsg(`Stock insuffisant! Stock disponible: ${targetProd.quantity} unités.`)
      return
    }

    try {
      await stockApi.recordExit({
        productId: exitForm.productId,
        quantity: Number(exitForm.quantity),
        unitPrice: Number(exitForm.unitPrice),
        note: exitForm.note,
      })
      setSuccessMsg('Sortie de stock enregistrée avec succès!')
      setShowExitModal(false)
      setExitForm({
        productId: '',
        quantity: '',
        unitPrice: '',
        note: '',
      })
      loadData()
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la sortie de stock')
    }
  }

  // Handle Barcode Scan
  const handleBarcodeLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setScannedResult(null)
    try {
      const res = await productApi.getByBarcode(scannedBarcode)
      if (res.data?.product) {
        setScannedResult(res.data.product)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Code-barres non trouvé')
    }
  }

  const navItems = [
    { id: 'Produits', label: t('products'), icon: Package, count: `${productsList.length}` },
    { id: 'Entrée de stock', label: t('stockEntry'), icon: ArrowDownLeft },
    { id: 'Sortie de stock', label: t('stockExit'), icon: ArrowUpRight },
    { id: 'Historique', label: t('history'), icon: BarChart3 },
    { id: 'Paramètres', label: t('settings'), icon: Settings },
  ]

  // Render Auth Screen if not logged in
  if (!user && !authLoading) {
    return (
      <main className="inventory-app" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            background: '#fff',
            padding: '36px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid #e8eaf1',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div
              className="brand-mark"
              style={{ margin: '0 auto 14px', width: '48px', height: '48px' }}
            >
              <Boxes style={{ width: '26px', height: '26px' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Stockly</h2>
            <p style={{ color: '#8c92a2', fontSize: '12px', marginTop: '6px' }}>
              Système de Gestion de Produits & Mouvements de Stock
            </p>
          </div>

          {/* Toggle Tabs: Login vs Register */}
          <div
            style={{
              display: 'flex',
              background: '#f5f6fa',
              borderRadius: '8px',
              padding: '4px',
              marginBottom: '20px',
            }}
          >
            <button
              onClick={() => { setIsSignUp(false); setAuthError(''); setAuthEmail(''); setAuthPassword(''); setAuthName(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 0,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                background: !isSignUp ? '#fff' : 'transparent',
                color: !isSignUp ? '#6256eb' : '#8c92a2',
                boxShadow: !isSignUp ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Connexion (Login)
            </button>
            <button
              onClick={() => { setIsSignUp(true); setAuthError(''); setAuthEmail(''); setAuthPassword(''); setAuthName(''); }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 0,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                background: isSignUp ? '#fff' : 'transparent',
                color: isSignUp ? '#6256eb' : '#8c92a2',
                boxShadow: isSignUp ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              Créer un compte (Sign Up)
            </button>
          </div>

          {authError && (
            <div
              style={{
                background: '#fff0f1',
                color: '#e15e72',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                marginBottom: '16px',
              }}
            >
              {authError}
            </div>
          )}

          {!isSignUp ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#454b5a', marginBottom: '6px' }}>
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  placeholder="votre.email@domaine.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e9eaf0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#454b5a', marginBottom: '6px' }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e9eaf0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <Button type="submit" className="primary-button" style={{ height: '42px', marginTop: '6px', fontSize: '13px' }}>
                Se connecter
              </Button>
            </form>
          ) : (
            /* SIGN UP / REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#454b5a', marginBottom: '6px' }}>
                  Nom Complet
                </label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  required
                  placeholder="ex: Amine Ben Salah"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e9eaf0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#454b5a', marginBottom: '6px' }}>
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  required
                  placeholder="votre.email@domaine.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e9eaf0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#454b5a', marginBottom: '6px' }}>
                  Mot de passe (Min 6 caractères)
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e9eaf0',
                    fontSize: '13px',
                  }}
                />
              </div>

              <Button type="submit" className="primary-button" style={{ height: '42px', marginTop: '6px', fontSize: '13px' }}>
                Créer mon compte Admin
              </Button>
            </form>
          )}

        </div>
      </main>
    )
  }

  return (
    <main className={`inventory-app ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* Floating Toast Notification Overlay (Top Centered) */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          alignItems: 'center',
          pointerEvents: 'none',
          width: '90%',
          maxWidth: '480px',
        }}
      >
        {errorMsg && (
          <div
            style={{
              pointerEvents: 'auto',
              width: '100%',
              background: isDarkMode ? '#2d1419' : '#fff0f1',
              color: isDarkMode ? '#ff7b8c' : '#e15e72',
              border: '1px solid rgba(225, 94, 114, 0.3)',
              padding: '12px 18px',
              borderRadius: '14px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
            <X style={{ cursor: 'pointer', width: '16px', height: '16px', opacity: 0.8 }} onClick={() => setErrorMsg('')} />
          </div>
        )}

        {successMsg && (
          <div
            style={{
              pointerEvents: 'auto',
              width: '100%',
              background: isDarkMode ? '#102e23' : '#e6faf3',
              color: isDarkMode ? '#34d399' : '#0fa875',
              border: '1px solid rgba(15, 168, 117, 0.3)',
              padding: '12px 18px',
              borderRadius: '14px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              fontWeight: 600,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✅</span>
              <span>{successMsg}</span>
            </div>
            <X style={{ cursor: 'pointer', width: '16px', height: '16px', opacity: 0.8 }} onClick={() => setSuccessMsg('')} />
          </div>
        )}
      </div>
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Boxes />
          </div>
          <div>
            <strong>Stockly</strong>
            <span>Gestion d’inventaire</span>
          </div>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Fermer le menu">
            <X />
          </button>
        </div>
        <nav className="nav-list" aria-label="Navigation principale">
          <div className="nav-label">{t('overview')}</div>
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              className={`nav-item ${activeTab === id ? 'nav-active' : ''}`}
              onClick={() => {
                setActiveTab(id)
                setMenuOpen(false)
              }}
            >
              <Icon /> <span>{label}</span>
              {count && <small>{count}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">{user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}</div>
            <div>
              <strong>{user?.name || (user?.role === 'admin' ? t('adminRole') : t('manager'))}</strong>
              <span>{user?.role === 'admin' ? t('adminRole') : t('manager')}</span>
            </div>
            <button onClick={logout} title={t('logout')} style={{ border: 0, background: 'none', cursor: 'pointer' }}>
              <LogOut style={{ width: '16px', color: '#e15e72' }} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="main-content" dir={lang === 'AR' ? 'rtl' : 'ltr'}>
        <header className="topbar">
          <div className="mobile-brand-header">
            <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
              <Menu style={{ width: '20px', height: '20px' }} />
            </button>
            <div className="mobile-brand-text">
              <strong>Stockly</strong>
            </div>
          </div>

          <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* PWA Install Button */}
            {/* Currency Switcher Pill */}
            <button
              type="button"
              className="clean-icon-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => handleCurrencyChange(currency === 'TND' ? 'EUR' : currency === 'EUR' ? 'USD' : 'TND')}
              title={`Devise: ${currency} (Cliquer pour basculer)`}
            >
              <span>💰</span>
              <span>{currency}</span>
            </button>

            {/* 3-Language Switcher Pill Button (FR / EN / AR) */}
            <button
              type="button"
              className="clean-icon-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              onClick={() => handleLangChange(lang === 'FR' ? 'EN' : lang === 'EN' ? 'AR' : 'FR')}
              title={`Langue: ${lang} (Cliquer pour basculer FR / EN / AR)`}
            >
              <Languages style={{ width: '15px', height: '15px' }} />
              <span>{lang}</span>
            </button>

            {/* Minimal Light / Dark Theme Switcher Icon */}
            <button
              type="button"
              className="clean-icon-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Passer en Mode Clair' : 'Passer en Mode Sombre'}
            >
              {isDarkMode ? (
                <Sun style={{ width: '20px', height: '20px' }} />
              ) : (
                <Moon style={{ width: '20px', height: '20px' }} />
              )}
            </button>

            {/* Circular Avatar Ring */}
            <div
              className="top-user-avatar-circle"
              title={user?.name || t('userProfile')}
            >
              {user?.name ? user.name.substring(0, 1).toLowerCase() : 'k'}
            </div>
          </div>
        </header>

        <div className="content-scroll">

          {/* TAB 2: PRODUITS VIEW */}
          {activeTab === 'Produits' && (
            <>
              <div className="page-heading">
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('products')}</h1>
                </div>
              </div>

              {/* Floating Action Button (FAB) at Bottom Right */}
              <button
                className="floating-add-btn"
                onClick={() => setShowProductModal(true)}
                title={t('newProduct')}
                aria-label={t('newProduct')}
              >
                <Plus style={{ width: '26px', height: '26px' }} />
              </button>

              {/* Mobile Search & Filter */}
              <div className="mobile-search-filter-row">
                <div className="mobile-search-input">
                  <Search />
                  <input
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Mobile Section Counter */}
              <div className="mobile-section-counter">
                {t('allProductsCount')} ({filteredProducts.length})
              </div>

              {/* Enterprise Product Cards List View */}
              <div className="mobile-card-list">
                {filteredProducts.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '36px 20px',
                      color: '#64748b',
                      background: '#fff',
                      borderRadius: '14px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    {t('noProductsFound')}
                  </div>
                ) : (
                  filteredProducts.map((p) => {
                    const isStockEmpty = p.quantity === 0
                    const isLowStock = p.quantity <= (p.minimumStock || 0)

                    return (
                      <div key={p._id || p.id} className="enterprise-card">
                        <div className="card-header-row">
                          <div>
                            <h3 className="card-product-title">{p.name}</h3>
                            <div className="card-product-meta">
                              {t('ref')}: <strong>{p.reference || 'PRD-001'}</strong> · {formatPrice(p.price)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                            <span
                              className={`badge-status ${
                                isStockEmpty ? 'badge-status-red' : isLowStock ? 'badge-status-orange' : 'badge-status-green'
                              }`}
                            >
                              ● {isStockEmpty ? t('outOfStock') : isLowStock ? t('lowStock') : t('inStock')}
                            </span>
                            <button
                              type="button"
                              className="clean-icon-btn"
                              style={{ width: '30px', height: '30px', padding: 0 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                const pId = p._id || p.id
                                setActiveMenuProductId(activeMenuProductId === pId ? null : pId)
                              }}
                              title="Options"
                            >
                              <MoreVertical style={{ width: '16px', height: '16px' }} />
                            </button>

                            {activeMenuProductId === (p._id || p.id) && (
                              <div className="card-popover-menu">
                                <button
                                  type="button"
                                  className="card-popover-item"
                                  onClick={() => openEditModal(p)}
                                >
                                  <Pencil style={{ width: '14px', height: '14px', color: '#6256eb' }} />
                                  <span>{t('edit')}</span>
                                </button>
                                <button
                                  type="button"
                                  className="card-popover-item danger"
                                  onClick={() => handleDeleteProduct(p._id || p.id, p.name)}
                                >
                                  <Trash2 style={{ width: '14px', height: '14px', color: '#e15e72' }} />
                                  <span>{t('delete')}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="card-stock-row">
                          <span className="stock-label">{t('stockAvailable')}</span>
                          <strong className="stock-count">{p.quantity} {p.quantity <= 1 ? t('unit') : t('units')}</strong>
                        </div>

                        <div className="card-action-grid">
                          <button
                            className="btn-entry-subtle"
                            onClick={() => {
                              setEntryForm((prev) => ({
                                ...prev,
                                productId: p._id || p.id,
                                origin: p.defaultOrigin || 'France',
                                unitPrice: p.price,
                              }))
                              setShowEntryModal(true)
                            }}
                          >
                            <ArrowDownLeft style={{ width: '16px', height: '16px' }} />
                            <span>{t('addStockBtn')}</span>
                          </button>

                          <button
                            className="btn-exit-subtle"
                            onClick={() => {
                              setExitForm((prev) => ({
                                ...prev,
                                productId: p._id || p.id,
                                unitPrice: p.price,
                              }))
                              setShowExitModal(true)
                            }}
                          >
                            <ArrowUpRight style={{ width: '16px', height: '16px' }} />
                            <span>{t('removeStockBtn')}</span>
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Desktop Table View */}
              <article className="panel stock-panel desktop-table-container">

                <div className="table-toolbar">
                  <div className="search-box">
                    <Search />
                    <input
                      placeholder={t('searchTablePlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="filter-button" onClick={() => setLowStockOnly(!lowStockOnly)}>
                    <Filter /> {lowStockOnly ? t('showAll') : t('filterLowStock')}
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('productAndRef')}</th>
                        <th>{t('category')}</th>
                        <th>{t('defaultOrigin')}</th>
                        <th>{t('currentStock')}</th>
                        <th>{t('minThreshold')}</th>
                        <th>{t('unitPrice')}</th>
                        <th>{t('status')}</th>
                        <th>{t('totalValue')}</th>
                        <th>{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: '#9da2b0' }}>
                            {t('noProductsFound')}
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((p) => {
                          const stockVal = p.quantity * p.price
                          return (
                            <tr key={p._id || p.id}>
                              <td>
                                <div className="product-thumb purple">
                                  <Package />
                                </div>
                                <div className="product-name">
                                  <strong>{p.name}</strong>
                                  <span>{p.reference} {p.barcode ? `· ${p.barcode}` : ''}</span>
                                </div>
                              </td>
                              <td>
                                <span className="category-pill">{p.category || 'Général'}</span>
                              </td>
                              <td>
                                <span className="origin">
                                  <span>{(p.defaultOrigin || 'TN').substring(0, 2).toUpperCase()}</span>
                                  {p.defaultOrigin || 'France'}
                                </span>
                              </td>
                              <td>
                                <strong className={p.quantity === 0 ? 'danger-text' : p.quantity <= (p.minimumStock || 0) ? 'warning-text' : ''}>
                                  {p.quantity} <small>{p.quantity <= 1 ? t('unit') : t('units')}</small>
                                </strong>
                              </td>
                              <td>{p.minimumStock || 0}</td>
                              <td>{formatPrice(p.price)}</td>
                              <td>
                                <StatusBadge stock={p.quantity} threshold={p.minimumStock || 0} lang={lang} />
                              </td>
                              <td className="value-cell">{formatPrice(stockVal)}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <button
                                    className="filter-button"
                                    style={{ padding: '5px 9px', fontSize: '10px', color: '#0fa875', borderColor: '#bdf2e1' }}
                                    onClick={() => {
                                      setEntryForm((prev) => ({
                                        ...prev,
                                        productId: p._id || p.id,
                                        origin: p.defaultOrigin || 'France',
                                        unitPrice: p.price,
                                      }))
                                      setShowEntryModal(true)
                                    }}
                                  >
                                    {t('addStock')}
                                  </button>
                                  <button
                                    className="filter-button"
                                    style={{ padding: '5px 9px', fontSize: '10px', color: '#e15e72', borderColor: '#fcd3d8' }}
                                    onClick={() => {
                                      setExitForm((prev) => ({
                                        ...prev,
                                        productId: p._id || p.id,
                                        unitPrice: p.price,
                                      }))
                                      setShowExitModal(true)
                                    }}
                                  >
                                    {t('removeStock')}
                                  </button>
                                  <button
                                    type="button"
                                    className="clean-icon-btn"
                                    style={{ width: '28px', height: '28px', padding: 0 }}
                                    onClick={() => openEditModal(p)}
                                    title={t('edit')}
                                  >
                                    <Pencil style={{ width: '14px', height: '14px', color: '#6256eb' }} />
                                  </button>
                                  <button
                                    type="button"
                                    className="clean-icon-btn"
                                    style={{ width: '28px', height: '28px', padding: 0 }}
                                    onClick={() => handleDeleteProduct(p._id || p.id, p.name)}
                                    title={t('delete')}
                                  >
                                    <Trash2 style={{ width: '14px', height: '14px', color: '#e15e72' }} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </article>
            </>
          )}

          {/* TAB 3: ENTRÉE DE STOCK VIEW */}
          {activeTab === 'Entrée de stock' && (
            <>
              <div className="page-heading">
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('stockEntryTitle')}</h1>
                  <p className="heading-sub">{t('stockEntrySub')}</p>
                </div>
              </div>

              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <article className="panel stock-panel" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f766e' }}>
                    {t('stockEntryForm')}
                  </h3>

                  <form onSubmit={handleRecordEntry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('selectProduct')}
                      </label>
                      <ProductSelect
                        products={productsList}
                        value={entryForm.productId}
                        onChange={(pId, p) =>
                          setEntryForm({
                            ...entryForm,
                            productId: pId,
                            unitPrice: p?.price ?? entryForm.unitPrice,
                            origin: p?.defaultOrigin ?? entryForm.origin,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('incomingQty')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={entryForm.quantity}
                        onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })}
                        required
                        placeholder="0"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('originCountry')}
                      </label>
                      <CountrySelect
                        value={entryForm.origin}
                        onChange={(val) => setEntryForm({ ...entryForm, origin: val })}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('unitCost')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={entryForm.unitPrice}
                        onChange={(e) => setEntryForm({ ...entryForm, unitPrice: e.target.value })}
                        required
                        placeholder="0.00"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('noteOptional')}
                      </label>
                      <input
                        type="text"
                        value={entryForm.note}
                        onChange={(e) => setEntryForm({ ...entryForm, note: e.target.value })}
                        placeholder="Livraison N°104"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <Button type="submit" className="primary-button" style={{ height: '42px', marginTop: '10px', background: '#0f766e' }}>
                      {t('submitEntry')}
                    </Button>
                  </form>
                </article>
              </div>
            </>
          )}

          {/* TAB 4: SORTIE DE STOCK VIEW */}
          {activeTab === 'Sortie de stock' && (
            <>
              <div className="page-heading">
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('stockExitTitle')}</h1>
                  <p className="heading-sub">{t('stockExitSub')}</p>
                </div>
              </div>

              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <article className="panel stock-panel" style={{ padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#9f1239' }}>
                    {t('stockExitForm')}
                  </h3>

                  <form onSubmit={handleRecordExit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('selectProduct')}
                      </label>
                      <ProductSelect
                        products={productsList}
                        value={exitForm.productId}
                        onChange={(pId, p) =>
                          setExitForm({
                            ...exitForm,
                            productId: pId,
                            unitPrice: p?.price ?? exitForm.unitPrice,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('outgoingQty')}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exitForm.quantity}
                        onChange={(e) => setExitForm({ ...exitForm, quantity: e.target.value })}
                        required
                        placeholder="0"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('sellingPrice')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={exitForm.unitPrice}
                        onChange={(e) => setExitForm({ ...exitForm, unitPrice: e.target.value })}
                        required
                        placeholder="0.00"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
                        {t('noteCustomerOptional')}
                      </label>
                      <input
                        type="text"
                        value={exitForm.note}
                        onChange={(e) => setExitForm({ ...exitForm, note: e.target.value })}
                        placeholder="Vente comptoir / Commande client"
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <Button type="submit" className="primary-button" style={{ height: '42px', marginTop: '10px', background: '#9f1239' }}>
                      {t('submitExit')}
                    </Button>
                  </form>
                </article>
              </div>
            </>
          )}

          {/* TAB 5: HISTORIQUE VIEW */}
          {activeTab === 'Historique' && (
            <>
              <div className="page-heading">
                <div>
                  <p className="eyebrow">{t('auditTrail')}</p>
                  <h1>{t('historyTitle')} ({movementsList.length})</h1>
                  <p className="heading-sub">{t('historySub')}</p>
                </div>
              </div>

              <article className="panel stock-panel" style={{ padding: '24px' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('timestamp')}</th>
                        <th>{t('movRef')}</th>
                        <th>{t('type')}</th>
                        <th>{t('productAndRef')}</th>
                        <th>{t('quantity')}</th>
                        <th>{t('origin')}</th>
                        <th>{t('unitPriceCol')}</th>
                        <th>{t('totalValue')}</th>
                        <th>{t('operator')}</th>
                        <th>{t('noteCol')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movementsList.map((m) => (
                        <tr key={m._id || m.id}>
                          <td style={{ fontSize: '9px', color: '#9da2b0' }}>
                            {new Date(m.createdAt).toLocaleString('fr-FR')}
                          </td>
                          <td style={{ fontSize: '9px', fontWeight: 600 }}>{m.reference || 'MOV-AUDIT'}</td>
                          <td>
                            <span className={`movement-tag ${m.type === 'ENTRY' ? 'entry-tag' : 'exit-tag'}`} style={{ fontWeight: 700 }}>
                              {m.type === 'ENTRY' ? t('entryTag') : t('exitTag')}
                            </span>
                          </td>
                          <td>
                            <strong>{m.product?.name || 'Produit'}</strong>
                            <span style={{ display: 'block', fontSize: '9px', color: '#9da2b0' }}>
                              {m.product?.reference}
                            </span>
                          </td>
                          <td>
                            <strong className={m.type === 'ENTRY' ? 'positive' : 'negative'}>
                              {m.type === 'ENTRY' ? `+${m.quantity}` : `-${m.quantity}`}
                            </strong>
                          </td>
                          <td>
                            <span className="origin">
                              <span>{(m.origin || 'TN').substring(0, 2).toUpperCase()}</span>
                              {m.origin || 'France'}
                            </span>
                          </td>
                          <td>{formatPrice(m.unitPrice)}</td>
                          <td><strong>{formatPrice(m.totalValue)}</strong></td>
                          <td>{m.createdBy?.name || 'Système'}</td>
                          <td style={{ color: '#8c92a2', fontStyle: 'italic' }}>{m.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </>
          )}

          {/* TAB 6: PARAMÈTRES / SETTINGS VIEW */}
          {activeTab === 'Paramètres' && (
            <>
              <div className="page-heading">
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('settings')}</h1>
                  <p className="heading-sub" style={{ fontSize: '13px', color: '#64748b' }}>
                    {t('settingsSub')}
                  </p>
                </div>
              </div>

              <div className="form-grid-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Profile Card */}
                <article className="panel stock-panel" style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {t('userProfile')}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #6256eb 0%, #4f46e5 100%)',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '18px',
                        fontWeight: 800,
                        boxShadow: '0 4px 12px rgba(98, 86, 235, 0.3)',
                      }}
                    >
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '16px', display: 'block', color: '#0f172a' }}>{user?.name || (user?.role === 'admin' ? t('adminRole') : t('manager'))}</strong>
                      <span style={{ fontSize: '13px', color: '#64748b' }}>{user?.email || 'admin@example.com'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#475569' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span>{t('accountRole')}</span>
                      <strong style={{ color: '#6256eb' }}>{user?.role === 'admin' ? t('adminRole') : t('manager')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span>{t('securityStatus')}</span>
                      <strong style={{ color: '#10b981' }}>● {t('verifiedAccount')}</strong>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <label className="field-label" style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>
                      {t('currencySetting')}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { code: 'TND', label: '🇹🇳 TND' },
                        { code: 'EUR', label: '🇪🇺 EUR (€)' },
                        { code: 'USD', label: '🇺🇸 USD ($)' },
                      ].map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleCurrencyChange(item.code as any)}
                          style={{
                            padding: '8px 4px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: currency === item.code ? '2px solid #6256eb' : '1px solid #cbd5e1',
                            background: currency === item.code ? 'rgba(98, 86, 235, 0.15)' : 'transparent',
                            color: currency === item.code ? '#818cf8' : 'inherit',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={logout}
                    variant="outline"
                    style={{ marginTop: '20px', width: '100%', height: '42px', color: '#9f1239', borderColor: '#fecdd3', fontSize: '13px', fontWeight: 600 }}
                  >
                    <LogOut style={{ width: '16px', marginRight: '6px' }} /> {t('logout')}
                  </Button>
                </article>

                {/* Change Password Card */}
                <article className="panel stock-panel" style={{ padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {t('changePassword')}
                  </h3>

                  {passwordMsg.text && (
                    <div
                      style={{
                        padding: '12px 14px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: passwordMsg.type === 'error' ? '#fff1f2' : '#f0fdf4',
                        color: passwordMsg.type === 'error' ? '#9f1239' : '#0f766e',
                        border: passwordMsg.type === 'error' ? '1px solid #fecdd3' : '1px solid #bbf7d0',
                      }}
                    >
                      {passwordMsg.text}
                    </div>
                  )}

                  <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label className="field-label" style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '13px' }}>
                        {t('oldPassword')} *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '13px' }}>
                        {t('newPassword')} *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label className="field-label" style={{ display: 'block', fontWeight: 600, color: '#0f172a', marginBottom: '6px', fontSize: '13px' }}>
                        {t('confirmPassword')} *
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        style={{ width: '100%', height: '42px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      className="primary-button"
                      style={{ marginTop: '6px', height: '42px', fontSize: '13px', fontWeight: 600 }}
                    >
                      {passwordLoading ? '...' : t('changePassword')}
                    </Button>
                  </form>
                </article>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CREATE PRODUCT 80% HEIGHT BOTTOM SHEET */}
      {showProductModal && (
        <div className="slide-up-backdrop" onClick={() => setShowProductModal(false)}>
          <div className="slide-up-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-up-drag-handle" />
            <div className="slide-up-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  {t('createProductTitle')}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {t('productSub')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="slide-up-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('uniqueRef')} *
                    </label>
                    <input
                      type="text"
                      value={prodForm.reference}
                      onChange={(e) => setProdForm({ ...prodForm, reference: e.target.value })}
                      required
                      placeholder="ex: PRD-001"
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('productNameLabel')} *
                    </label>
                    <input
                      type="text"
                      value={prodForm.name}
                      onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                      required
                      placeholder="ex: Chaise de bureau Ergonomique"
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {t('unitPrice')} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={prodForm.price}
                        onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                        required
                        placeholder="0.00"
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {t('minStockThreshold')}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={prodForm.minimumStock}
                        onChange={(e) => setProdForm({ ...prodForm, minimumStock: e.target.value })}
                        placeholder="0"
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {t('defaultOrigin')}
                      </label>
                      <CountrySelect
                        value={prodForm.defaultOrigin}
                        onChange={(val) => setProdForm({ ...prodForm, defaultOrigin: val })}
                        style={{ height: '46px', fontSize: '14px', borderRadius: '10px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                        {t('category')}
                      </label>
                      <input
                        type="text"
                        value={prodForm.category}
                        onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                        placeholder="Furniture, Électronique..."
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 500,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('barcodeOptional')}
                    </label>
                    <input
                      type="text"
                      value={prodForm.barcode}
                      onChange={(e) => setProdForm({ ...prodForm, barcode: e.target.value })}
                      placeholder="ex: 6191234567890"
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="slide-up-footer">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setShowProductModal(false)}
                >
                  {t('cancel')}
                </button>
                <Button
                  className="primary-button"
                  type="submit"
                  style={{ height: '48px', padding: '0 28px', fontSize: '14px', fontWeight: 800, borderRadius: '10px', background: '#6256eb' }}
                >
                  {t('saveProduct')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT 80% HEIGHT BOTTOM SHEET */}
      {showEditModal && (
        <div className="slide-up-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="slide-up-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-up-drag-handle" />
            <div className="slide-up-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  ✏️ {t('editProductTitle')}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {t('editProductSub')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="slide-up-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      {t('uniqueRef')} *
                    </label>
                    <input
                      type="text"
                      value={editProdForm.reference}
                      onChange={(e) => setEditProdForm({ ...editProdForm, reference: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      {t('productNameLabel')} *
                    </label>
                    <input
                      type="text"
                      value={editProdForm.name}
                      onChange={(e) => setEditProdForm({ ...editProdForm, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        {t('unitPrice')} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editProdForm.price}
                        onChange={(e) => setEditProdForm({ ...editProdForm, price: Number(e.target.value) })}
                        required
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        {t('minStockThreshold')} *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editProdForm.minimumStock}
                        onChange={(e) => setEditProdForm({ ...editProdForm, minimumStock: Number(e.target.value) })}
                        required
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        {t('defaultOrigin')}
                      </label>
                      <CountrySelect
                        value={editProdForm.defaultOrigin}
                        onChange={(val) => setEditProdForm({ ...editProdForm, defaultOrigin: val })}
                        style={{ height: '46px', fontSize: '14px', borderRadius: '10px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                        {t('category')}
                      </label>
                      <input
                        type="text"
                        value={editProdForm.category}
                        onChange={(e) => setEditProdForm({ ...editProdForm, category: e.target.value })}
                        style={{
                          width: '100%',
                          height: '46px',
                          padding: '0 14px',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      {t('barcodeOptional')}
                    </label>
                    <input
                      type="text"
                      value={editProdForm.barcode}
                      onChange={(e) => setEditProdForm({ ...editProdForm, barcode: e.target.value })}
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 600,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="slide-up-footer">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setShowEditModal(false)}
                >
                  {t('cancel')}
                </button>
                <Button
                  className="primary-button"
                  type="submit"
                  style={{ height: '48px', padding: '0 28px', fontSize: '14px', fontWeight: 800, borderRadius: '10px', background: '#6256eb' }}
                >
                  {t('update')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK ENTRY 80% BOTTOM SHEET */}
      {showEntryModal && (
        <div className="slide-up-backdrop" onClick={() => setShowEntryModal(false)}>
          <div className="slide-up-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-up-drag-handle" />
            <div className="slide-up-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f766e' }}>
                  + {t('stockEntryTitle').toUpperCase()}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {t('stockEntrySub')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEntryModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleRecordEntry} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="slide-up-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('selectProduct')} *
                    </label>
                    <ProductSelect
                      products={productsList}
                      value={entryForm.productId}
                      onChange={(pId, p) =>
                        setEntryForm({
                          ...entryForm,
                          productId: pId,
                          unitPrice: p?.price ?? entryForm.unitPrice,
                          origin: p?.defaultOrigin ?? entryForm.origin,
                        })
                      }
                      style={{ height: '46px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('incomingQty')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={entryForm.quantity}
                      onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '16px',
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('originCountry')} *
                    </label>
                    <CountrySelect
                      value={entryForm.origin}
                      onChange={(val) => setEntryForm({ ...entryForm, origin: val })}
                      style={{ height: '46px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="slide-up-footer">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setShowEntryModal(false)}
                >
                  {t('cancel')}
                </button>
                <Button
                  type="submit"
                  style={{ height: '48px', padding: '0 28px', fontSize: '14px', fontWeight: 800, borderRadius: '10px', background: '#0f766e', color: '#fff' }}
                >
                  {t('submitEntry')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STOCK EXIT 80% BOTTOM SHEET */}
      {showExitModal && (
        <div className="slide-up-backdrop" onClick={() => setShowExitModal(false)}>
          <div className="slide-up-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-up-drag-handle" />
            <div className="slide-up-header">
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#9f1239' }}>
                  - {t('stockExitTitle').toUpperCase()}
                </h2>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {t('stockExitSub')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowExitModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <form onSubmit={handleRecordExit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div className="slide-up-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('selectProduct')} *
                    </label>
                    <ProductSelect
                      products={productsList}
                      value={exitForm.productId}
                      onChange={(pId, p) =>
                        setExitForm({
                          ...exitForm,
                          productId: pId,
                          unitPrice: p?.price ?? exitForm.unitPrice,
                        })
                      }
                      style={{ height: '46px', fontSize: '14px', borderRadius: '10px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                      {t('outgoingQty')} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={exitForm.quantity}
                      onChange={(e) => setExitForm({ ...exitForm, quantity: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        height: '46px',
                        padding: '0 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '16px',
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="slide-up-footer">
                <button
                  type="button"
                  className="btn-cancel-modal"
                  onClick={() => setShowExitModal(false)}
                >
                  {t('cancel')}
                </button>
                <Button
                  type="submit"
                  style={{ height: '48px', padding: '0 28px', fontSize: '14px', fontWeight: 800, borderRadius: '10px', background: '#9f1239', color: '#fff' }}
                >
                  {t('submitExit')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BARCODE LOOKUP MODAL */}
      {showBarcodeModal && (
        <div className="modal-backdrop">
          <div className="modal-content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Scan & Recherche Code-Barres</h3>
              <X style={{ cursor: 'pointer', width: '18px' }} onClick={() => setShowBarcodeModal(false)} />
            </div>

            <form onSubmit={handleBarcodeLookup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: '#454b5a', marginBottom: '4px' }}>
                  Entrer ou Scanner un Code-Barres
                </label>
                <input
                  type="text"
                  value={scannedBarcode}
                  onChange={(e) => setScannedBarcode(e.target.value)}
                  placeholder="ex: 6191234567890"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e9eaf0', fontSize: '13px' }}
                />
              </div>

              <Button className="primary-button" type="submit">
                Rechercher dans l'API
              </Button>
            </form>

            {scannedResult && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '14px',
                  borderRadius: '8px',
                  background: '#f7f6ff',
                  border: '1px solid #e3dfff',
                }}
              >
                <strong style={{ fontSize: '14px', display: 'block', color: '#6256eb' }}>
                  {scannedResult.name} ({scannedResult.reference})
                </strong>
                <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#454b5a' }}>
                  Stock Disponible: <strong>{scannedResult.quantity} unités</strong> · Prix: {scannedResult.price} DT
                </p>
                <span style={{ fontSize: '10px', color: '#8c92a2', display: 'block', marginTop: '4px' }}>
                  Origine: {scannedResult.defaultOrigin || 'France'} · Catégorie: {scannedResult.category}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popover menu for Plus (Historique & Paramètres) */}
      {showMoreMenu && (
        <div className="more-popover-menu">
          <button
            className={`more-menu-item ${activeTab === 'Historique' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Historique')
              setShowMoreMenu(false)
            }}
          >
            <BarChart3 style={{ width: '18px', height: '18px' }} />
            <span>{t('history')}</span>
          </button>
          <button
            className={`more-menu-item ${activeTab === 'Paramètres' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('Paramètres')
              setShowMoreMenu(false)
            }}
          >
            <Settings style={{ width: '18px', height: '18px' }} />
            <span>{t('settings')}</span>
          </button>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === 'Produits' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Produits')
            setShowMoreMenu(false)
          }}
        >
          <Package style={{ width: '22px', height: '22px' }} />
          <span>{t('products')}</span>
          {activeTab === 'Produits' && <div className="bottom-nav-indicator" />}
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'Entrée de stock' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Entrée de stock')
            setShowMoreMenu(false)
          }}
        >
          <ArrowDownLeft style={{ width: '22px', height: '22px' }} />
          <span>{t('stockEntry')}</span>
          {activeTab === 'Entrée de stock' && <div className="bottom-nav-indicator" />}
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'Sortie de stock' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('Sortie de stock')
            setShowMoreMenu(false)
          }}
        >
          <ArrowUpRight style={{ width: '22px', height: '22px' }} />
          <span>{t('stockExit')}</span>
          {activeTab === 'Sortie de stock' && <div className="bottom-nav-indicator" />}
        </button>

        <button
          className={`bottom-nav-item ${activeTab === 'Historique' || activeTab === 'Paramètres' ? 'active' : ''}`}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        >
          <MoreHorizontal style={{ width: '22px', height: '22px' }} />
          <span>{t('more')}</span>
          {(activeTab === 'Historique' || activeTab === 'Paramètres') && <div className="bottom-nav-indicator" />}
        </button>
      {/* Floating PWA Install Notification Banner */}
      {deferredPrompt && !dismissedInstallBanner && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: lang === 'AR' ? 'auto' : '20px',
            left: lang === 'AR' ? '20px' : 'auto',
            zIndex: 9999,
            background: isDarkMode ? '#1e2438' : '#ffffff',
            color: isDarkMode ? '#f8fafc' : '#1e293b',
            padding: '12px 16px',
            borderRadius: '14px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            border: '1px solid #6256eb',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '380px',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#6256eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <Boxes style={{ width: '20px', height: '20px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px' }}>
              {lang === 'AR' ? 'تثبيت Stockly' : lang === 'EN' ? 'Install Stockly' : 'Installer Stockly'}
            </strong>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.8, lineHeight: 1.3 }}>
              {lang === 'AR'
                ? 'احصل على إشعارات وتطبيقا سريعا على جهازك'
                : lang === 'EN'
                ? 'Fast access directly from your desktop or phone'
                : "Accès rapide depuis votre ordinateur ou téléphone."}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              onClick={handleInstallApp}
              style={{
                background: '#6256eb',
                color: '#fff',
                border: 0,
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('installApp')}
            </button>
            <button
              onClick={() => setDismissedInstallBanner(true)}
              style={{
                background: 'transparent',
                border: 0,
                color: isDarkMode ? '#94a3b8' : '#64748b',
                fontSize: '15px',
                cursor: 'pointer',
                padding: '2px 4px',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      </nav>
    </main>
  )
}

