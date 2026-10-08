export type Gender = 'women' | 'men' | 'unisex';

export type Category = 
  | 'Formals'
  | 'Costumes'
  | 'Casuals'
  | 'Sherwanis' 
  | 'Kurta Sets' 
  | 'Suits' 
  | 'Blazers' 
  | 'Lehengas' 
  | 'Sarees' 
  | 'Gowns' 
  | 'Anarkali' 
  | 'Indo-Western' 
  | 'Accessories';

export type Occasion = 
  | 'Wedding'
  | 'Sangeet'
  | 'Haldi'
  | 'Cocktail Party'
  | 'Pre-Wedding Shoot'
  | 'College Function'
  | 'Corporate Gala'
  | 'Job Interview / Boardroom'
  | 'Stage / Theatrical / Play'
  | 'Mythological / Janmashtami'
  | 'Casual Party / Date Night'
  | 'Festivities';

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface CustomMeasurements {
  chest: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeveLength: string;
  outfitLength: string;
}

export type FittingOption = 
  | 'standard' 
  | 'custom' 
  | 'tailor_visit' 
  | 'unstitched_margins';

export interface BookingDateRange {
  id: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  bufferStart: string; // YYYY-MM-DD (2 days before)
  bufferEnd: string;   // YYYY-MM-DD (2 days after)
  orderId?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  height: string;
  bodyType: string;
  sizePurchased: Size;
  fitFeedback: 'Runs Small' | 'True to Size' | 'Runs Large';
  avatarUrl?: string;
  verifiedRent: boolean;
}

export interface Product {
  id: string;
  name: string;
  designerOrBrand: string;
  gender: Gender;
  category: Category;
  occasions: Occasion[];
  color: string;
  fabric: string;
  description: string;
  careInfo: string;
  rentalPrice3Days: number;
  rentalPrice7Days: number;
  rentalPrice10Days: number;
  securityDeposit: number;
  retailValue: number;
  rating: number;
  reviewCount: number;
  images: string[];
  videoThumbnail?: string;
  videoDuration?: string;
  availableSizes: Size[];
  bookings: BookingDateRange[];
  hygieneBadges: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  status: 'Available' | 'Rented' | 'Cleaning' | 'Maintenance';
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize: Size;
  fittingOption: FittingOption;
  customMeasurements?: CustomMeasurements;
  rentalDuration: 3 | 7 | 10;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  deliveryDate: string; // YYYY-MM-DD
  returnDate: string;   // YYYY-MM-DD
  rentalFee: number;
  securityDeposit: number;
  hasBackupSize: boolean;
  backupSize?: Size;
  backupFee: number;
  hasDamageProtection: boolean;
  protectionFee: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
}

export interface VerificationDetails {
  type: 'Aadhaar' | 'PAN';
  idNumber: string;
  isVerified: boolean;
  verifiedAt?: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'emi' | 'cod';

export interface Order {
  orderId: string;
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  pricing: {
    totalRentalFee: number;
    totalSecurityDeposit: number;
    totalBackupFee: number;
    totalProtectionFee: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
  };
  verification: VerificationDetails;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending';
  status: 'Order Confirmed' | 'Preparing' | 'Shipped' | 'Delivered' | 'Return Pickup Scheduled' | 'Quality Check' | 'Completed';
  returnInspection?: {
    condition: 'Good Condition' | 'Minor Damage' | 'Major Damage';
    inspectionNotes: string;
    damageCharge: number;
    refundAmount: number;
    refundStatus: 'Pending' | 'Processed';
    photoUploaded?: boolean;
  };
}
