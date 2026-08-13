import { supabase } from '../lib/supabase.js'

export async function loadRemoteProducts() {
  const { data, error } = await supabase.from('products').select('*, stores(name)').eq('active', true).order('created_at', { ascending: false })
  if (error || !data?.length) return null
  return data.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: Number(product.price),
    oldPrice: Number(product.old_price || product.price),
    badge: product.badge || 'NOVO',
    rating: Number(product.rating || 5),
    reviews: Number(product.reviews || 0),
    image: product.image_url,
    emoji: product.emoji || '🔧',
    sellerId: product.seller_id,
    sellerName: product.stores?.name,
    fitment: { make: product.make, model: product.model, years: product.years || [], engines: product.engines || [] }
  }))
}
