import { supabase } from '../config/supabase'

const generateSuccessToken = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  for (let i = 0; i < 128; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export const createOrder = async (orderData) => {
  try {
    const successToken = generateSuccessToken()
    
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_discord: orderData.discordUsername,
          customer_email: orderData.email,
          bot_id: orderData.botId,
          bot_name: orderData.botName,
          price_sol: orderData.priceSol,
          payment_status: 'pending',
          wallet_address: orderData.walletAddress,
          success_token: successToken,
          token_used: false
        }
      ])
      .select()

    if (error) throw error

    return { success: true, order: data[0] }
  } catch (error) {
    console.error('Error creating order:', error)
    return { success: false, error: error.message }
  }
}

export const updateOrderStatus = async (orderId, status, transactionSignature = null) => {
  try {
    const updateData = {
      payment_status: status,
      updated_at: new Date().toISOString()
    }

    if (transactionSignature) {
      updateData.transaction_signature = transactionSignature
    }

    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()

    if (error) throw error

    return { success: true, order: data[0] }
  } catch (error) {
    console.error('Error updating order:', error)
    return { success: false, error: error.message }
  }
}

export const getOrder = async (orderId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) throw error

    return { success: true, order: data }
  } catch (error) {
    console.error('Error getting order:', error)
    return { success: false, error: error.message }
  }
}

export const getUserOrders = async (discordUsername) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_discord', discordUsername)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, orders: data }
  } catch (error) {
    console.error('Error getting user orders:', error)
    return { success: false, error: error.message }
  }
}

export const getPendingOrders = async () => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, orders: data }
  } catch (error) {
    console.error('Error getting pending orders:', error)
    return { success: false, error: error.message }
  }
}
