// app/api/payments/mpesa-types.ts

export interface CallbackMetadataItem {
  Name: string;
  Value: number | string;
}

export interface CallbackMetadata {
  Item: CallbackMetadataItem[];
}

export interface StkCallback {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  CallbackMetadata: CallbackMetadata;
}

export interface CallbackBody {
  stkCallback: StkCallback;
}

export interface MpesaCallbackRequest {
  Body: CallbackBody;
}