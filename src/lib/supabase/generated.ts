export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: { Row: { id: string; name: string; active: boolean; created_at: string }; Insert: { id?: string; name: string; active?: boolean; created_at?: string }; Update: { id?: string; name?: string; active?: boolean; created_at?: string }; Relationships: [] }
      customers: { Row: { id: string; full_name: string; email: string | null; phone: string; whatsapp: string | null; address: string | null; city: string | null; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id'|'created_at'|'updated_at'> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['customers']['Row']>; Relationships: [] }
      event_enquiries: { Row: { id: string; enquiry_code: string; name: string; phone: string; whatsapp: string | null; email: string | null; event_type: string | null; guest_count: number | null; event_date: string | null; requirements: string | null; status: string; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['event_enquiries']['Row'], 'id'|'created_at'|'updated_at'> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['event_enquiries']['Row']>; Relationships: [] }
      order_items: { Row: { id: string; order_id: string; product_id: string; variant_id: string; product_name: string; variant_label: string; unit_price: number; quantity: number; line_total: number }; Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'> & { id?: string }; Update: Partial<Database['public']['Tables']['order_items']['Row']>; Relationships: [] }
      orders: { Row: { id: string; order_code: string; customer_id: string; status: string; notes: string | null; subtotal: number; total: number; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id'|'created_at'|'updated_at'> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['orders']['Row']>; Relationships: [] }
      owner_profiles: { Row: { id: string; store_name: string; phone: string | null; whatsapp: string | null; email: string | null; address: string | null; opening_hours: string | null; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['owner_profiles']['Row'], 'created_at'|'updated_at'> & { created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['owner_profiles']['Row']>; Relationships: [] }
      product_images: { Row: { id: string; product_id: string; image_url: string; alt_text: string | null; sort_order: number; created_at: string }; Insert: Omit<Database['public']['Tables']['product_images']['Row'], 'id'|'created_at'> & { id?: string; created_at?: string }; Update: Partial<Database['public']['Tables']['product_images']['Row']>; Relationships: [] }
      product_variants: { Row: { id: string; product_id: string; label: string; sku: string | null; price: number; stock: number; active: boolean; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['product_variants']['Row'], 'id'|'created_at'|'updated_at'> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['product_variants']['Row']>; Relationships: [] }
      products: { Row: { id: string; slug: string; name: string; category_id: string | null; gender: string | null; family: string | null; badge: string | null; description: string | null; notes: string[]; active: boolean; featured: boolean; rating: number; review_count: number; created_at: string; updated_at: string }; Insert: Omit<Database['public']['Tables']['products']['Row'], 'id'|'created_at'|'updated_at'> & { id?: string; created_at?: string; updated_at?: string }; Update: Partial<Database['public']['Tables']['products']['Row']>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: { is_owner: { Args: Record<string, never>; Returns: boolean } }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
